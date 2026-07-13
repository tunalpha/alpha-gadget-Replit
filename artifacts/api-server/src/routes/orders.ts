import { Router, Request, Response } from "express";
import { getDb, ObjectId, serializeDoc } from "../lib/mongo";
import { authMiddleware, AuthRequest } from "../lib/auth";
import { computeCart } from "./cart";
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "../lib/mailer";

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] || "";

const router = Router();

// POST /api/orders
router.post("/", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const {
      cart_items,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_zip,
      coupon_code,
      notes,
    } = req.body as {
      cart_items: Array<{ product_id: string; quantity: number }>;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: string;
      shipping_city: string;
      shipping_zip: string;
      coupon_code?: string;
      notes?: string;
    };

    const cartResult = await computeCart(db, cart_items, coupon_code || undefined);
    if (!cartResult.items.length) {
      res.status(400).json({ error: "Cart is empty or products not found" });
      return;
    }

    const now = new Date();
    const order = {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_zip,
      items: cartResult.items,
      subtotal: cartResult.subtotal,
      shipping: cartResult.shipping,
      discount: cartResult.discount,
      total: cartResult.total,
      coupon_applied: cartResult.coupon_applied,
      status: "pending",
      payment_status: "pending",
      payment_id: null,
      tracking_number: null,
      notes: notes || null,
      created_at: now,
      updated_at: now,
    };

    const result = await db.collection("orders").insertOne(order);
    const orderId = result.insertedId.toString();

    res.status(201).json({
      order_id: orderId,
      total: cartResult.total,
      message: "Ordine creato con successo",
    });

    // Fire-and-forget emails
    const emailItems = cartResult.items.map((i) => ({
      name: (i.name as string) || "Prodotto",
      quantity: i.quantity as number,
      price: i.price as number,
    }));

    sendOrderConfirmationEmail({
      to: customer_email,
      customerName: customer_name,
      orderId,
      total: cartResult.total,
      items: emailItems,
    }).catch((e) => console.error("sendOrderConfirmationEmail failed:", e));

    if (ADMIN_EMAIL) {
      sendAdminNewOrderEmail({
        adminEmail: ADMIN_EMAIL,
        orderId,
        customerName: customer_name,
        customerEmail: customer_email,
        total: cartResult.total,
        items: emailItems,
      }).catch((e) => console.error("sendAdminNewOrderEmail failed:", e));
    }
  } catch (err) {
    req.log?.error({ err }, "createOrder error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders/:orderId
router.get("/:orderId", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { orderId } = req.params;
    let order = null;
    try {
      order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
    } catch {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(serializeDoc(order as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "getOrder error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/customer/orders
router.get("/customer/list", authMiddleware as Parameters<typeof router.get>[1], async (req: AuthRequest, res: Response) => {
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
});

export default router;
