"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import placeholder from "@/content/metrics/examination-malpractice-placeholder.json";
import { Overline } from "@/components/ui/Heading";
import { TodoChip } from "@/components/ui/TodoChip";

/**
 * The thesis findings chart, running on placeholder values.
 *
 * The component is real and the animation is real; the numbers are invented
 * shape, and the frame says so in three places — a dashed amber border, a
 * banner, and axis labels marked "placeholder". Nothing here should be read as
 * a result until the results table replaces it.
 */
export function FindingsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  return (
    <figure
      ref={ref}
      className="border-alarm/40 bg-alarm-soft/20 rounded-card border border-dashed"
    >
      <div className="border-alarm/30 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline className="text-alarm">Placeholder values · not results</Overline>
        <TodoChip value={placeholder.replaceWith} />
      </div>

      <div className="h-72 w-full px-2 py-4 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={placeholder.factors}
            margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
          >
            <CartesianGrid
              stroke="var(--line)"
              strokeDasharray="2 4"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
              label={{
                value: placeholder.scale,
                position: "insideBottom",
                offset: -4,
                fill: "var(--ink-subtle)",
                fontSize: 11,
              }}
            />
            <YAxis
              type="category"
              dataKey="factor"
              width={150}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
            />
            <Bar
              dataKey="placeholder"
              fill="var(--alarm)"
              fillOpacity={0.3}
              stroke="var(--alarm)"
              strokeDasharray="3 3"
              isAnimationActive={animate}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="border-alarm/30 text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
        {placeholder.note}
      </figcaption>
    </figure>
  );
}
