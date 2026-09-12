import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * `alarm` and `normal` are the only coloured variants, and they mean what they
 * say: alarm marks a qualified or exceptional figure, normal marks one that is
 * measured and verified. `code` is the P&ID-style identity tag. Anything purely
 * descriptive stays neutral.
 */
type Variant = "neutral" | "alarm" | "normal" | "code";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  neutral: "border-line text-ink-muted",
  alarm: "border-alarm/45 bg-alarm-soft text-alarm",
  normal: "border-normal/45 bg-normal-soft text-normal",
  code: "border-line-strong text-ink font-mono tracking-[0.18em]",
};

const sizes: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

export function Pill({
  variant = "neutral",
  size = "sm",
  className,
  children,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-pill inline-flex items-center gap-1.5 border font-mono tracking-[0.1em] whitespace-nowrap uppercase",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
