import express from "express";
import {
  getCart,
  updateCart,
  createCart,
} from "../controllers/cart.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createCartSchema,
  updateCartSchema,
} from "../validations/cart.validation.js";

const router = express.Router();

router.use(auth);

router.get("/", getCart);
router.post("/", validate(createCartSchema), createCart);
router.patch("/", validate(updateCartSchema), updateCart);

export default router;
