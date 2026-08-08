import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

const groups = [
  {
    title: "Company",
    links: [
      { label: "About", slug: "about" },
      { label: "Careers", slug: "careers" },
      { label: "Contact", slug: "contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", slug: "documentation" },
      { label: "Support", slug: "support" },
      { label: "Shipping", slug: "shipping" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", slug: "privacy" },
      { label: "Terms", slug: "terms" },
      { label: "Cookies", slug: "cookies" },
    ],
  },
];

const socials = [
  { label: "Twitter", Icon: Twitter },
  { label: "GitHub", Icon: Github },
  { label: "LinkedIn", Icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Link to="/" aria-label="Shoply home" className="inline-block transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Premium tech accessories, curated for people who care about the details.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ label, Icon }) => (
              <Button
                key={label}
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label={label}
                onClick={() =>
                  toast.info(
                    "This project is not a real service. This is a placeholder link created for a personal portfolio project.",
                  )
                }
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.slug}>
                  <Link
                    to="/info/$slug"
                    params={{ slug: link.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Shoply. Portfolio demo project.</p>
          <p>Not a real store — no payments are processed.</p>
        </div>
      </div>
    </footer>
  );
}
