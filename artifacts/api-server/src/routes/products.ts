import { Router, Request, Response } from "express";
import { getDb, ObjectId, serializeDoc } from "../lib/mongo";

const router = Router();

// GET /api/products
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { category, search, limit = "50", skip = "0" } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (category) query["category"] = category;
    if (search) query["name"] = { $regex: search, $options: "i" };

    const lim = Math.min(parseInt(limit) || 50, 200);
    const sk = parseInt(skip) || 0;

    const products = await db.collection("products").find(query).skip(sk).limit(lim).toArray();
    const total = await db.collection("products").countDocuments(query);

    res.json({
      products: products.map((p) => serializeDoc(p as Record<string, unknown>)),
      total,
      limit: lim,
      skip: sk,
    });
  } catch (err) {
    req.log?.error({ err }, "listProducts error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/featured
router.get("/featured", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { limit = "8" } = req.query as Record<string, string>;
    const lim = parseInt(limit) || 8;
    let products = await db
      .collection("products")
      .find({ featured: true })
      .sort({ sale_price: 1 })
      .limit(lim)
      .toArray();
    if (!products.length) {
      products = await db.collection("products").find({}).limit(lim).toArray();
    }
    res.json(products.map((p) => serializeDoc(p as Record<string, unknown>)));
  } catch (err) {
    req.log?.error({ err }, "getFeaturedProducts error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/offers
router.get("/offers", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { limit = "12" } = req.query as Record<string, string>;
    const lim = parseInt(limit) || 12;
    const products = await db
      .collection("products")
      .find({ sale_price: { $exists: true, $ne: null } })
      .limit(lim)
      .toArray();
    res.json(products.map((p) => serializeDoc(p as Record<string, unknown>)));
  } catch (err) {
    req.log?.error({ err }, "getOfferProducts error");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/:productId
router.get("/:productId", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { productId } = req.params;
    let product = null;
    try {
      product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
    } catch {
      product = await db.collection("products").findOne({ sku: productId });
    }
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(serializeDoc(product as Record<string, unknown>));
  } catch (err) {
    req.log?.error({ err }, "getProduct error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
