import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name should be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z.string().email("Invalid email").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password should be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters"),

  address: z.string().min(1, "Address is required").trim(),

  city: z.string().min(1, "City is required").trim(),

  postalCode: z.string().min(1, "Postal code is required").trim(),

  state: z.string().min(1, "State is required").trim(),

  country: z.string().min(1, "Country is required").trim(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password should be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters"),
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name should be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .optional(),

  address: z.string().min(1, "Address cannot be empty").trim().optional(),

  city: z.string().min(1, "City cannot be empty").trim().optional(),

  postalCode: z
    .string()
    .min(1, "Postal code cannot be empty")
    .trim()
    .optional(),

  state: z.string().min(1, "State cannot be empty").trim().optional(),

  country: z.string().min(1, "Country cannot be empty").trim().optional(),
});
