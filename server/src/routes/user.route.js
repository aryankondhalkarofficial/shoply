import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  profile,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  profileSchema,
} from "../validations/user.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.use(auth);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.patch("/profile", validate(profileSchema), profile);

export default router;
