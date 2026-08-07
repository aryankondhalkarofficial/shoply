import { z } from "zod";

export const createCartSchema = z.object({
  product: z.string().min(1, "Product is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const updateCartSchema = z.object({
  product: z.string().min(1, "Product is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
});
