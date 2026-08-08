import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/common/states";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";

const PAGE_SIZE = 6;
const CATEGORIES = ["Audio", "Wearables", "Accessories", "Charging", "Gaming"];
const ANY = "any";

interface ProductSearch {
  page: number;
  search?: string | undefined;
  category?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sort?: string | undefined;
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    const num = (value: unknown) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
    };
    const str = (value: unknown) =>
      typeof value === "string" && value.trim() ? value.trim() : undefined;

    const result: ProductSearch = { page: num(search["page"]) || 1 };
    const s = str(search["search"]);
    if (s) result.search = s;
    const c = str(search["category"]);
    if (c) result.category = c;
    const min = num(search["minPrice"]);
    if (min !== undefined) result.minPrice = min;
    const max = num(search["maxPrice"]);
    if (max !== undefined) result.maxPrice = max;
    const sort = str(search["sort"]);
    if (sort) result.sort = sort;
    return result;
  },
  head: () => ({
    meta: [
      { title: "Shop All Products — Shoply" },
      {
        name: "description",
        content:
          "Browse the full Shoply catalogue of premium audio, wearables and tech accessories with search, filters and sorting.",
      },
      { property: "og:title", content: "Shop All Products — Shoply" },
      {
        property: "og:description",
        content: "Search, filter and sort premium tech accessories at Shoply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [searchInput, setSearchInput] = useState(search.search ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setSearchInput(search.search ?? ""), [search.search]);

  const query = {
    page: search.page,
    limit: PAGE_SIZE,
    ...(search.search ? { search: search.search } : {}),
    ...(search.category ? { category: search.category } : {}),
    ...(search.minPrice !== undefined ? { minPrice: search.minPrice } : {}),
    ...(search.maxPrice !== undefined ? { maxPrice: search.maxPrice } : {}),
    ...(search.sort ? { sort: search.sort } : {}),
  };

  const { data, isPending, isError, error, refetch, isFetching } = useProducts(query);

  const update = (patch: Partial<ProductSearch>, resetPage = true) => {
    navigate({
      search: (prev: Record<string, unknown>) => {
        const next = { ...prev, ...patch } as ProductSearch;
        if (resetPage) next.page = 1;
        for (const key of Object.keys(next) as (keyof ProductSearch)[]) {
          if (next[key] === undefined || next[key] === "") delete next[key];
        }
        return next;
      },
    });
  };

  const products = data?.products ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const hasFilters = Boolean(
    search.search || search.category || search.sort || search.minPrice || search.maxPrice,
  );

  const filters = (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        update({ search: searchInput.trim() || undefined });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="wireless…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={search.category ?? ANY}
          onValueChange={(value) => update({ category: value === ANY ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>All categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort by</Label>
        <Select
          value={search.sort ?? ANY}
          onValueChange={(value) => update({ sort: value === ANY ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Featured</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min price (₹)</Label>
          <Input
            id="minPrice"
            type="number"
            min={0}
            defaultValue={search.minPrice ?? ""}
            onBlur={(event) =>
              update({ minPrice: event.target.value ? Number(event.target.value) : undefined })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max price (₹)</Label>
          <Input
            id="maxPrice"
            type="number"
            min={0}
            defaultValue={search.maxPrice ?? ""}
            onBlur={(event) =>
              update({ maxPrice: event.target.value ? Number(event.target.value) : undefined })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Apply filters
      </Button>
    </form>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All products</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {pagination
            ? `${pagination.totalProducts} product${pagination.totalProducts === 1 ? "" : "s"} available`
            : "Browse the curated Shoply catalogue."}
        </p>
      </header>

      {/* Top search bar + mobile filter trigger */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            update({ search: searchInput.trim() || undefined });
          }}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search products"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search headphones, hubs, wearables…"
            className="h-12 rounded-full pl-11 pr-28"
          />
          <Button type="submit" size="sm" className="absolute right-1.5 top-1.5 h-9 rounded-full px-5">
            Search
          </Button>
        </form>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 rounded-full lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
            <SheetTitle className="px-4 pt-4">Filters</SheetTitle>
            <div className="p-4">
              {filters}
              {hasFilters && (
                <Button
                  variant="ghost"
                  className="mt-3 w-full"
                  onClick={() => {
                    navigate({ search: { page: 1 } });
                    setFiltersOpen(false);
                  }}
                >
                  <X className="h-3.5 w-3.5" /> Clear filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[270px_1fr]">
        <aside className="hidden h-fit rounded-2xl border border-border bg-card p-5 card-elevated lg:sticky lg:top-24 lg:block">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => navigate({ search: { page: 1 } })}
              >
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
          {filters}
        </aside>

        <section aria-live="polite">
          {isPending ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={() => refetch()} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="No products match your current filters. Try widening your search or clearing filters."
              action={
                <Button variant="outline" onClick={() => navigate({ search: { page: 1 } })}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div
                className={`grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
                  isFetching ? "opacity-60" : "opacity-100"
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={search.page <= 1}
                    onClick={() => update({ page: search.page - 1 }, false)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <Button
                        key={page}
                        size="sm"
                        variant={page === search.page ? "default" : "outline"}
                        onClick={() => update({ page }, false)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={search.page >= totalPages}
                    onClick={() => update({ page: search.page + 1 }, false)}
                  >
                    Next
                  </Button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
