import type { Lens } from "./types";
import lensesData from "./data/lenses.json";

// Data lives in ./data/*.json so the admin panel can read and write it.
// This module types it and is the import every page still uses.

/**
 * The six lenses.
 *
 * Each rewrites the home page for one kind of reader: a hiring manager for an
 * analytics role, a school, a fellowship panel, a programme office. The order
 * matches `identities`, and the `id` is what appears in the URL as `?lens=`.
 *
 * Credentials are drawn from the CV. Figures that would make a role assessable
 * - cohort sizes, attendance, budgets - live in experience.ts and
 * leadership.ts, marked TODO where the CV does not give them.
 */
export const lenses = lensesData as Lens[];

export const lensById = Object.fromEntries(
  lenses.map((lens) => [lens.id, lens]),
) as Record<Lens["id"], Lens>;

/** Validates a `?lens=` value, falling back to the first lens. */
export function resolveLens(value: string | null | undefined): Lens {
  const match = lenses.find((lens) => lens.id === value);
  return match ?? lenses[0];
}
