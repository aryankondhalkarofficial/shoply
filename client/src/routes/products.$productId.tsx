import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImageIcon, Loader2, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StarRating } from "@/components/common/star-rating";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { useUpdateCartItem } from "@/hooks/use-cart";
import { useProduct } from "@/hooks/use-products";
import { formatDate, formatPrice } from "@/lib/format";
import { reviewService } from "@/services/review-service";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({
    meta: [
      { title: "Product Details — Shoply" },
      {
        name: "description",
        content: "See specs, pricing, ratings and customer reviews for this Shoply product.",
      },
      { property: "og:title", content: "Product Details — Shoply" },
      {
        property: "og:description",
        content: "Specs, pricing, ratings and reviews for premium tech accessories at Shoply.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: product, isPending, isError, error, refetch } = useProduct(productId);
  const updateItem = useUpdateCartItem();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const images = product
    ? product.images?.length
      ? product.images
      : product.image
        ? [product.image]
        : []
    : [];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart.");
      navigate({ to: "/login", search: { redirect: `/products/${productId}` } });
      return;
    }
    updateItem.mutate({ productId, quantity }, { onSuccess: () => toast.success("Added to cart") });
  };

  if (isPending) return <ProductDetailSkeleton />;
  if (isError || !product) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <ErrorState message={error?.message ?? "Product not found."} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/products" search={{ page: 1 }}>
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="animate-fade-in">
          <div className="product-frame group aspect-square overflow-hidden rounded-3xl border border-border p-10">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-contain drop-shadow-[0_22px_36px_rgba(0,0,0,0.25)] transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`product-frame h-20 w-20 overflow-hidden rounded-xl border p-2 transition-all ${
                    index === activeImage
                      ? "border-brand"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="animate-fade-up">
          {product.category && <Badge variant="secondary">{product.category}</Badge>}
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={product.ratings ?? 0} count={product.numReviews ?? 0} size="md" />
          </div>
          <p className="mt-6 text-3xl font-semibold tracking-tight">{formatPrice(product.price)}</p>
          {product.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </Button>
              <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </Button>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={handleAddToCart}
              disabled={updateItem.isPending}
            >
              {updateItem.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              Add to cart
            </Button>
          </div>

          {typeof product.countInStock === "number" && (
            <p className="mt-4 text-sm text-muted-foreground">
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : "Currently out of stock"}
            </p>
          )}
        </div>
      </div>

      <ReviewsSection productId={productId} />
    </div>
  );
}

function ReviewsSection({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const {
    data: reviews,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.listByProduct(productId),
  });

  const createReview = useMutation({
    mutationFn: () => reviewService.create(productId, { rating, comment: comment.trim() }),
    onSuccess: () => {
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {isPending ? (
            <>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </>
          ) : isError ? (
            <ErrorState message={error.message} onRetry={() => refetch()} />
          ) : (reviews ?? []).length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Be the first to share what you think about this product."
              icon={<Star className="h-6 w-6" />}
            />
          ) : (
            (reviews ?? []).map((review) => (
              <article key={review._id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {typeof review.user === "object"
                      ? (review.user?.name ?? "Customer")
                      : "Customer"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <StarRating rating={review.rating} className="mt-2" />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </article>
            ))
          )}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold">Write a review</h3>
          {isAuthenticated ? (
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!comment.trim()) {
                  toast.error("Please write a short comment.");
                  return;
                }
                createReview.mutate();
              }}
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Rate ${value} stars`}
                    onClick={() => setRating(value)}
                    className="p-1"
                  >
                    <Star
                      className={`h-5 w-5 transition-transform hover:scale-110 ${
                        value <= rating ? "fill-brand text-brand" : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="How is the product?"
                maxLength={1000}
                rows={4}
              />
              <Button type="submit" className="w-full" disabled={createReview.isPending}>
                {createReview.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit review
              </Button>
            </form>
          ) : (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">Sign in to leave a review.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" search={{ redirect: `/products/${productId}` }}>
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-56 rounded-full" />
      </div>
    </div>
  );
}
