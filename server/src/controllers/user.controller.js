import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import serverError from "../utils/server-error.js";
import cookieOptions from "../utils/cookie-options.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, address, city, postalCode, state, country } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      city,
      postalCode,
      state,
      country,
    });
    return res.status(201).json({
      success: true,
      message: "User created",
      user: {
        name,
        email,
        address,
        city,
        postalCode,
        state,
        country,
      },
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const token = jwt.sign({ sub: existingUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged in",
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    return res.status(200).json({
      success: true,
      message: "User fetched",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        state: user.state,
        country: user.country,
      },
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user }, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      success: true,
      message: "User profile updated",
    });
  } catch (error) {
    return serverError(error, res);
  }
};
