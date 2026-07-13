import { Router, Response } from "express";
import { getDb, ObjectId, serializeDoc } from "../lib/mongo";
import { adminMiddleware, AuthRequest } from "../lib/auth";

const router = Router();
const admin = adminMiddleware as Parameters<typeof router.get>[1];

function safeUser(user: Record<string, unknown>) {
  const { password_hash, reset_token, ...safe } = user;
  void password_hash; void reset_token;
  return safe;
}

// ── STATS ────────────────────────────────────────────────────────────────
router.get("/stats", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, totalCustomers, totalProducts, recentOrdersDocs] = await Promise.all([
      db.collection("orders").countDocuments(),
      db.collection("users").countDocuments({ role: "customer" }),
      db.collection("products").countDocuments(),
      db.collection("orders").find({}).sort({ created_at: -1 }).limit(10).toArray(),
    ]);

    const allOrders = await db.collection("orders").find({}).toArray();
    const totalRevenue = allOrders
      .filter((o) => o["payment_status"] === "paid" || o["status"] !== "cancelled")
      .reduce((sum, o) => sum + ((o["total"] as number) || 0), 0);

    const thisMonthOrders = allOrders.filter((o) => new Date(o["created_at"] as Date) >= startOfMonth);
    const revenueThisMonth = thisMonthOrders.reduce((sum, o) => sum + ((o["total"] as number) || 0), 0);

    const pending = allOrders.filter((o) => o["status"] === "pending").length;
    const paid = allOrders.filter((o) => o["status"] === "paid").length;
    const shipped = allOrders.filter((o) => o["status"] === "shipped").length;

    res.json({
      total_orders: totalOrders,
      total_revenue: Math.round(totalRevenue * 100) / 100,
      total_customers: totalCustomers,
      total_products: totalProducts,
      pending_orders: pending,
      paid_orders: paid,
      shipped_orders: shipped,
      revenue_this_month: Math.round(revenueThisMonth * 100) / 100,
      orders_this_month: thisMonthOrders.length,
      recent_orders: recentOrdersDocs.map((o) => serializeDoc(o as Record<string, unknown>)),
    });
  } catch (err) {
    req.log?.error({ err }, "getAdminStats error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── ORDERS ───────────────────────────────────────────────────────────────
router.get("/orders", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { status, limit = "50", skip = "0" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (status) query["status"] = status;
    const lim = Math.min(parseInt(limit) || 50, 200);
    const sk = parseInt(skip) || 0;
    const [orders, total] = await Promise.all([
      db.collection("orders").find(query).sort({ created_at: -1 }).skip(sk).limit(lim).toArray(),
      db.collection("orders").countDocuments(query),
    ]);
    res.json({ orders: orders.map((o) => serializeDoc(o as Record<string, unknown>)), total });
  } catch (err) {
    req.log?.error({ err }, "listAdminOrders error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/orders/:orderId/status", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { orderId } = req.params;
    const { status, tracking_number, notes } = req.body as {
      status: string; tracking_number?: string; notes?: string;
    };
    const updates: Record<string, unknown> = { status, updated_at: new Date() };
    if (tracking_number !== undefined) updates["tracking_number"] = tracking_number;
    if (notes !== undefined) updates["notes"] = notes;
    if (["paid", "shipped", "delivered"].includes(status)) updates["payment_status"] = "paid";

    await db.collection("orders").updateOne({ _id: new ObjectId(orderId) }, { $set: updates });
    const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
    res.json(serializeDoc(order as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "updateOrderStatus error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── CUSTOMERS ─────────────────────────────────────────────────────────────
router.get("/customers", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { search, limit = "50", skip = "0" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = { role: "customer" };
    if (search) {
      query["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const lim = Math.min(parseInt(limit) || 50, 200);
    const sk = parseInt(skip) || 0;
    const [users, total] = await Promise.all([
      db.collection("users").find(query).sort({ created_at: -1 }).skip(sk).limit(lim).toArray(),
      db.collection("users").countDocuments(query),
    ]);
    const customers = await Promise.all(
      users.map(async (u) => {
        const orders = await db.collection("orders").find({ customer_email: u["email"] }).toArray();
        const totalSpent = orders.reduce((s, o) => s + ((o["total"] as number) || 0), 0);
        const safe = safeUser(serializeDoc(u as Record<string, unknown>));
        return { ...safe, order_count: orders.length, total_spent: Math.round(totalSpent * 100) / 100 };
      })
    );
    res.json({ customers, total });
  } catch (err) {
    req.log?.error({ err }, "listAdminCustomers error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── CRM STATS ─────────────────────────────────────────────────────────────
router.get("/crm/stats", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [totalCustomers, newThisMonth, users] = await Promise.all([
      db.collection("users").countDocuments({ role: "customer" }),
      db.collection("users").countDocuments({ role: "customer", created_at: { $gte: startOfMonth } }),
      db.collection("users").find({ role: "customer" }).toArray(),
    ]);
    const topCustomers = (
      await Promise.all(
        users.map(async (u) => {
          const orders = await db.collection("orders").find({ customer_email: u["email"] }).toArray();
          const totalSpent = orders.reduce((s, o) => s + ((o["total"] as number) || 0), 0);
          const safe = safeUser(serializeDoc(u as Record<string, unknown>));
          return { ...safe, order_count: orders.length, total_spent: Math.round(totalSpent * 100) / 100 };
        })
      )
    )
      .sort((a, b) => (b.total_spent as number) - (a.total_spent as number))
      .slice(0, 10);
    res.json({ total_customers: totalCustomers, new_this_month: newThisMonth, top_customers: topCustomers });
  } catch (err) {
    req.log?.error({ err }, "getCrmStats error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── PRODUCTS ─────────────────────────────────────────────────────────────
router.get("/products", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { category, search, limit = "100", skip = "0" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (category) query["category"] = category;
    if (search) query["name"] = { $regex: search, $options: "i" };
    const lim = Math.min(parseInt(limit) || 100, 500);
    const sk = parseInt(skip) || 0;
    const [products, categories, total] = await Promise.all([
      db.collection("products").find(query).skip(sk).limit(lim).toArray(),
      db.collection("products").distinct("category"),
      db.collection("products").countDocuments(query),
    ]);
    res.json({
      products: products.map((p) => serializeDoc(p as Record<string, unknown>)),
      categories: categories as string[],
      total,
    });
  } catch (err) {
    req.log?.error({ err }, "listAdminProducts error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/products", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const now = new Date();
    const product = { ...req.body, created_at: now, updated_at: now };
    const result = await db.collection("products").insertOne(product);
    const created = await db.collection("products").findOne({ _id: result.insertedId });
    res.status(201).json(serializeDoc(created as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "createAdminProduct error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/products/:productId", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { productId } = req.params;
    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $set: { ...req.body, updated_at: new Date() } }
    );
    const updated = await db.collection("products").findOne({ _id: new ObjectId(productId) });
    res.json(serializeDoc(updated as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "updateAdminProduct error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/products/:productId", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { productId } = req.params;
    await db.collection("products").deleteOne({ _id: new ObjectId(productId) });
    res.json({ message: "Prodotto eliminato" });
  } catch (err) {
    req.log?.error({ err }, "deleteAdminProduct error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── OFFERS / COUPONS ─────────────────────────────────────────────────────
router.get("/offers", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const offers = await db.collection("offers").find({}).sort({ created_at: -1 }).toArray();
    res.json(offers.map((o) => serializeDoc(o as Record<string, unknown>)));
  } catch (err) {
    req.log?.error({ err }, "listAdminOffers error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/offers", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const now = new Date();
    const offer = { ...req.body, uses_count: 0, created_at: now, updated_at: now };
    const result = await db.collection("offers").insertOne(offer);
    const created = await db.collection("offers").findOne({ _id: result.insertedId });
    res.status(201).json(serializeDoc(created as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "createAdminOffer error");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/offers/:offerId", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { offerId } = req.params;
    await db.collection("offers").updateOne(
      { _id: new ObjectId(offerId) },
      { $set: { ...req.body, updated_at: new Date() } }
    );
    const updated = await db.collection("offers").findOne({ _id: new ObjectId(offerId) });
    res.json(serializeDoc(updated as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "updateAdminOffer error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/offers/:offerId", admin, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const { offerId } = req.params;
    await db.collection("offers").deleteOne({ _id: new ObjectId(offerId) });
    res.json({ message: "Offerta eliminata" });
  } catch (err) {
    req.log?.error({ err }, "deleteAdminOffer error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
