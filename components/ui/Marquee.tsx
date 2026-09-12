"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A slow horizontal ticker, used for lists where the sequence does not matter —
 * a stack, a set of tools.
 *
 * With reduced motion requested it renders as a plain wrapped list rather than
 * a stopped ticker, so nothing is hidden off-screen with no way to reach it.
 */
export function Marquee({
  items,
  speedSeconds = 42,
  className,
}: {
  items: ReactNode[];
  speedSeconds?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <ul className={cn("flex flex-wrap gap-x-6 gap-y-3", className)}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        // Fade the ends so items enter and leave rather than being cut off.
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <ul
        style={{ animationDuration: `${speedSeconds}s` }}
        className="animate-marquee flex w-max items-center gap-x-6 group-hover:[animation-play-state:paused]"
      >
        {/* Duplicated so the -50% translation loops seamlessly. The copy is
            hidden from assistive tech to avoid reading every item twice. */}
        {items.map((item, index) => (
          <li key={`a-${index}`}>{item}</li>
        ))}
        {items.map((item, index) => (
          <li key={`b-${index}`} aria-hidden>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
