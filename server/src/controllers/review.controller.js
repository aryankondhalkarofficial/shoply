import Review from "../models/review.model.js";
import serverError from "../utils/server-error.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return serverError(error, res);
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.create({
      user: req.user,
      product: req.params.productId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review created",
      review,
    });
  } catch (error) {
    return serverError(error, res);
  }
};
