import { Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import authBackdrop from "@/assets/auth-backdrop.jpg";

const highlights = [
  { icon: Sparkles, text: "Curated premium tech, tested before it's listed" },
  { icon: Truck, text: "Free express shipping on orders over ₹4,999" },
  { icon: ShieldCheck, text: "2-year warranty and 30-day free returns" },
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Visual panel */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src={authBackdrop}
          alt="Premium tech accessories arranged on a dark desk"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" aria-label="Shoply home" className="inline-flex">
            <Logo />
          </Link>
          <div className="animate-fade-up max-w-sm">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Gear worth keeping,
              <br />
              <span className="text-gradient">priced in rupees.</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface text-brand">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Portfolio demo — no real payments are processed.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="gradient-hero flex items-center justify-center px-4 py-14 sm:px-8">
        <div className={`animate-fade-up w-full ${wide ? "max-w-xl" : "max-w-md"}`}>
          <Link to="/" aria-label="Shoply home" className="mb-8 inline-flex lg:hidden">
            <Logo />
          </Link>
          <div className="card-elevated rounded-3xl border border-border bg-card p-8 sm:p-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  );
}