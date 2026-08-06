import express from "express";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
