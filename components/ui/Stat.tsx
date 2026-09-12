import { isTodo } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Overline } from "./Heading";
import { TodoChip } from "./TodoChip";

type Size = "sm" | "md" | "lg";

const valueSizes: Record<Size, string> = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-[clamp(2.25rem,1.6rem+2vw,3.25rem)]",
};

/**
 * The site's signature element.
 *
 * A figure is shown with whatever qualifies it, in the same object: the
 * flattering number it replaced struck through, and the caveat in alarm amber
 * beside it. This is the one place colour is spent, because it marks the one
 * thing worth noticing — that the published number is the honest one.
 */
export function Stat({
  label,
  value,
  superseded,
  caveat,
  method,
  size = "md",
  className,
}: {
  label: string;
  value: string;
  /** A prior, misleading figure this one replaced. Rendered struck through. */
  superseded?: string;
  /** Why the figure is qualified. Carries the accent. */
  caveat?: string;
  /** How the figure was derived. */
  method?: string;
  size?: Size;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)} data-tabular>
      <Overline>{label}</Overline>

      {isTodo(value) ? (
        <TodoChip value={value} className="self-start" />
      ) : (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {superseded && (
            <span
              className="text-ink-subtle decoration-alarm font-mono text-base line-through decoration-1"
              title="Superseded figure"
            >
              {superseded}
            </span>
          )}
          <span
            className={cn(
              "font-display text-ink font-bold tracking-tight",
              valueSizes[size],
            )}
          >
            {value}
          </span>
        </div>
      )}

      {caveat && (
        <p className="text-alarm max-w-sm text-[13px] leading-snug">{caveat}</p>
      )}
      {method && (
        <p className="text-ink-subtle max-w-sm text-[13px] leading-snug">{method}</p>
      )}
    </div>
  );
}
