import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The standard panel. Given `href` it renders as a link and picks up the shared
 * hover treatment from the `interactive` utility, so every clickable surface on
 * the site behaves identically.
 */
export function Card({
  href,
  external,
  padded = true,
  tone = "surface",
  className,
  children,
}: {
  href?: string;
  external?: boolean;
  padded?: boolean;
  tone?: "surface" | "raised" | "bare";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    surface: "bg-surface",
    raised: "bg-surface-raised",
    bare: "bg-transparent",
  } as const;

  const classes = cn(
    "block rounded-card border border-line",
    tones[tone],
    padded && "p-6",
    href &&
      "interactive hover:bg-surface-raised hover:-translate-y-0.5 hover:shadow-elev-md",
    className,
  );

  if (!href) return <div className={classes}>{children}</div>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
