import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getReviewsByProduct,
  createReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:productId", getReviewsByProduct);

router.post("/:productId", auth, createReview);

export default router;
