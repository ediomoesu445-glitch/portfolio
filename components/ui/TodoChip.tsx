import { todoLabel } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Renders an unfilled content placeholder as an obvious authoring marker.
 * Never let a TODO sentinel render as if it were a real value.
 */
export function TodoChip({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-pill border-warning/60 inline-flex items-center gap-1.5 border border-dashed",
        "bg-warning/10 text-warning px-2 py-0.5 font-mono text-xs",
        className,
      )}
      title="Placeholder — awaiting real content"
    >
      <span aria-hidden>◌</span>
      {todoLabel(value)}
    </span>
  );
}
