import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  getOrderById,
  createOrder,
} from "../controllers/order.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createOrderSchema } from "../validations/order.validation.js";

const router = express.Router();

router.use(auth);

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", validate(createOrderSchema), createOrder);

export default router;
