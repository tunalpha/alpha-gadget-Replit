import { Router, Response } from "express";
import { getDb, serializeDoc } from "../lib/mongo";
import { authMiddleware, AuthRequest } from "../lib/auth";

const router = Router();

// GET /api/customer/orders
router.get(
  "/orders",
  authMiddleware as Parameters<typeof router.get>[1],
  async (req: AuthRequest, res: Response) => {
    try {
      const db = getDb();
      const email = req.user?.email;
      const orders = await db
        .collection("orders")
        .find({ customer_email: email })
        .sort({ created_at: -1 })
        .toArray();
      res.json(orders.map((o) => serializeDoc(o as Record<string, unknown>)));
    } catch (err) {
      req.log?.error({ err }, "getCustomerOrders error");
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
