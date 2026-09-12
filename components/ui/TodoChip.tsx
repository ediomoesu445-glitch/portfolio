import { todoLabel } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Renders an unfilled content placeholder as an obvious authoring marker. A
 * TODO sentinel must never render as though it were a real value.
 */
export function TodoChip({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-pill border-alarm/60 inline-flex items-center gap-1.5 border border-dashed",
        "bg-alarm-soft text-alarm px-2 py-0.5 font-mono text-[11px]",
        className,
      )}
      title="Placeholder — awaiting real content"
    >
      <span aria-hidden>◌</span>
      {todoLabel(value)}
    </span>
  );
}
