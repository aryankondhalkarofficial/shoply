import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.patch("/profile", profile);

export default router;
