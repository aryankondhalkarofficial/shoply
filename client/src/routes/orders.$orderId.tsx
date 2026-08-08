import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImageIcon } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { ErrorState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";
import { orderService } from "@/services/order-service";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Details — Shoply" },
      { name: "description", content: "View the items, shipping address and total for this Shoply order." },
      { property: "og:title", content: "Order Details — Shoply" },
      { property: "og:description", content: "Items, shipping address and total for your Shoply order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <OrderDetailPage />
    </RequireAuth>
  ),
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const { data: order, isPending, isError, error, refetch } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderService.getById(orderId),
  });

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-16">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <ErrorState message={error?.message ?? "Order not found."} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/orders">
          <ArrowLeft className="h-4 w-4" /> All orders
        </Link>
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Order #{order._id.slice(-8)}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant="secondary">{order.status ?? (order.isPaid ? "Paid" : "Processing")}</Badge>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Items</h2>
        <ul className="mt-5 divide-y divide-border">
          {(order.items ?? []).map((item, index) => (
            <li key={`${item.product ?? item.name}-${index}`} className="flex items-center gap-4 py-4">
              <div className="product-frame grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl p-2">
                {item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatPrice(item.amount ?? item.price)} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice((item.amount ?? item.price ?? 0) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </section>

      {order.shippingAddress && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-muted-foreground">
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}
            {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </address>
        </section>
      )}
    </div>
  );
}
