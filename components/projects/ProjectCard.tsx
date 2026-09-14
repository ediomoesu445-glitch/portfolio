import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/content/types";
import { identityById } from "@/content/identities";
import { isTodo } from "@/lib/content";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { cn } from "@/lib/utils";

const statusLabels: Record<Project["status"], string> = {
  shipped: "Complete",
  "in-progress": "In progress",
  research: "Research",
  archived: "Archived",
};

/** The first image in a project's media, if it has one. */
function leadImage(project: Project) {
  return project.media?.find((item) => item.kind === "image" && !isTodo(item.src));
}

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const image = leadImage(project);
  const headline = project.metrics.find((metric) => !isTodo(metric.value));

  return (
    <article
      className={cn(
        "interactive group border-line bg-surface hover:bg-surface-raised relative flex h-full flex-col border",
        className,
      )}
    >
      {image && (
        <MediaFrame
          media={image}
          aspect="16 / 9"
          className="border-line border-b [&>div]:rounded-none [&>div]:border-0"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Overline>{statusLabels[project.status]}</Overline>
          <div className="flex gap-1.5">
            {project.identities.map((id) => (
              <Pill key={id} variant="code">
                {identityById[id].code}
              </Pill>
            ))}
          </div>
        </div>

        <h2 className="text-title font-display text-ink mt-4 font-semibold text-balance">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h2>

        <p className="text-ink-muted mt-3 text-sm leading-relaxed">{project.tagline}</p>

        {headline && (
          <p className="border-line text-ink-subtle mt-5 border-t pt-4 font-mono text-[13px]">
            <span className="text-ink">{headline.value}</span> {headline.label}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((item) => (
            <Pill key={item}>{item}</Pill>
          ))}
        </div>

        <span className="text-overline text-ink-subtle group-hover:text-normal mt-6 inline-flex items-center gap-1.5 font-mono uppercase transition-colors">
          Case study
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
