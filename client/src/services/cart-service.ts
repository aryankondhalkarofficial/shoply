import { apiRequest } from "./api-client";
import type { Cart } from "@/types";

type CartResponse = { cart?: Cart; data?: Cart } & Partial<Cart>;

function unwrapCart(res: CartResponse | null): Cart {
  const cart = (res?.cart ?? res?.data ?? (res as unknown as Cart)) ?? { items: [] };
  return { ...cart, items: Array.isArray(cart.items) ? cart.items : [] };
}

export const cartService = {
  get: async (): Promise<Cart> => {
    try {
      return unwrapCart(await apiRequest<CartResponse>("/api/carts"));
    } catch (error) {
      // A user with no cart yet is an empty cart, not an error.
      if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
        return { items: [] };
      }
      throw error;
    }
  },

  create: async (product: string, quantity: number) =>
    unwrapCart(await apiRequest<CartResponse>("/api/carts", { method: "POST", body: { product, quantity } })),

  update: async (product: string, quantity: number) =>
    unwrapCart(await apiRequest<CartResponse>("/api/carts", { method: "PATCH", body: { product, quantity } })),
};