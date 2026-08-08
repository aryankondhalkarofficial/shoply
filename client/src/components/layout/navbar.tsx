import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Package, ShoppingCart, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { cartCount, useCart } from "@/hooks/use-cart";
import { initialsOf } from "@/lib/format";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
] as const;

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const count = cartCount(cart);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Shoply home" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground bg-surface" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/orders"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground bg-surface" }}
            >
              Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <Button asChild variant="ghost" size="icon" className="relative rounded-full">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-surface text-xs font-semibold">
                    {initialsOf(user?.name)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{user?.name ?? "Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserIcon className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <Package className="h-4 w-4" /> My orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Get started</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">
                <Logo />
              </SheetTitle>
              <nav className="flex flex-col gap-1 p-4">
                <Link to="/" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                  Home
                </Link>
                <Link to="/products" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                  Shop
                </Link>
                <Link to="/cart" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                  Cart
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/orders" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                      Orders
                    </Link>
                    <Link to="/profile" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                      Sign in
                    </Link>
                    <Link to="/register" className="rounded-lg px-3 py-2 text-sm hover:bg-surface">
                      Create account
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
