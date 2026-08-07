import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name should be at least 2 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .trim(),

  price: z.number().min(0, "Price cannot be negative"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),

  category: z.enum([
    "Computer Accessories",
    "Audio",
    "Charging",
    "Desk Setup",
    "Other",
  ]),

  ratings: z
    .number()
    .min(0, "Ratings cannot be negative")
    .max(5, "Ratings cannot exceed 5")
    .optional(),

  numReviews: z
    .number()
    .int("Number of reviews must be a whole number")
    .min(0, "Number of reviews cannot be negative")
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();
