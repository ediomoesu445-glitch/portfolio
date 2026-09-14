"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import trace from "@/content/metrics/tep-fault-01-trace.json";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";

const DRAW_MS = 2600;

type Point = { sample: number; value: number; faulty: boolean };
const points = trace.points as Point[];

const firstFaulty = points.findIndex((p) => p.faulty);
const faultyCount = points.length - firstFaulty;

/**
 * Renders a point only where the dataset labels a fault, and delays each one so
 * the markers light up in step with the line drawing across.
 */
function AnomalyDot({
  cx,
  cy,
  payload,
  animate,
}: {
  cx?: number;
  cy?: number;
  payload?: Point;
  animate: boolean;
}) {
  if (!payload?.faulty || cx == null || cy == null) return null;

  const progress = (payload.sample - points[firstFaulty].sample) / faultyCount;
  const delay = animate ? progress * DRAW_MS * (faultyCount / points.length) : 0;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={2.5}
      fill="var(--alarm)"
      style={
        animate
          ? {
              opacity: 0,
              animation: `anomaly-pop 240ms var(--ease-out-soft) ${
                DRAW_MS * (firstFaulty / points.length) + delay
              }ms forwards`,
            }
          : undefined
      }
    />
  );
}

/**
 * A real sensor trace from the Tennessee Eastman Fault 1 testing set, drawn in
 * as it scrolls into view with the labelled fault region lighting up behind it.
 *
 * The highlighted points are the dataset's own ground-truth labels, not model
 * output - the caption says so, because a chart that implies a detector found
 * these would be claiming a result the chart does not show.
 */
export function AnomalyTimeSeries() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  return (
    <figure ref={ref} className="border-line bg-surface border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline>{trace.sensor} · fault 1 testing run</Overline>
        <div className="flex items-center gap-2">
          <Pill variant="normal">normal</Pill>
          <Pill variant="alarm">labelled fault</Pill>
        </div>
      </div>

      <div className="h-64 w-full px-2 py-4 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid
              stroke="var(--line)"
              strokeDasharray="2 4"
              vertical={false}
            />
            <XAxis
              dataKey="sample"
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
              label={{
                value: "sample (3 min apart)",
                position: "insideBottom",
                offset: -4,
                fill: "var(--ink-subtle)",
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
              width={54}
              domain={["dataMin - 0.02", "dataMax + 0.02"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-raised)",
                border: "1px solid var(--line-strong)",
                borderRadius: 2,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--ink-subtle)" }}
              itemStyle={{ color: "var(--ink)" }}
              formatter={(value) => [Number(value).toFixed(4), trace.sensor]}
            />
            <ReferenceLine
              x={trace.faultOnsetSample}
              stroke="var(--alarm)"
              strokeDasharray="3 3"
              label={{
                value: "fault introduced",
                fill: "var(--alarm)",
                fontSize: 11,
                position: "insideTopRight",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--normal)"
              strokeWidth={1.5}
              isAnimationActive={animate}
              animationDuration={DRAW_MS}
              animationEasing="linear"
              dot={<AnomalyDot animate={animate} />}
              activeDot={{ r: 4, fill: "var(--ink)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="border-line text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
        {trace.note} The detector&rsquo;s own per-fault detection rates are in the
        results below.
      </figcaption>
    </figure>
  );
}
