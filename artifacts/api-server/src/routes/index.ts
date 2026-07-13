import { Router } from "express";
import health from "./health";
import products from "./products";
import categories from "./categories";
import cart from "./cart";
import orders from "./orders";
import payments from "./payments";
import auth from "./auth";
import customer from "./customer";
import contact from "./contact";
import offers from "./offers";
import admin from "./admin";

const router = Router();

router.use("/healthz", health);
router.use("/products", products);
router.use("/categories", categories);
router.use("/cart", cart);
router.use("/orders", orders);
router.use("/payments", payments);
router.use("/auth", auth);
router.use("/customer", customer);
router.use("/contact", contact);
router.use("/offers", offers);
router.use("/admin", admin);

export default router;
