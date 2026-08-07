import { z } from "zod";

export const createCartSchema = z.object({
  product: z.string().min(1, "Product is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const updateCartSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1, "Product is required"),

        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "Cart cannot be empty"),
});
