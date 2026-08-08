import { Link, createFileRoute } from "@tanstack/react-router";
import { ImageIcon, Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cartTotal,
  getItemPrice,
  getItemProduct,
  getItemProductId,
  useCart,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { formatPrice, shippingFor } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Shoply" },
      { name: "description", content: "Review the items in your Shoply cart, adjust quantities and continue to checkout." },
      { property: "og:title", content: "Your Cart — Shoply" },
      { property: "og:description", content: "Review your Shoply cart and continue to checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <CartPage />
    </RequireAuth>
  ),
});

function CartPage() {
  const { data: cart, isPending, isError, error, refetch } = useCart();
  const updateItem = useUpdateCartItem();

  const items = cart?.items ?? [];
  const total = cartTotal(cart);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your cart</h1>

      <div className="mt-8">
        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : isError ? (
          <ErrorState message={error.message} onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Browse the catalogue and add something you'll actually enjoy using."
            icon={<ShoppingCart className="h-6 w-6" />}
            action={
              <Button asChild>
                <Link to="/products" search={{ page: 1 }}>
                  Start shopping
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {items.map((item) => {
                const product = getItemProduct(item);
                const productId = getItemProductId(item);
                const image = product?.image ?? product?.images?.[0];
                const price = getItemPrice(item);
                const busy = updateItem.isPending;

                return (
                  <li
                    key={productId}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="product-frame grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl p-3">
                      {image ? (
                        <img
                          src={image}
                          alt={product?.name ?? "Product"}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-muted-foreground">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to="/products/$productId"
                            params={{ productId }}
                            className="truncate text-sm font-semibold hover:text-brand"
                          >
                            {product?.name ?? "Product"}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">{formatPrice(price)} each</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove item"
                          disabled={busy}
                          onClick={() => updateItem.mutate({ productId, quantity: 0 })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            aria-label="Decrease quantity"
                            disabled={busy}
                            onClick={() =>
                              updateItem.mutate({ productId, quantity: Math.max(0, item.quantity - 1) })
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            aria-label="Increase quantity"
                            disabled={busy}
                            onClick={() => updateItem.mutate({ productId, quantity: item.quantity + 1 })}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <span className="text-base font-semibold">{formatPrice(price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shippingFor(total) === 0 ? "Free" : formatPrice(shippingFor(total))}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatPrice(total + shippingFor(total))}</dd>
                </div>
              </dl>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
              <Button asChild variant="ghost" className="mt-2 w-full">
                <Link to="/products" search={{ page: 1 }}>
                  Continue shopping
                </Link>
              </Button>
              {updateItem.isPending && (
                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Updating cart…
                </p>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
