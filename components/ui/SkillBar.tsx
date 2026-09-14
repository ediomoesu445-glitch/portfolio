"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Overline } from "./Heading";

/**
 * A proficiency bar.
 *
 * Used only where a real, externally defined scale exists - the CEFR language
 * levels. Skills elsewhere on the site are pills rather than bars, because a
 * bar implies a measured proficiency and no such measurement exists for
 * "scikit-learn" or "stakeholder management". Inventing one would be the same
 * mistake the rest of this site is built to avoid.
 *
 * The bar is decoration; the level code beside it is the data.
 */
export function SkillBar({
  label,
  level,
  fraction,
  note,
  index = 0,
}: {
  label: string;
  /** The scale value itself, e.g. "C2". */
  level: string;
  /** Where that value sits on the scale, 0 to 1. */
  fraction: number;
  note?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-ink text-sm">{label}</span>
        <Overline>{level}</Overline>
      </div>
      <div className="bg-line mt-2 h-1 w-full">
        <motion.div
          className="bg-normal h-full"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${Math.round(fraction * 100)}%` : 0 }}
          transition={{ duration: 0.8, delay: 0.06 * index, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {note && <p className="text-ink-subtle mt-1.5 text-[13px]">{note}</p>}
    </div>
  );
}
