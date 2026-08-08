import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";
import { orderService } from "@/services/order-service";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Your Orders — Shoply" },
      { name: "description", content: "Track your Shoply order history, statuses and totals in one place." },
      { property: "og:title", content: "Your Orders — Shoply" },
      { property: "og:description", content: "Track your Shoply order history and statuses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <OrdersPage />
    </RequireAuth>
  ),
});

function OrdersPage() {
  const { data: orders, isPending, isError, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.list,
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your orders</h1>

      <div className="mt-8 space-y-4">
        {isPending ? (
          <>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </>
        ) : isError ? (
          <ErrorState message={error.message} onRetry={() => refetch()} />
        ) : (orders ?? []).length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="When you place an order it will show up here with its full history."
            icon={<Package className="h-6 w-6" />}
            action={
              <Button asChild>
                <Link to="/products" search={{ page: 1 }}>
                  Start shopping
                </Link>
              </Button>
            }
          />
        ) : (
          (orders ?? []).map((order) => (
            <article
              key={order._id}
              className="card-elevated flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Order #{order._id.slice(-8)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(order.createdAt)} · {order.items?.length ?? 0} item
                  {(order.items?.length ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{order.status ?? (order.isPaid ? "Paid" : "Processing")}</Badge>
                <span className="text-base font-semibold">{formatPrice(order.totalAmount)}</span>
                <Button asChild variant="outline" size="sm">
                  <Link to="/orders/$orderId" params={{ orderId: order._id }}>
                    Details
                  </Link>
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
