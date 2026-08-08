import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { RequireAuth } from "@/components/auth/require-auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { initialsOf } from "@/lib/format";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Shoply" },
      { name: "description", content: "View your Shoply account details and default shipping address." },
      { property: "og:title", content: "Your Profile — Shoply" },
      { property: "og:description", content: "Your Shoply account details and shipping address." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const rows: [string, string][] = [
    ["Name", user?.name ?? "—"],
    ["Email", user?.email ?? "—"],
    ["Address", user?.address ?? "—"],
    ["City", user?.city ?? "—"],
    ["Postal code", user?.postalCode ?? "—"],
    ["State", user?.state ?? "—"],
    ["Country", user?.country ?? "—"],
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-lg font-bold">
          {initialsOf(user?.name)}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user?.name ?? "Your profile"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Account details</h2>
        <dl className="mt-5 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/orders">View orders</Link>
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            await logout();
            toast.success("Signed out");
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
