"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  duration,
  ease,
  revealDistance,
  staggerStep,
} from "@/components/motion/motion-tokens";

/**
 * The standard entrance: a short rise and fade as the element scrolls in, once.
 *
 * Reduced motion is handled globally by MotionConfig in
 * components/motion/MotionProvider — it drops the transform and keeps the
 * fade, so this component needs no check of its own.
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
}) {
  const Component = motion[as];

  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y: revealDistance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: duration.slow, delay, ease: ease.outExpo }}
    >
      {children}
    </Component>
  );
}

/**
 * Reveals a group of siblings in sequence. Use for grids and lists rather than
 * hand-computing a delay per item.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-64px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: staggerStep } },
      }}
    >
      {children}
    </Component>
  );
}

/** A child of RevealGroup. */
export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      variants={{
        hidden: { opacity: 0, y: revealDistance },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: duration.slow, ease: ease.outExpo }}
    >
      {children}
    </Component>
  );
}
