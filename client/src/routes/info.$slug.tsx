import { Link, createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/info/$slug")({
  head: () => ({
    meta: [
      { title: "Information — Shoply" },
      { name: "description", content: "Placeholder information page for the Shoply portfolio demo project." },
      { property: "og:title", content: "Information — Shoply" },
      { property: "og:description", content: "Placeholder page for the Shoply portfolio demo project." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InfoPage,
});

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function InfoPage() {
  const { slug } = Route.useParams();

  return (
    <div className="gradient-hero flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="animate-fade-up max-w-xl rounded-3xl border border-border bg-card p-10 text-center card-elevated">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-surface text-brand">
          <Info className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{titleFromSlug(slug)}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          This project is not a real service. This is a placeholder page created for a personal
          portfolio project.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/products" search={{ page: 1 }}>
              Browse products
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
