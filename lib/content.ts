import type { Todo } from "@/content/types";

/**
 * True when a content value is an unfilled placeholder, e.g. "TODO(metric)".
 * The UI uses this to render a visible placeholder chip instead of treating
 * the sentinel as real data.
 */
export function isTodo(value: string | null | undefined): value is Todo {
  return typeof value === "string" && /^TODO\(/.test(value.trim());
}

/** Strips the TODO wrapper for display in authoring/preview contexts. */
export function todoLabel(value: string): string {
  const match = value.trim().match(/^TODO\(([^)]*)\)\s*:?\s*(.*)$/);
  if (!match) return value;
  const [, kind, rest] = match;
  return rest ? `${kind}: ${rest}` : kind;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats an ISO `YYYY-MM` as "Mon YYYY"; passes TODO sentinels through. */
export function formatMonth(value: string | null): string {
  if (value === null) return "Present";
  if (isTodo(value)) return value;
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || !MONTHS[index]) return value;
  return `${MONTHS[index]} ${year}`;
}

/** Formats a start/end pair as a period string. */
export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} - ${formatMonth(end)}`;
}

/** Sorts newest-first, keeping TODO-dated entries in their authored order. */
export function byDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (isTodo(a.date) || isTodo(b.date)) return 0;
    return b.date.localeCompare(a.date);
  });
}
