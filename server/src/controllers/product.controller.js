import Product from "../models/product.model.js";
import serverError from "../utils/server-error.js";

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      category,
      search,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search by product name
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (sort === "price_asc") {
      productsQuery = productsQuery.sort({ price: 1 });
    }

    if (sort === "price_desc") {
      productsQuery = productsQuery.sort({ price: -1 });
    }

    if (sort === "rating") {
      productsQuery = productsQuery.sort({ ratings: -1 });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await productsQuery.skip(skip).limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        totalProducts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
        limit: Number(limit),
      },
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
