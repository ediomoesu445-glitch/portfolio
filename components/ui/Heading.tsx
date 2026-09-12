import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Size = "display" | "headline" | "title" | "subtitle";

const sizes: Record<Size, string> = {
  display: "text-display font-display font-bold",
  headline: "text-headline font-display font-bold",
  title: "text-title font-display font-semibold",
  subtitle: "text-subtitle font-display font-semibold",
};

/**
 * Semantic level and visual size are separate: a section can start at <h2>
 * while looking like a display heading, so the document outline stays correct
 * without constraining the layout.
 */
export function Heading({
  level = 2,
  size = "headline",
  eyebrow,
  id,
  className,
  children,
}: {
  level?: Level;
  size?: Size;
  eyebrow?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as const;
  return (
    <>
      {eyebrow && <Overline className="mb-3">{eyebrow}</Overline>}
      <Tag id={id} className={cn("text-ink text-balance", sizes[size], className)}>
        {children}
      </Tag>
    </>
  );
}

/** The instrument label: mono, uppercase, widely tracked. */
export function Overline({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-overline text-ink-subtle font-mono uppercase", className)}>
      {children}
    </p>
  );
}
