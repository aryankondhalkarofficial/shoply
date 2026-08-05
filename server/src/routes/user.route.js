import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  profile,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.use(auth);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.patch("/profile", profile);

export default router;
