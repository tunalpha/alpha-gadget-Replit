import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { getDb, ObjectId, serializeDoc } from "../lib/mongo";
import { signToken, authMiddleware, AuthRequest } from "../lib/auth";

const router = Router();

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] || "admin@alphabit.sbs";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "Admin2024!";

function safeUser(user: Record<string, unknown>) {
  const { password_hash, reset_token, ...safe } = user;
  void password_hash; void reset_token;
  return safe;
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { name, email, password, phone } = req.body as {
      name: string; email: string; password: string; phone?: string;
    };
    if (!name || !email || !password) {
      res.status(400).json({ error: "Nome, email e password sono obbligatori" });
      return;
    }
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ error: "Email già in uso" });
      return;
    }
    const password_hash = await bcrypt.hash(password, 12);
    const now = new Date();
    const result = await db.collection("users").insertOne({
      name,
      email: email.toLowerCase(),
      password_hash,
      phone: phone || null,
      role: "customer",
      created_at: now,
      updated_at: now,
    });
    const user = await db.collection("users").findOne({ _id: result.insertedId });
    const serialized = serializeDoc(user as Record<string, unknown>);
    const safe = safeUser(serialized);
    const token = signToken({ userId: safe.id as string, email: email.toLowerCase(), role: "customer" });
    res.status(201).json({ token, user: safe });
  } catch (err) {
    req.log?.error({ err }, "register error");
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { email, password } = req.body as { email: string; password: string };

    // Admin override
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let adminUser = await db.collection("users").findOne({ email: ADMIN_EMAIL.toLowerCase(), role: "admin" });
      if (!adminUser) {
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        const now = new Date();
        const r = await db.collection("users").insertOne({
          name: "Admin",
          email: ADMIN_EMAIL.toLowerCase(),
          password_hash: hash,
          phone: null,
          role: "admin",
          created_at: now,
          updated_at: now,
        });
        adminUser = await db.collection("users").findOne({ _id: r.insertedId });
      }
      const serialized = serializeDoc(adminUser as Record<string, unknown>);
      const safe = safeUser(serialized);
      const token = signToken({ userId: safe.id as string, email: ADMIN_EMAIL.toLowerCase(), role: "admin" });
      res.json({ token, user: safe });
      return;
    }

    const user = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Credenziali non valide" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash as string);
    if (!valid) {
      res.status(401).json({ error: "Credenziali non valide" });
      return;
    }
    const serialized = serializeDoc(user as Record<string, unknown>);
    const safe = safeUser(serialized);
    const token = signToken({ userId: safe.id as string, email: (user.email as string), role: (user.role as string) });
    res.json({ token, user: safe });
  } catch (err) {
    req.log?.error({ err }, "login error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware as Parameters<typeof router.get>[1], async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user!.userId) });
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const serialized = serializeDoc(user as Record<string, unknown>);
    res.json(safeUser(serialized));
  } catch (err) {
    req.log?.error({ err }, "getMe error");
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/profile
router.put("/profile", authMiddleware as Parameters<typeof router.put>[1], async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { name, phone, current_password, new_password } = req.body as {
      name?: string; phone?: string; current_password?: string; new_password?: string;
    };
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user!.userId) });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const updates: Record<string, unknown> = { updated_at: new Date() };
    if (name) updates["name"] = name;
    if (phone !== undefined) updates["phone"] = phone;

    if (current_password && new_password) {
      const valid = await bcrypt.compare(current_password, user.password_hash as string);
      if (!valid) { res.status(400).json({ error: "Password attuale non corretta" }); return; }
      updates["password_hash"] = await bcrypt.hash(new_password, 12);
    }

    await db.collection("users").updateOne({ _id: new ObjectId(req.user!.userId) }, { $set: updates });
    const updated = await db.collection("users").findOne({ _id: new ObjectId(req.user!.userId) });
    const serialized = serializeDoc(updated as Record<string, unknown>);
    res.json(safeUser(serialized));
  } catch (err) {
    req.log?.error({ err }, "updateProfile error");
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { email } = req.body as { email: string };
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (user) {
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { reset_token: token, reset_token_expires: new Date(Date.now() + 3600000), updated_at: new Date() } }
      );
      // Email sending would go here if SMTP is configured
    }
    res.json({ message: "Se l'email esiste, riceverai le istruzioni per reimpostare la password." });
  } catch (err) {
    req.log?.error({ err }, "forgotPassword error");
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { token, new_password } = req.body as { token: string; new_password: string };
    const user = await db.collection("users").findOne({
      reset_token: token,
      reset_token_expires: { $gt: new Date() },
    });
    if (!user) {
      res.status(400).json({ error: "Token non valido o scaduto" });
      return;
    }
    const password_hash = await bcrypt.hash(new_password, 12);
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { password_hash, updated_at: new Date() }, $unset: { reset_token: "", reset_token_expires: "" } }
    );
    res.json({ message: "Password reimpostata con successo" });
  } catch (err) {
    req.log?.error({ err }, "resetPassword error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
