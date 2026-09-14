"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Link2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { identities } from "@/content/identities";
import { lenses, resolveLens } from "@/content/lenses";
import type { Project } from "@/content/types";
import { duration, ease } from "@/components/motion/motion-tokens";
import { Overline } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { TodoChip } from "@/components/ui/TodoChip";
import { isTodo } from "@/lib/content";
import { cn } from "@/lib/utils";

const identityByLens = Object.fromEntries(
  identities.map((identity) => [identity.id, identity]),
);

/**
 * The five-identity lens.
 *
 * The selected lens lives in the URL as `?lens=educator`, not in component
 * state, so a link opens the page already framed for whoever it was sent to —
 * a school, a fellowship panel, a programme office. That also makes back and
 * forward work, and makes the view shareable without any extra machinery.
 */
export function LensExperience({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [copied, setCopied] = useState(false);

  const active = resolveLens(searchParams.get("lens"));
  const activeIndex = lenses.findIndex((lens) => lens.id === active.id);

  function select(index: number, { focus = false } = {}) {
    const next = lenses[(index + lenses.length) % lenses.length];
    router.replace(`${pathname}?lens=${next.id}`, { scroll: false });
    if (focus) {
      tabRefs.current[lenses.indexOf(next)]?.focus();
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select(activeIndex + 1, { focus: true });
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select(activeIndex - 1, { focus: true });
        break;
      case "Home":
        event.preventDefault();
        select(0, { focus: true });
        break;
      case "End":
        event.preventDefault();
        select(lenses.length - 1, { focus: true });
        break;
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the URL is in the address bar anyway.
    }
  }

  const featured = active.projects
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  const transition = { duration: duration.base, ease: ease.outSoft };

  return (
    <div>
      {/* Hero copy ------------------------------------------------------- */}
      <div className="min-h-[8.5rem] md:min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
            className="text-ink-muted max-w-3xl text-xl leading-relaxed md:text-2xl"
          >
            {active.headline}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Tabs ------------------------------------------------------------ */}
      {/* The copy-link button is a sibling of the tablist, not a child of it:
          a tablist may only contain tabs, and nesting a plain button there
          also put it in the path of the arrow-key roving focus. */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          aria-label="View this page as"
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-2"
        >
          {lenses.map((lens, index) => {
            const identity = identityByLens[lens.id];
            const selected = lens.id === active.id;
            return (
              <button
                key={lens.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                id={`lens-tab-${lens.id}`}
                aria-selected={selected}
                aria-controls="lens-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                className={cn(
                  "interactive rounded-card inline-flex items-center gap-2 border px-3.5 py-2 text-sm",
                  selected
                    ? "border-normal bg-normal-soft text-normal-strong"
                    : "border-line text-ink-muted hover:text-ink",
                )}
              >
                <Icon name={identity.icon} className="size-4" aria-hidden />
                {identity.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="interactive rounded-card border-line text-ink-muted hover:text-ink ml-auto inline-flex items-center gap-2 border px-3.5 py-2 text-sm"
        >
          {copied ? (
            <Check className="text-normal size-4" aria-hidden />
          ) : (
            <Link2 className="size-4" aria-hidden />
          )}
          {copied ? "Link copied" : "Copy link to this view"}
        </button>
      </div>

      {/* Panel ----------------------------------------------------------- */}
      <div
        role="tabpanel"
        id="lens-panel"
        aria-labelledby={`lens-tab-${active.id}`}
        tabIndex={0}
        className="border-line mt-10 border-t pt-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
          >
            <p className="text-ink-muted max-w-prose text-[17px] leading-relaxed">
              {active.blurb}
            </p>

            {/* Skills */}
            <div className="mt-8">
              <Overline>Highlighted skills</Overline>
              <ul className="mt-4 flex flex-wrap gap-2">
                {active.skills.map((skill, index) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: duration.base,
                      delay: 0.02 * index,
                      ease: ease.outSoft,
                    }}
                  >
                    <Pill size="md">{skill}</Pill>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Credentials */}
            <div className="mt-12">
              <Overline>Relevant experience</Overline>
              <ul className="border-line bg-line mt-5 grid gap-px border md:grid-cols-2">
                {active.credentials.map((item, index) => {
                  const body = (
                    <>
                      <p className="text-subtitle font-display text-ink font-semibold">
                        {item.title}
                      </p>
                      {item.org &&
                        (isTodo(item.org) ? (
                          <div className="mt-2">
                            <TodoChip value={item.org} />
                          </div>
                        ) : (
                          <p className="text-ink-subtle mt-1 font-mono text-[12px]">
                            {item.org}
                          </p>
                        ))}
                      {item.detail && (
                        <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                          {item.detail}
                        </p>
                      )}
                    </>
                  );

                  return (
                    <motion.li
                      key={item.title}
                      className="bg-bg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: duration.base,
                        delay: 0.04 * index,
                      }}
                    >
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="interactive hover:bg-surface block h-full p-6"
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className="h-full p-6">{body}</div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Featured projects */}
            {featured.length > 0 && (
              <div className="mt-12">
                <Overline>Evidence</Overline>
                <ul className="divide-line border-line mt-5 divide-y border-y">
                  {featured.map((project, index) => (
                    <motion.li
                      key={project.slug}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: duration.base,
                        delay: 0.04 * index,
                        ease: ease.outSoft,
                      }}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="interactive group hover:bg-surface flex items-baseline gap-4 py-4"
                      >
                        <span className="text-overline text-ink-subtle font-mono">
                          {String(project.order).padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span className="text-ink block text-[15px]">
                            {project.title}
                          </span>
                          <span className="text-ink-subtle mt-1 block text-sm">
                            {project.tagline}
                          </span>
                        </span>
                        <ArrowRight
                          className="text-ink-subtle group-hover:text-normal size-4 shrink-0 transition-colors"
                          aria-hidden
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Server-rendered stand-in while the URL parameters resolve. */
export function LensFallback() {
  const first = lenses[0];
  return (
    <div>
      <p className="text-ink-muted max-w-3xl text-xl leading-relaxed md:text-2xl">
        {first.headline}
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {lenses.map((lens) => (
          <span
            key={lens.id}
            className="rounded-card border-line text-ink-muted inline-flex items-center gap-2 border px-3.5 py-2 text-sm"
          >
            {identityByLens[lens.id].label}
          </span>
        ))}
      </div>
    </div>
  );
}
