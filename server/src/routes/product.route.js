import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
