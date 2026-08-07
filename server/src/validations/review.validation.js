import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z.string().min(3, "Comment should be at least 3 characters").trim(),
});
