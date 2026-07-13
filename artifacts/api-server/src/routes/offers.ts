import { Router, Request, Response } from "express";
import { getDb } from "../lib/mongo";

const router = Router();

// POST /api/offers/validate
router.post("/validate", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { code, subtotal } = req.body as { code: string; subtotal: number };
    if (!code) {
      res.status(400).json({ error: "Codice coupon mancante" });
      return;
    }
    const now = new Date();
    const offer = await db.collection("offers").findOne({
      code: { $regex: new RegExp(`^${code}$`, "i") },
      active: true,
      $or: [{ expires_at: null }, { expires_at: { $gt: now } }],
    });
    if (!offer) {
      res.status(400).json({ error: "Coupon non valido o scaduto" });
      return;
    }
    const minOrder = (offer.min_order as number) || 0;
    if (subtotal < minOrder) {
      res.status(400).json({ error: `Ordine minimo €${minOrder} per questo coupon` });
      return;
    }
    let discountAmount = 0;
    if (offer.discount_type === "percentage") {
      discountAmount = Math.round(subtotal * ((offer.discount_value as number) / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(offer.discount_value as number, subtotal);
    }
    res.json({
      valid: true,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      discount_amount: discountAmount,
      message: `Coupon applicato! Sconto di €${discountAmount.toFixed(2)}`,
    });
  } catch (err) {
    req.log?.error({ err }, "validateOffer error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
