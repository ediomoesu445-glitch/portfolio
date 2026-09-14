"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import data from "@/content/metrics/volve-anomaly-events.json";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";

type Event = (typeof data.events)[number];

const points = data.events.map((event: Event) => ({
  ...event,
  t: new Date(event.start).getTime(),
}));

const formatDay = (value: number) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/**
 * The seven anomaly events that survived calibration, across a 19-day section
 * of hole.
 *
 * Every point is a row from the project's own committed events.csv - no
 * illustration. The sparseness is the finding: after the thresholds were
 * recalibrated on held-out normal drilling, there was very little here for
 * these detectors to find, and saying so is the result.
 */
export function AnomalyEventTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  return (
    <figure ref={ref} className="border-line bg-surface border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline>Well {data.well} · surviving anomaly events</Overline>
        <div className="flex items-center gap-2">
          <Pill variant="alarm">{data.events.length} events</Pill>
          <Pill>{data.totalDurationMin} min total</Pill>
        </div>
      </div>

      <div className="h-64 w-full px-2 py-4 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 20, bottom: 12, left: 0 }}>
            <CartesianGrid
              stroke="var(--line)"
              strokeDasharray="2 4"
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="t"
              domain={["dataMin - 43200000", "dataMax + 43200000"]}
              tickFormatter={formatDay}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="peakScore"
              domain={[0.6, 0.8]}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
              width={54}
              label={{
                value: "peak score",
                angle: -90,
                position: "insideLeft",
                fill: "var(--ink-subtle)",
                fontSize: 11,
              }}
            />
            {/* Marker size carries event duration. */}
            <ZAxis type="number" dataKey="durationMin" range={[60, 420]} />
            <Tooltip
              cursor={{ stroke: "var(--line-strong)" }}
              contentStyle={{
                background: "var(--surface-raised)",
                border: "1px solid var(--line-strong)",
                borderRadius: 2,
                fontSize: 12,
              }}
              labelStyle={{ display: "none" }}
              formatter={(value, name, item) => {
                const point = item?.payload as (typeof points)[number];
                return [
                  `${point.durationMin} min · ${point.detectors} · peak ${point.peakScore}`,
                  `Event ${point.eventId}`,
                ];
              }}
            />
            <Scatter
              data={points}
              fill="var(--alarm)"
              fillOpacity={0.8}
              stroke="var(--alarm)"
              isAnimationActive={animate}
              animationDuration={1600}
              animationEasing="ease-out"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="border-line text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
        {data.note} Marker size is event duration. The largest reads as a connection -
        hookload dropping 107 to 70 kkgf as the string is set in slips - an operational
        transition, not a fault.
      </figcaption>
    </figure>
  );
}
