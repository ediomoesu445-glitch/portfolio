"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { identities } from "@/content/identities";
import type { Project } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/utils";

/**
 * The five-identity switcher.
 *
 * Implemented as a real tablist: arrow keys move between tabs, Home and End
 * jump to the ends, and only the selected tab is in the tab order — the
 * pattern a screen-reader user expects from something that calls itself tabs.
 */
export function IdentitySwitcher({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const next = (index + identities.length) % identities.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTab(selected + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTab(selected - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(identities.length - 1);
        break;
    }
  }

  const active = identities[selected];
  const evidence = projects.filter((project) => project.identities.includes(active.id));

  return (
    <div className="border-line bg-line grid gap-px border lg:grid-cols-[16rem_1fr]">
      <div
        role="tablist"
        aria-label="Professional identities"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="bg-bg flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {identities.map((identity, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={identity.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              id={`identity-tab-${identity.id}`}
              aria-selected={isSelected}
              aria-controls={`identity-panel-${identity.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(index)}
              className={cn(
                "interactive border-line relative flex shrink-0 items-center gap-3 px-5 py-4 text-left text-sm lg:w-full lg:border-b",
                isSelected
                  ? "bg-surface text-ink"
                  : "text-ink-muted hover:bg-surface hover:text-ink",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-px",
                  isSelected ? "bg-normal" : "bg-transparent",
                )}
              />
              <Icon name={identity.icon} className="size-4 shrink-0" />
              <span className="whitespace-nowrap lg:whitespace-normal">
                {identity.label}
              </span>
              <span className="ml-auto hidden lg:block">
                <Pill variant="code">{identity.code}</Pill>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`identity-panel-${active.id}`}
        aria-labelledby={`identity-tab-${active.id}`}
        tabIndex={0}
        className="bg-bg p-6 md:p-10"
      >
        <Overline>{active.code}</Overline>
        <h3 className="text-title font-display text-ink mt-3 font-semibold text-balance">
          {active.title}
        </h3>
        <p className="text-ink-muted mt-4 max-w-prose text-[15px] leading-relaxed">
          {active.summary}
        </p>

        <ul className="mt-6 space-y-2.5">
          {active.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-ink-subtle flex gap-3 text-[15px] leading-relaxed"
            >
              <span aria-hidden className="bg-line-strong mt-2.5 size-1 shrink-0" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="border-line mt-8 border-t pt-6">
          <Overline>
            {evidence.length > 0 ? "Evidence" : "No project tagged yet"}
          </Overline>
          {evidence.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {evidence.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="interactive text-ink-muted hover:text-ink inline-flex items-baseline gap-2 text-sm"
                  >
                    <span aria-hidden className="text-ink-subtle font-mono">
                      →
                    </span>
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-subtle mt-3 max-w-prose text-sm">
              This identity is documented on its own page rather than through the
              project catalogue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
