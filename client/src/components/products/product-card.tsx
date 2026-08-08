import { Link, useNavigate } from "@tanstack/react-router";
import { ImageIcon, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { StarRating } from "@/components/common/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useUpdateCartItem } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const updateItem = useUpdateCartItem();
  const image = product.image ?? product.images?.[0];

  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart.");
      navigate({ to: "/login", search: { redirect: `/products/${product._id}` } });
      return;
    }
    updateItem.mutate(
      { productId: product._id, quantity: 1 },
      { onSuccess: () => toast.success(`${product.name} added to cart`) },
    );
  };

  return (
    <article className="card-elevated group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="p-3 pb-0">
        <Link
          to="/products/$productId"
          params={{ productId: product._id }}
          className="product-frame relative block aspect-4/3 overflow-hidden rounded-xl p-6 group-hover:-translate-y-0.5"
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)] transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
          {product.category && (
            <Badge variant="secondary" className="absolute left-3 top-3 backdrop-blur">
              {product.category}
            </Badge>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
        <Link
          to="/products/$productId"
          params={{ productId: product._id }}
          className="text-base font-semibold leading-snug transition-colors hover:text-brand"
        >
          {product.name}
        </Link>
        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}
        <StarRating rating={product.ratings ?? 0} count={product.numReviews ?? 0} />
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-lg font-semibold tracking-tight">{formatPrice(product.price)}</span>
          <Button size="sm" onClick={handleAdd} disabled={updateItem.isPending}>
            {updateItem.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
