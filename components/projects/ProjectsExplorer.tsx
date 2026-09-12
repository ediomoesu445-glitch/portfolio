"use client";

import { useMemo, useState } from "react";
import type { IdentityId, Project } from "@/content/types";
import { identities } from "@/content/identities";
import { Overline } from "@/components/ui/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

type IdentityFilter = IdentityId | "all";

/** Every distinct stack entry across the catalogue, minus unfilled TODOs. */
function collectSkills(projects: Project[]) {
  const seen = new Map<string, number>();
  for (const project of projects) {
    for (const item of project.stack) {
      if (item.startsWith("TODO(")) continue;
      seen.set(item, (seen.get(item) ?? 0) + 1);
    }
  }
  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "interactive rounded-pill border px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase",
        active
          ? "border-normal bg-normal-soft text-normal"
          : "border-line text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [identity, setIdentity] = useState<IdentityFilter>("all");
  const [skill, setSkill] = useState<string | null>(null);

  const skills = useMemo(() => collectSkills(projects), [projects]);

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        const matchesIdentity =
          identity === "all" || project.identities.includes(identity);
        const matchesSkill = !skill || project.stack.includes(skill);
        return matchesIdentity && matchesSkill;
      }),
    [projects, identity, skill],
  );

  // Only the identities that actually have projects are offered as filters.
  const usedIdentities = identities.filter((item) =>
    projects.some((project) => project.identities.includes(item.id)),
  );

  return (
    <div>
      <div className="border-line flex flex-col gap-6 border-y py-6">
        <div className="flex flex-wrap items-center gap-3">
          <Overline className="w-20 shrink-0">Identity</Overline>
          <div className="flex flex-wrap gap-2">
            <Chip active={identity === "all"} onClick={() => setIdentity("all")}>
              All
            </Chip>
            {usedIdentities.map((item) => (
              <Chip
                key={item.id}
                active={identity === item.id}
                onClick={() => setIdentity(item.id)}
              >
                {item.code} · {item.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Overline className="w-20 shrink-0">Skill</Overline>
          <div className="flex flex-wrap gap-2">
            <Chip active={skill === null} onClick={() => setSkill(null)}>
              Any
            </Chip>
            {skills.map((item) => (
              <Chip
                key={item}
                active={skill === item}
                onClick={() => setSkill(skill === item ? null : item)}
              >
                {item}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="text-ink-subtle mt-6 font-mono text-[13px]">
        {visible.length} of {projects.length} projects
      </p>

      {visible.length === 0 ? (
        <p className="border-line text-ink-muted mt-10 border border-dashed p-10 text-center text-sm">
          No project uses that combination. Clear a filter to see more.
        </p>
      ) : (
        <RevealGroup as="ul" className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <RevealItem as="li" key={project.slug}>
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
