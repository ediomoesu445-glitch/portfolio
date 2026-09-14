"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Ambient backdrop for the hero: a faint instrument grid with two slow sensor
 * traces drifting across it.
 *
 * Deliberately almost invisible. It is one SVG with no JavaScript animation —
 * the drift is CSS, so the global prefers-reduced-motion rule stops it without
 * this component needing to know — and it pauses entirely when scrolled out of
 * view so it costs nothing on the rest of the page.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Fade out towards the bottom so it never competes with the copy.
        "[mask-image:linear-gradient(to_bottom,black,transparent_85%)]",
        className,
      )}
    >
      {/* Instrument grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Two traces, drifting at different rates so they never quite repeat. */}
      <svg
        className="absolute inset-x-0 top-1/3 h-40 w-full"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        fill="none"
      >
        <g
          className="animate-drift-slow"
          style={{ animationPlayState: inView ? "running" : "paused" }}
        >
          <path
            d="M0 96 Q 60 60 120 92 T 240 88 T 360 100 T 480 76 T 600 96 T 720 84 T 840 104 T 960 80 T 1080 96 T 1200 88 T 1320 100 T 1440 84 T 1560 96 T 1680 90 T 1800 96 T 1920 88 T 2040 96 T 2160 92 T 2280 96 T 2400 90"
            stroke="var(--normal)"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
        </g>
        <g
          className="animate-drift-slower"
          style={{ animationPlayState: inView ? "running" : "paused" }}
        >
          <path
            d="M0 132 Q 80 120 160 134 T 320 126 T 480 138 T 640 122 T 800 134 T 960 128 T 1120 136 T 1280 124 T 1440 134 T 1600 130 T 1760 134 T 1920 128 T 2080 134 T 2240 130 T 2400 132"
            stroke="var(--line-strong)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
}
