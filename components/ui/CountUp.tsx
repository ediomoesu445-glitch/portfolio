"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

/** Splits "99.50%" into "", 99.5, "%" - and "+0.717" into "+", 0.717, "". */
function parse(value: string) {
  const match = value.match(/^(\D*?)(-?[\d.,]+)(.*)$/);
  if (!match) return null;
  const numeric = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  const decimals = (match[2].split(".")[1] ?? "").length;
  return { prefix: match[1], value: numeric, suffix: match[3], decimals };
}

/**
 * Counts a figure up once, when it scrolls into view.
 *
 * Anything that is not a plain number - a range, a TODO sentinel, "2 of 5" -
 * is rendered untouched rather than mangled, and the final value is what
 * renders on the server, so the number is correct before hydration and for
 * anyone with reduced motion or no JavaScript.
 */
export function CountUp({
  value,
  className,
  durationSeconds = 1.1,
}: {
  value: string;
  className?: string;
  durationSeconds?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  const prefersReducedMotion = useReducedMotion();
  // Memoised: `parse` returns a fresh object each render, and an unmemoised
  // one in the dependency list would restart the animation every frame.
  const parsed = useMemo(() => parse(value), [value]);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || !inView || prefersReducedMotion) return;
    const controls = animate(0, parsed.value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(
          `${parsed.prefix}${latest.toFixed(parsed.decimals)}${parsed.suffix}`,
        );
      },
    });
    return () => controls.stop();
  }, [inView, prefersReducedMotion, parsed, durationSeconds]);

  return (
    <span ref={ref} className={className}>
      {parsed ? display : value}
    </span>
  );
}
