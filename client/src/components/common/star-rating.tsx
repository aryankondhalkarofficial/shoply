import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({ rating, count, size = "sm", className }: StarRatingProps) {
  const rounded = Math.round(rating ?? 0);
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              dimension,
              value <= rounded ? "fill-brand text-brand" : "text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}