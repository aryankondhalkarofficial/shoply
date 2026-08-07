import { z } from "zod";

const orderItemSchema = z.object({
  product: z.string().min(1, "Product is required"),

  name: z.string().min(1, "Product name is required").trim(),

  image: z.string().min(1, "Image is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  amount: z.number().min(0, "Amount cannot be negative"),
});

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),

  totalAmount: z.number().min(0, "Total amount cannot be negative"),

  shippingAddress: z.object({
    address: z.string().min(1, "Address is required").trim(),

    city: z.string().min(1, "City is required").trim(),

    postalCode: z.string().min(1, "Postal code is required").trim(),

    state: z.string().min(1, "State is required").trim(),

    country: z.string().min(1, "Country is required").trim(),
  }),
});
