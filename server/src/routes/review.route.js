import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getReviewsByProduct,
  createReview,
} from "../controllers/review.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createReviewSchema } from "../validations/review.validation.js";

const router = express.Router();

router.get("/:productId", getReviewsByProduct);

router.post("/:productId", auth, validate(createReviewSchema), createReview);

export default router;
