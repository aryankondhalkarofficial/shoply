import Cart from "../models/cart.model.js";
import serverError from "../utils/server-error.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user }).populate(
      "items.product",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const createCart = async (req, res) => {
  try {
    const existingCart = await Cart.findOne({ user: req.user });

    if (existingCart) {
      return res.status(400).json({
        success: false,
        message: "Cart already exists",
      });
    }

    const { product, quantity } = req.body;

    const cart = await Cart.create({
      user: req.user,
      items: [
        {
          product,
          quantity,
        },
      ],
    });

    await cart.populate("items.product");

    return res.status(201).json({
      success: true,
      message: "Cart created",
      cart,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const updateCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "No cart found",
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product,
    );

    // Remove item
    if (quantity === 0) {
      if (existingItemIndex !== -1) {
        cart.items.splice(existingItemIndex, 1);
      }

      await cart.save();
      await cart.populate("items.product");

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart,
      });
    }

    // Update existing item
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity = quantity;
    }

    // Add new item
    else {
      cart.items.push({
        product,
        quantity,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    return serverError(error, res);
  }
};
