import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * `primary` uses the normal teal, not the alarm amber: amber means a figure is
 * qualified, and spending it on a call to action would make the one signal on
 * the site ambiguous.
 */
type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "border-normal bg-normal text-normal-ink hover:bg-normal/90 hover:border-normal",
  outline: "border-line text-ink hover:border-line-strong hover:bg-surface",
  ghost: "border-transparent text-ink-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-5 py-2.5 text-sm",
};

const base =
  "interactive inline-flex items-center justify-center gap-2 rounded-card border font-medium disabled:pointer-events-none disabled:opacity-50";

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  external,
  variant = "outline",
  size = "md",
  download,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
  download?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        download={download}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} download={download} className={classes}>
      {children}
    </Link>
  );
}
