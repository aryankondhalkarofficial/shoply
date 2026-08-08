import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { cartQueryKey, cartTotal, getItemPrice, getItemProduct, getItemProductId, useCart } from "@/hooks/use-cart";
import { formatPrice, shippingFor } from "@/lib/format";
import { orderService } from "@/services/order-service";

const addressSchema = z.object({
  address: z.string().trim().min(3, "Address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  postalCode: z.string().trim().min(3, "Postal code is required").max(20),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().min(2, "Country is required").max(100),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Shoply" },
      { name: "description", content: "Confirm your shipping address and place your Shoply order." },
      { property: "og:title", content: "Checkout — Shoply" },
      { property: "og:description", content: "Confirm shipping details and place your Shoply order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
});

function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cart, isPending } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (!user) return;
    setValues((prev) => ({
      address: prev.address || user.address || "",
      city: prev.city || user.city || "",
      postalCode: prev.postalCode || user.postalCode || "",
      state: prev.state || user.state || "",
      country: prev.country || user.country || "",
    }));
  }, [user]);

  const items = cart?.items ?? [];
  const subtotal = cartTotal(cart);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const placeOrder = useMutation({
    mutationFn: async () => {
      const parsed = addressSchema.safeParse(values);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
        setErrors(fieldErrors);
        throw new Error("Please complete the shipping address.");
      }
      setErrors({});
      return orderService.create({
        items: items.map((item) => {
          const product = getItemProduct(item);
          return {
            product: getItemProductId(item),
            name: product?.name ?? "Product",
            image: product?.image ?? product?.images?.[0] ?? "",
            amount: getItemPrice(item),
            quantity: item.quantity,
          };
        }),
        totalAmount: total,
        shippingAddress: parsed.data,
      });
    },
    onSuccess: async (order) => {
      toast.success("Order placed successfully");
      await queryClient.invalidateQueries({ queryKey: cartQueryKey });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (order?._id) navigate({ to: "/orders/$orderId", params: { orderId: order._id } });
      else navigate({ to: "/orders" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-16">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <EmptyState
          title="Nothing to check out"
          description="Add a product to your cart before placing an order."
          action={
            <Button asChild>
              <Link to="/products" search={{ page: 1 }}>
                Browse products
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>

      <form
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
        onSubmit={(event) => {
          event.preventDefault();
          placeOrder.mutate();
        }}
        noValidate
      >
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {(
              [
                ["address", "Address"],
                ["city", "City"],
                ["postalCode", "Postal code"],
                ["state", "State / Region"],
                ["country", "Country"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={`space-y-2 ${key === "address" ? "sm:col-span-2" : ""}`}>
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} value={values[key]} onChange={set(key)} />
                {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> This is a portfolio project — no payment is processed.
          </p>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Summary</h2>
          <ul className="mt-5 space-y-3">
            {items.map((item) => {
              const product = getItemProduct(item);
              return (
                <li key={getItemProductId(item)} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-muted-foreground">
                    {product?.name ?? "Product"} × {item.quantity}
                  </span>
                  <span>{formatPrice(getItemPrice(item) * item.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={placeOrder.isPending}>
            {placeOrder.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Place order
          </Button>
        </aside>
      </form>
    </div>
  );
}
