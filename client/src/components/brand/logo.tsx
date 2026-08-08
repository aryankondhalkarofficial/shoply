import { cn } from "@/lib/utils";

/**
 * Minimal geometric "S" mark for Shoply.
 * Monochrome (uses currentColor) so it reads correctly in light and dark mode.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Shoply"
      className={cn("h-8 w-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" stroke="currentColor" strokeWidth="1.5" opacity="0.28" />
      <path
        d="M22 10.5H14.5A3.5 3.5 0 0 0 14.5 17.5H17.5A3.5 3.5 0 0 1 17.5 24.5H10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      <circle cx="22" cy="22.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <LogoMark className={cn("h-8 w-8", markClassName)} />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-[-0.03em]">Shoply</span>
      )}
    </span>
  );
}