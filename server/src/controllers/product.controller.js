import Product from "../models/product.model.js";
import serverError from "../utils/server-error.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return serverError(error, res);
  }
};
