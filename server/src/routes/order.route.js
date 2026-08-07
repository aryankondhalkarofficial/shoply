import express from "express";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);

export default router;
