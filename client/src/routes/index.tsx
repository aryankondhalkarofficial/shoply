import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { ErrorState, ProductGridSkeleton } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import heroImage from "@/assets/hero-accessories.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shoply — Premium Tech Accessories, Beautifully Curated" },
      {
        name: "description",
        content:
          "Shop premium audio, wearables and everyday tech accessories at Shoply. Fast delivery, 2-year warranty and free 30-day returns.",
      },
      { property: "og:title", content: "Shoply — Premium Tech Accessories" },
      {
        property: "og:description",
        content: "Premium audio, wearables and everyday tech accessories, curated for detail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const benefits = [
  {
    icon: Truck,
    title: "Free express shipping",
    description: "Every order over ₹4,999 ships free, delivered in 2–4 business days.",
  },
  {
    icon: ShieldCheck,
    title: "2-year warranty",
    description: "Each product is covered end to end, no fine print or hidden clauses.",
  },
  {
    icon: RefreshCcw,
    title: "30-day returns",
    description: "Not the right fit? Send it back within 30 days, no questions asked.",
  },
  {
    icon: BadgeCheck,
    title: "Curated quality",
    description: "We test everything we sell. If it isn't excellent, it isn't listed.",
  },
];

function LandingPage() {
  const { data, isPending, isError, error, refetch } = useProducts({ page: 1, limit: 3 });

  return (
    <div>
      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              New season drop — audio & wearables
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Tech accessories,
              <br />
              <span className="text-gradient">refined to the detail.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Shoply curates a small, exceptional catalogue of headphones, wearables and everyday
              carry — chosen for how they sound, feel and last.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7 transition-transform duration-300 hover:-translate-y-0.5">
                <Link to="/products">
                  Browse the shop <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 transition-transform duration-300 hover:-translate-y-0.5">
                <Link to="/register">Create an account</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["4.9/5", "Average rating"],
                ["30 days", "Free returns"],
                ["24/7", "Human support"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-xl font-semibold tracking-tight">{value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-in group relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/15 blur-3xl transition-opacity duration-700 group-hover:opacity-80" />
            <div className="animate-float overflow-hidden rounded-3xl border border-border shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <img
                src={heroImage}
                alt="Premium wireless headphones, smartwatch and earbuds floating on a dark backdrop"
                width={1600}
                height={1200}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="animate-fade-up group rounded-2xl p-4 transition-colors duration-300 hover:bg-background/60"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-background text-brand shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured products</h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              A snapshot of what's moving right now, straight from the Shoply catalogue.
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/products">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10">
          {isPending ? (
            <ProductGridSkeleton count={3} />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={() => refetch()} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.products ?? []).slice(0, 3).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="gradient-hero relative overflow-hidden rounded-3xl border border-border px-6 py-16 text-center sm:px-14">
          <Headphones className="mx-auto mb-6 h-9 w-9 text-brand" />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Sound, wearables and everyday carry worth keeping.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Create an account to save your cart, track orders and leave reviews on the gear you own.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/register">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/products">Explore catalogue</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
