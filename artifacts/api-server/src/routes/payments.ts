import { Router, Request, Response } from "express";
import { getDb, ObjectId, serializeDoc } from "../lib/mongo";
import { sendOrderStatusEmail, sendAdminNewOrderEmail } from "../lib/mailer";

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] || "";

const router = Router();

const ALPHABITPAY_API_URL = process.env["ALPHABITPAY_API_URL"] || "https://alphabitpay.com/api";
const ALPHABITPAY_EMAIL = process.env["ALPHABITPAY_EMAIL"];
const ALPHABITPAY_PASSWORD = process.env["ALPHABITPAY_PASSWORD"];
const ALPHABITPAY_SECRET_KEY = process.env["ALPHABITPAY_SECRET_KEY"];
const STORE_URL = "https://alphabit.sbs";

async function getAlphaBitPayToken(): Promise<string | null> {
  if (!ALPHABITPAY_EMAIL || !ALPHABITPAY_PASSWORD) return null;
  try {
    const resp = await fetch(`${ALPHABITPAY_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ALPHABITPAY_EMAIL, password: ALPHABITPAY_PASSWORD }),
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as { token?: string; access_token?: string };
    return data.token || data.access_token || null;
  } catch {
    return null;
  }
}

// POST /api/payments
router.post("/", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { order_id } = req.body as { order_id: string; payment_method?: string };

    let order = null;
    try {
      order = await db.collection("orders").findOne({ _id: new ObjectId(order_id) });
    } catch {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const amount = order.total as number;
    const successUrl = `${STORE_URL}/order-success/${order_id}`;
    const failUrl = `${STORE_URL}/checkout`;

    // Try SK key first (simpler), then JWT flow
    let checkoutUrl: string | null = null;
    let paymentId: string = `manual_${order_id}`;

    if (ALPHABITPAY_SECRET_KEY) {
      try {
        const resp = await fetch(`${ALPHABITPAY_API_URL}/payment/create-with-key`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ALPHABITPAY_SECRET_KEY}`,
          },
          body: JSON.stringify({
            amount,
            currency: "EUR",
            description: `Ordine #${order_id}`,
            customer_email: order.customer_email,
            success_url: successUrl,
            cancel_url: failUrl,
            metadata: { order_id },
          }),
        });
        const text = await resp.text();
        let data: Record<string, unknown>;
        try { data = JSON.parse(text); } catch { data = {}; }
        if (resp.ok && (data.checkout_url || data.url)) {
          checkoutUrl = (data.checkout_url || data.url) as string;
          paymentId = (data.id || data.payment_id || paymentId) as string;
        }
      } catch {
        // fall through to JWT flow
      }
    }

    if (!checkoutUrl) {
      const token = await getAlphaBitPayToken();
      if (token) {
        try {
          const resp = await fetch(`${ALPHABITPAY_API_URL}/payment-links`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount,
              currency: "EUR",
              description: `Ordine #${order_id}`,
              customer_email: order.customer_email,
              success_redirect: successUrl,
              fail_redirect: failUrl,
              redirect_url: successUrl,
            }),
          });
          const text = await resp.text();
          let data: Record<string, unknown>;
          try { data = JSON.parse(text); } catch { data = {}; }
          if (resp.ok && (data.checkout_url || data.url || data.link)) {
            checkoutUrl = (data.checkout_url || data.url || data.link) as string;
            paymentId = (data.id || data.payment_id || paymentId) as string;
          }
        } catch {
          // ignore
        }
      }
    }

    // Fallback: direct to success (dev/test mode)
    if (!checkoutUrl) {
      checkoutUrl = successUrl;
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(order_id) },
      { $set: { payment_id: paymentId, updated_at: new Date() } }
    );

    res.json({ checkout_url: checkoutUrl, payment_id: paymentId });
  } catch (err) {
    req.log?.error({ err }, "createPayment error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/payments/status/:orderId
router.get("/status/:orderId", async (req: Request, res: Response) => {
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
    res.json({
      order_id: orderId,
      status: order.payment_status || "pending",
      payment_id: order.payment_id || null,
    });
  } catch (err) {
    req.log?.error({ err }, "getPaymentStatus error");
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/payments/confirm/:orderId
// Called by the success page to mark order as paid and send emails
router.post("/confirm/:orderId", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { orderId } = req.params;

    let order = null;
    try {
      order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
    } catch {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Only update if not already paid
    if (order.payment_status !== "paid") {
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { payment_status: "paid", status: "processing", updated_at: new Date() } }
      );

      // Email customer: payment confirmed
      if (order.customer_email) {
        sendOrderStatusEmail({
          to: order.customer_email as string,
          customerName: (order.customer_name as string) || "Cliente",
          orderId,
          status: "processing",
        }).catch((e) => console.error("sendOrderStatusEmail (confirm) failed:", e));
      }

      // Email admin
      if (ADMIN_EMAIL && order.items) {
        const items = (order.items as Array<{ name: string; quantity: number; price: number }>).map((i) => ({
          name: i.name || "Prodotto",
          quantity: i.quantity,
          price: i.price,
        }));
        sendAdminNewOrderEmail({
          adminEmail: ADMIN_EMAIL,
          orderId,
          customerName: (order.customer_name as string) || "Cliente",
          customerEmail: (order.customer_email as string) || "",
          total: (order.total as number) || 0,
          items,
        }).catch((e) => console.error("sendAdminNewOrderEmail (confirm) failed:", e));
      }
    }

    const updated = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
    res.json(serializeDoc(updated as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "confirmPayment error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
