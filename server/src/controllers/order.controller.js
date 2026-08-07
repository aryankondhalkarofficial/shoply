import Order from "../models/order.model.js";
import serverError from "../utils/server-error.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders made",
      });
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = await Order.create({
      user: req.user,
      items,
      totalAmount,
      shippingAddress,
      status: "Processing",
    });

    return res.status(201).json({
      success: true,
      message: "Order created",
      order,
    });
  } catch (error) {
    return serverError(error, res);
  }
};
