"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import metrics from "@/content/metrics/ghost-transaction-detection.json";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";

const data = metrics.supervised.map((row) => ({
  model: row.model,
  withArtefact: row.prAucWithArtefact,
  artefactFree: row.prAucArtefactFree,
}));

/**
 * What the simulator artefact was worth, per model.
 *
 * The amber bars are the scores that looked publishable and were measuring the
 * data generator; the teal bars are what survived deleting it. Every value is
 * from the project's own REPORT.md, and the gap is the finding.
 */
export function AblationChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  return (
    <figure ref={ref} className="border-line bg-surface border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline>PR-AUC before and after deleting the artefact</Overline>
        <div className="flex items-center gap-2">
          <Pill variant="alarm">measuring the simulator</Pill>
          <Pill variant="normal">artefact-free</Pill>
        </div>
      </div>

      <div className="h-72 w-full px-2 py-4 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            barGap={4}
          >
            <CartesianGrid
              stroke="var(--line)"
              strokeDasharray="2 4"
              vertical={false}
            />
            <XAxis
              dataKey="model"
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              stroke="var(--line)"
              tickLine={false}
              width={44}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-raised)" }}
              contentStyle={{
                background: "var(--surface-raised)",
                border: "1px solid var(--line-strong)",
                borderRadius: 2,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--ink-subtle)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "var(--ink-subtle)" }}
              formatter={(value) =>
                value === "withArtefact" ? "with artefact" : "artefact-free"
              }
            />
            <Bar
              dataKey="withArtefact"
              fill="var(--alarm)"
              fillOpacity={0.35}
              isAnimationActive={animate}
              animationDuration={900}
            >
              {data.map((row) => (
                <Cell key={row.model} />
              ))}
            </Bar>
            <Bar
              dataKey="artefactFree"
              fill="var(--normal)"
              isAnimationActive={animate}
              animationDuration={900}
              animationBegin={250}
            >
              <LabelList
                dataKey="artefactFree"
                position="top"
                fill="var(--ink)"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="border-line text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
        {metrics.caveat} Deleting the artefact and its collinear twin cost XGBoost
        0.1376 PR-AUC, Random Forest 0.1625 and Logistic Regression 0.2043.
      </figcaption>
    </figure>
  );
}
