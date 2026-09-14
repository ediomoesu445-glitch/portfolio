"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * The global reduced-motion guard.
 *
 * `reducedMotion="user"` makes every Framer Motion animation in the tree honour
 * the visitor's OS setting: transform and layout animations are skipped, while
 * opacity still cross-fades so nothing appears or vanishes abruptly. Individual
 * components do not need their own check - this is the one place it lives.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
