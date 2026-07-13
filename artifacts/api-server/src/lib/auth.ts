import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env["JWT_SECRET"] || "alphabit-super-secret-key-2024";
const JWT_EXPIRATION = "24h";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authMiddleware(req, res, async () => {
    // Also allow admin login via env credentials check
    if (req.user?.role === "admin") {
      next();
    } else {
      // Check if they have an admin account in DB
      try {
        const db = getDb();
        const user = await db.collection("users").findOne({ _id: new ObjectId(req.user?.userId) });
        if (user && user.role === "admin") {
          next();
        } else {
          res.status(403).json({ error: "Admin access required" });
        }
      } catch {
        res.status(403).json({ error: "Admin access required" });
      }
    }
  });
}
