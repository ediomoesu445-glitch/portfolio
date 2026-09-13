"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";

/**
 * A schematic of the pattern the label-free rule looks for, not a plot of
 * results: value moving through accounts into destinations that never send
 * anything onward. Those terminal destinations are what the ghost-destination
 * rule flags, at 93.63% precision without using labels.
 *
 * It is a diagram. The caption says so, because an animated graph that looked
 * like output would be claiming a result this does not measure.
 */
const sources = [
  { id: "s1", label: "Operator declaration", y: 40 },
  { id: "s2", label: "Regulator record", y: 110 },
  { id: "s3", label: "Remittance", y: 180 },
];

const destinations = [
  { id: "d1", label: "Reconciled", y: 25, ghost: false },
  { id: "d2", label: "Reconciled", y: 85, ghost: false },
  { id: "d3", label: "No onward flow", y: 145, ghost: true },
  { id: "d4", label: "No onward flow", y: 205, ghost: true },
];

const edges = [
  { from: "s1", to: "d1" },
  { from: "s1", to: "d3" },
  { from: "s2", to: "d2" },
  { from: "s2", to: "d3" },
  { from: "s3", to: "d2" },
  { from: "s3", to: "d4" },
];

const SRC_X = 168;
const DST_X = 420;

export function TransactionGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <figure ref={ref} className="border-line bg-surface border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <Overline>Ghost-destination pattern</Overline>
        <Pill variant="alarm">flagged for review</Pill>
      </div>

      <div className="overflow-x-auto px-2 py-6">
        <svg
          viewBox="0 0 560 250"
          role="img"
          aria-label="Diagram of value flowing from three record types into four destinations, two of which never send anything onward and are flagged for review."
          className="h-56 w-full min-w-[520px]"
        >
          {edges.map((edge, index) => {
            const from = sources.find((s) => s.id === edge.from)!;
            const to = destinations.find((d) => d.id === edge.to)!;
            const midX = (SRC_X + DST_X) / 2;
            const d = `M ${SRC_X} ${from.y + 10} C ${midX} ${from.y + 10}, ${midX} ${to.y + 12}, ${DST_X} ${to.y + 12}`;
            return (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={d}
                fill="none"
                stroke={to.ghost ? "var(--alarm)" : "var(--line-strong)"}
                strokeWidth={to.ghost ? 1.5 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{
                  duration: 0.9,
                  delay: 0.15 * index,
                  ease: [0.33, 1, 0.68, 1],
                }}
              />
            );
          })}

          {sources.map((source, index) => (
            <motion.g
              key={source.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.08 * index }}
            >
              <rect
                x={10}
                y={source.y}
                width={158}
                height={22}
                fill="var(--surface-raised)"
                stroke="var(--line-strong)"
              />
              <text
                x={20}
                y={source.y + 15}
                fill="var(--ink-muted)"
                fontSize={11}
                fontFamily="var(--font-mono)"
              >
                {source.label}
              </text>
            </motion.g>
          ))}

          {destinations.map((destination, index) => (
            <motion.g
              key={destination.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.9 + 0.12 * index }}
            >
              {destination.ghost && (
                // The pulse marks the terminal node; it loops slowly so it
                // reads as a live flag rather than as decoration.
                <motion.circle
                  cx={DST_X}
                  cy={destination.y + 12}
                  r={11}
                  fill="var(--alarm)"
                  initial={{ opacity: 0.15 }}
                  animate={inView ? { opacity: [0.15, 0.4, 0.15] } : undefined}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3 * index,
                  }}
                />
              )}
              <circle
                cx={DST_X}
                cy={destination.y + 12}
                r={4}
                fill={destination.ghost ? "var(--alarm)" : "var(--normal)"}
              />
              <text
                x={DST_X + 14}
                y={destination.y + 16}
                fill={destination.ghost ? "var(--alarm)" : "var(--ink-muted)"}
                fontSize={11}
                fontFamily="var(--font-mono)"
              >
                {destination.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      <figcaption className="border-line text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
        A schematic of the pattern, not a plot of results. Destinations that receive
        value and never pass any on are what the label-free rule flags — 93.63% of those
        flags were real fraud on the labelled proxy.
      </figcaption>
    </figure>
  );
}
