import { ArrowUpRight, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { identityById } from "@/content/identities";
import { projects } from "@/content/projects";
import { formatPeriod, isTodo } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Heading, Overline } from "@/components/ui/Heading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

/** Narrative sections, rendered only when they hold real content. */
function narrative(project: (typeof projects)[number]) {
  return [
    { label: "The problem", body: project.problem },
    { label: "Approach", body: project.approach },
    { label: "Outcome", body: project.outcome },
  ].filter((part): part is { label: string; body: string } => Boolean(part.body));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const period = project.started
    ? formatPeriod(project.started, project.date)
    : project.date;
  const images = project.media?.filter((item) => item.kind === "image") ?? [];
  const pending = project.media?.filter((item) => isTodo(item.src)) ?? [];

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <Link
              href="/projects"
              className="text-overline text-ink-subtle hover:text-ink font-mono uppercase"
            >
              ← All projects
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {project.identities.map((id) => (
                <Pill key={id} variant="code">
                  {identityById[id].code} · {identityById[id].label}
                </Pill>
              ))}
            </div>

            <Heading level={1} size="headline" className="mt-6 max-w-4xl">
              {project.title}
            </Heading>

            <p className="text-ink-muted mt-5 max-w-prose text-lg leading-relaxed">
              {project.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive rounded-card border-line text-ink hover:border-line-strong inline-flex items-center gap-2 border px-4 py-2 text-sm"
                >
                  {link.label}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ))}
              <span className="text-ink-subtle font-mono text-[13px]">{period}</span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* The caveat comes before the numbers, deliberately. */}
      {project.caveat && (
        <Container>
          <Reveal>
            <aside className="border-alarm/40 bg-alarm-soft flex gap-4 border p-6">
              <AlertTriangle
                className="text-alarm mt-0.5 size-5 shrink-0"
                aria-hidden
              />
              <div>
                <Overline className="text-alarm">Read this first</Overline>
                <p className="text-ink mt-2 max-w-prose text-sm leading-relaxed">
                  {project.caveat}
                </p>
              </div>
            </aside>
          </Reveal>
        </Container>
      )}

      <Section eyebrow="Measured" title="Results" className="pt-16 md:pt-20">
        <div className="border-line bg-line grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="bg-bg p-6">
              <Stat label={metric.label} value={metric.value} method={metric.method} />
            </div>
          ))}
        </div>
      </Section>

      {narrative(project).length > 0 && (
        <Section eyebrow="Case study" title="How it was built" tone="subtle">
          <div className="grid gap-10 md:grid-cols-3">
            {narrative(project).map((part) => (
              <div key={part.label}>
                <Overline>{part.label}</Overline>
                <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
                  {part.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {images.length > 0 && (
        <Section eyebrow="Evidence" title="Figures">
          <div className="grid gap-8 md:grid-cols-2">
            {images.map((media) => (
              <MediaFrame
                key={media.src}
                media={media}
                aspect="4 / 3"
                caption={media.alt}
              />
            ))}
          </div>
          {pending.length > 0 && (
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {pending.map((media) => (
                <MediaFrame key={media.src} media={media} aspect="16 / 9" />
              ))}
            </div>
          )}
        </Section>
      )}

      <Section eyebrow="Built with" title="Stack" tone="subtle">
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item}>
              <Pill size="md">{item}</Pill>
            </li>
          ))}
        </ul>

        {project.attribution && (
          <p className="border-line text-ink-subtle mt-10 max-w-prose border-t pt-6 text-[13px] leading-relaxed">
            {project.attribution}
          </p>
        )}
      </Section>
    </>
  );
}
