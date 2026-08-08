import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { cartService } from "@/services/cart-service";
import type { Cart, CartItem, Product } from "@/types";

export const cartQueryKey = ["cart"] as const;

export function getItemProduct(item: CartItem): Product | null {
  return typeof item.product === "object" ? item.product : null;
}

export function getItemProductId(item: CartItem): string {
  return typeof item.product === "object" ? item.product._id : item.product;
}

export function getItemPrice(item: CartItem): number {
  return item.price ?? getItemProduct(item)?.price ?? 0;
}

export function cartTotal(cart: Cart | undefined): number {
  if (!cart) return 0;
  if (typeof cart.totalPrice === "number") return cart.totalPrice;
  return cart.items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
}

export function cartCount(cart: Cart | undefined): number {
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useCart() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: cartService.get,
    enabled: isAuthenticated,
    retry: false,
  });
}

/**
 * Writes go through PATCH (add/update/remove). If the user has no cart yet the
 * backend expects POST /api/carts to create the first item, so we fall back.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const cart = queryClient.getQueryData<Cart>(cartQueryKey);
      const hasCart = Boolean(cart?._id) && (cart?.items.length ?? 0) > 0;
      if (!hasCart && quantity > 0) {
        try {
          return await cartService.create(productId, quantity);
        } catch {
          return await cartService.update(productId, quantity);
        }
      }
      return cartService.update(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}