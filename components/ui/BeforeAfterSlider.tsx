"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Wipe comparison between two images — a clean input and the same input under
 * a simulated field condition, say.
 *
 * The control is a real range input stretched over the frame, so dragging,
 * arrow keys, Home/End and screen-reader semantics all work without being
 * reimplemented. The visible divider is decoration drawn on top of it.
 */
export function BeforeAfterSlider({
  before,
  after,
  aspect = "16 / 10",
  label = "Reveal the second image",
  className,
}: {
  before: { src: string; alt: string; label?: string };
  after: { src: string; alt: string; label?: string };
  aspect?: string;
  label?: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <figure className={cn("w-full", className)}>
      <div
        style={{ aspectRatio: aspect }}
        className="rounded-card border-line bg-bg-subtle relative w-full overflow-hidden border"
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <Image
            src={after.src}
            alt={after.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
          />
        </div>

        {/* Divider */}
        <div
          aria-hidden
          className="bg-alarm pointer-events-none absolute inset-y-0 w-px"
          style={{ left: `${position}%` }}
        >
          <span className="rounded-pill border-alarm bg-bg absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 border" />
        </div>

        {/* Labels */}
        {before.label && (
          <span className="rounded-pill border-line bg-bg/85 text-ink-muted pointer-events-none absolute bottom-3 left-3 border px-2 py-0.5 font-mono text-[11px] tracking-[0.1em] uppercase">
            {before.label}
          </span>
        )}
        {after.label && (
          <span className="rounded-pill border-line bg-bg/85 text-ink-muted pointer-events-none absolute right-3 bottom-3 border px-2 py-0.5 font-mono text-[11px] tracking-[0.1em] uppercase">
            {after.label}
          </span>
        )}

        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${position}% revealed`}
          className="absolute inset-0 size-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>
    </figure>
  );
}
