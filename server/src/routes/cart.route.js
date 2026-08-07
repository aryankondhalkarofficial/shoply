import express from "express";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getCart);
router.post("/", createCart);
router.patch("/:id", updateCart);
router.delete("/:id", deleteCart);

export default router;
