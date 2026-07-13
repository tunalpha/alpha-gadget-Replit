import { Router, Request, Response } from "express";
import { getDb } from "../lib/mongo";

const router = Router();

// GET /api/categories
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const categories = await db.collection("products").distinct("category");
    const counts = await Promise.all(
      categories.map(async (cat: unknown) => {
        const count = await db.collection("products").countDocuments({ category: cat });
        return { name: cat, count };
      })
    );
    res.json(counts);
  } catch (err) {
    req.log?.error({ err }, "listCategories error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
