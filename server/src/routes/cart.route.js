import express from "express";
import {
  getCart,
  addToCart,
  updateCart,
} from "../controllers/cart.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/", updateCart);

export default router;
