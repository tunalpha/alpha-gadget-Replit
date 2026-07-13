import { Router, Request, Response } from "express";
import { getDb, ObjectId } from "../lib/mongo";

const router = Router();

async function computeCart(
  db: ReturnType<typeof getDb>,
  items: Array<{ product_id: string; quantity: number }>,
  couponCode?: string
) {
  const lineItems = [];
  let subtotal = 0;
  let hasFreeShippingPromo = false;

  for (const item of items) {
    let product = null;
    try {
      product = await db.collection("products").findOne({ _id: new ObjectId(item.product_id) });
    } catch {
      // ignore bad ids
    }
    if (!product) continue;
    const price = (product.sale_price as number) ?? (product.price as number);
    const total = price * item.quantity;
    subtotal += total;
    const sku = (product.sku as string) || "";
    if (["PROMO-IPHONE-001", "PROMO-ANDROID-001"].includes(sku)) {
      hasFreeShippingPromo = true;
    }
    lineItems.push({
      product_id: item.product_id,
      name: product.name,
      image: product.image,
      price,
      quantity: item.quantity,
      total: Math.round(total * 100) / 100,
      sku,
    });
  }

  let discount = 0;
  let couponApplied: string | null = null;

  if (couponCode) {
    const now = new Date();
    const offer = await db.collection("offers").findOne({
      code: { $regex: new RegExp(`^${couponCode}$`, "i") },
      active: true,
      $or: [{ expires_at: null }, { expires_at: { $gt: now } }],
    });
    if (offer) {
      const minOrder = (offer.min_order as number) || 0;
      if (subtotal >= minOrder) {
        if (offer.discount_type === "percentage") {
          discount = Math.round(subtotal * ((offer.discount_value as number) / 100) * 100) / 100;
        } else {
          discount = Math.min(offer.discount_value as number, subtotal);
        }
        couponApplied = couponCode;
      }
    }
  }

  const allOfferItems = lineItems.length > 0 && lineItems.every((i) => i.price <= 0.99);
  const shipping = subtotal - discount >= 49 || hasFreeShippingPromo || allOfferItems ? 0 : 4.99;
  const total = Math.round((subtotal - discount + shipping) * 100) / 100;

  return {
    items: lineItems,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    discount: Math.round(discount * 100) / 100,
    total,
    free_shipping_threshold: 49,
    coupon_applied: couponApplied,
  };
}

// POST /api/cart/calculate
router.post("/calculate", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { items = [], coupon_code } = req.body as {
      items: Array<{ product_id: string; quantity: number }>;
      coupon_code?: string;
    };
    const result = await computeCart(db, items, coupon_code || undefined);
    res.json(result);
  } catch (err) {
    req.log?.error({ err }, "calculateCart error");
    res.status(500).json({ error: "Server error" });
  }
});

export { computeCart };
export default router;
