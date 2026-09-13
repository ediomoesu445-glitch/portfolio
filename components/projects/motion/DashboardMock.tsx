"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import twin from "@/content/metrics/energy-asset-digital-twin.json";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";

type Well = (typeof twin.wells)[number];

/** One-step skill for a well's chosen model, or null where none won. */
function skillOf(well: Well): number | null {
  if (!well.bestOneStep) return null;
  const row = well.oneStep.find((m) => m.model === well.bestOneStep);
  return typeof row?.skill === "number" ? row.skill : null;
}

const wells = twin.wells.map((well) => ({
  id: well.wellId,
  model: well.bestOneStep,
  skill: skillOf(well),
  tests: well.nTest,
}));

/**
 * A loop of the monitoring view: tiles taking focus in turn, the way an
 * operator's eye moves across a wall display.
 *
 * The numbers are the real per-well results from the project's own manifests —
 * skill against a persistence baseline, not R², because on this field a naive
 * baseline already scores R² 0.86 to 0.92.
 */
export function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [focus, setFocus] = useState(0);

  // A slow rotation, and only while on screen — an off-screen timer is just
  // wasted work.
  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const id = setInterval(
      () => setFocus((current) => (current + 1) % wells.length),
      2200,
    );
    return () => clearInterval(id);
  }, [inView, prefersReducedMotion]);

  return (
    <figure ref={ref} className="border-line bg-surface border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline>Field overview · one-step skill</Overline>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="rounded-pill bg-normal size-1.5"
            style={
              prefersReducedMotion
                ? undefined
                : { animation: "tile-pulse 2.2s ease-in-out infinite" }
            }
          />
          <span className="text-ink-subtle font-mono text-[11px]">replay</span>
        </div>
      </div>

      <ul className="bg-line grid grid-cols-2 gap-px lg:grid-cols-5">
        {wells.map((well, index) => {
          const active = index === focus && !prefersReducedMotion;
          const beatsBaseline = well.skill !== null && well.skill > 0;
          return (
            <li key={well.id} className="bg-bg">
              <motion.div
                className="h-full px-4 py-5"
                animate={{
                  backgroundColor: active ? "var(--surface-raised)" : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-ink-subtle font-mono text-[11px]">{well.id}</p>

                <p
                  className="font-display mt-3 text-2xl font-bold tabular-nums"
                  style={{
                    color: beatsBaseline ? "var(--ink)" : "var(--alarm)",
                  }}
                >
                  {well.skill === null
                    ? "—"
                    : `${well.skill > 0 ? "+" : ""}${well.skill.toFixed(3)}`}
                </p>

                <p className="text-ink-subtle mt-2 font-mono text-[11px]">
                  {well.model ?? "no winner"}
                </p>

                {/* A bar, not a gauge: skill is signed, and a dial would imply
                    a floor of zero that does not exist. */}
                <div className="bg-line mt-3 h-1 w-full">
                  <motion.div
                    className="h-full"
                    style={{
                      backgroundColor: beatsBaseline ? "var(--normal)" : "var(--alarm)",
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: inView
                        ? `${Math.min(Math.abs(well.skill ?? 0.04) * 100, 100)}%`
                        : 0,
                    }}
                    transition={{ duration: 0.9, delay: 0.1 * index }}
                  />
                </div>

                <p className="text-ink-subtle mt-3 font-mono text-[11px]">
                  n={well.tests}
                </p>
              </motion.div>
            </li>
          );
        })}
      </ul>

      <div className="border-line flex flex-wrap items-center gap-3 border-t px-5 py-4">
        <Pill variant="normal">beats baseline</Pill>
        <Pill variant="alarm">no model won</Pill>
        <p className="text-ink-subtle text-[13px]">
          Skill is the share of the persistence baseline&rsquo;s squared error removed.
          Zero means no better than predicting yesterday.
        </p>
      </div>
    </figure>
  );
}
