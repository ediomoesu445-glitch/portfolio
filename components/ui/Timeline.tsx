import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isTodo } from "@/lib/content";
import { TodoChip } from "./TodoChip";

/**
 * A vertical rail of dated entries - roles, study, anything with a period.
 * The rail is a hairline with a tick per entry, borrowed from a strip chart.
 */
export function Timeline({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <ol className={cn("border-line relative border-l", className)}>{children}</ol>;
}

export function TimelineItem({
  period,
  title,
  subtitle,
  meta,
  current,
  headingLevel = 3,
  children,
}: {
  /** Already formatted, e.g. "Aug 2026 - Present". TODO sentinels are handled. */
  period: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  /** Marks the entry as ongoing; the tick becomes a live indicator. */
  current?: boolean;
  /**
   * Where the entry sits in the document outline. Defaults to h3, for a
   * timeline under a section heading. On a page where the timeline *is* the
   * content and the page title is the h1, pass 2 - skipping a level is a real
   * failure for anyone navigating by headings.
   */
  headingLevel?: 2 | 3;
  children?: ReactNode;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <li className="relative pb-12 pl-6 last:pb-0 md:pl-8">
      <span
        aria-hidden
        className={cn(
          "absolute top-2 -left-px h-px w-4 md:w-6",
          current ? "bg-normal" : "bg-line-strong",
        )}
      />
      {current && (
        <span
          aria-hidden
          className="rounded-pill bg-normal absolute top-[3px] -left-[3px] size-1.5"
        />
      )}

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {isTodo(period) ? (
          <TodoChip value={period} />
        ) : (
          <span className="text-overline text-ink-subtle font-mono uppercase">
            {period}
          </span>
        )}
        {meta}
      </div>

      <Heading className="text-subtitle font-display text-ink mt-2 font-semibold">
        {title}
      </Heading>
      {subtitle && <p className="text-ink-muted mt-1 text-sm">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </li>
  );
}
