/**
 * Motion conventions.
 *
 * Every animation on the site uses one of these. Three durations, two easings,
 * one entrance distance — the same restraint the palette follows.
 */
export const duration = {
  fast: 0.15,
  base: 0.28,
  slow: 0.62,
} as const;

/** Matches --ease-out-expo / --ease-out-soft in globals.css. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outSoft: [0.33, 1, 0.68, 1],
} as const;

/** How far a revealed element travels. One value, everywhere. */
export const revealDistance = 20;

/** Delay between siblings in a staggered group. */
export const staggerStep = 0.06;
