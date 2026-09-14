import { AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { identityById } from "@/content/identities";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { formatPeriod, isTodo } from "@/lib/content";
import { MlDemo } from "@/components/projects/MlDemo";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { MotionAsset } from "@/components/projects/motion/MotionAsset";
import { Container } from "@/components/ui/Container";
import { Heading, Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { TodoChip } from "@/components/ui/TodoChip";

const ordered = [...projects].sort((a, b) => a.order - b.order);

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
  return { title: project.title, description: project.tagline };
}

/** Body copy, or a visible placeholder where it is still a TODO. */
function Prose({ children }: { children?: string }) {
  if (!children) return null;
  if (isTodo(children)) return <TodoChip value={children} />;
  return <p className="text-ink-muted text-[17px] leading-relaxed">{children}</p>;
}

function ProjectNav({ current }: { current: Project }) {
  const index = ordered.findIndex((item) => item.slug === current.slug);
  const previous = ordered[index - 1];
  const next = ordered[index + 1];

  return (
    <nav
      aria-label="Other case studies"
      className="border-line bg-line grid gap-px border-t sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/projects/${previous.slug}`}
          className="interactive group bg-bg hover:bg-surface p-8"
        >
          <span className="text-overline text-ink-subtle flex items-center gap-2 font-mono uppercase">
            <ArrowLeft className="size-3.5" aria-hidden />
            Previous
          </span>
          <span className="text-subtitle font-display text-ink mt-3 block font-semibold">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="bg-bg" />
      )}

      {next && (
        <Link
          href={`/projects/${next.slug}`}
          className="interactive group bg-bg hover:bg-surface p-8 text-right"
        >
          <span className="text-overline text-ink-subtle flex items-center justify-end gap-2 font-mono uppercase">
            Next
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="text-subtitle font-display text-ink mt-3 block font-semibold">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
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

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className="py-14 md:py-20">
        <Container>
          <Reveal>
            <Link
              href="/projects"
              className="text-overline text-ink-subtle hover:text-ink inline-flex items-center gap-2 font-mono uppercase"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              All projects
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Pill variant="code">{String(project.order).padStart(2, "0")}</Pill>
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
              {project.tagline}
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
              {isTodo(period) ? (
                <TodoChip value={period} />
              ) : (
                <span className="text-ink-subtle font-mono text-[13px]">{period}</span>
              )}
            </div>
          </Reveal>

          {project.motionAsset && (
            <Reveal delay={0.08} className="mt-12">
              <MotionAsset id={project.motionAsset} />
            </Reveal>
          )}
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

      {/* Objective ------------------------------------------------------- */}
      <Section eyebrow="01" title="Objective" className="pt-16 md:pt-20">
        <div className="max-w-prose">
          <Prose>{project.objective}</Prose>
          {project.problem && (
            <div className="border-line mt-8 border-l pl-6">
              <Overline>The problem</Overline>
              <div className="mt-3">
                <Prose>{project.problem}</Prose>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Approach -------------------------------------------------------- */}
      <Section eyebrow="02" title="Approach" tone="subtle">
        <div className="max-w-prose">
          <Prose>{project.approach}</Prose>
        </div>
      </Section>

      {/* Method & tools -------------------------------------------------- */}
      <Section eyebrow="03" title="Method & tools">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="max-w-prose">
            <Prose>{project.method}</Prose>
          </div>

          <div className="space-y-8">
            <div>
              <Overline>Tools</Overline>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) =>
                  isTodo(item) ? (
                    <li key={item}>
                      <TodoChip value={item} />
                    </li>
                  ) : (
                    <li key={item}>
                      <Pill size="md">{item}</Pill>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {project.dataset && (
              <div className="border-line border-t pt-6">
                <Overline>Data</Overline>
                <p className="text-ink mt-3 text-sm font-medium">
                  {project.dataset.name}
                </p>
                {isTodo(project.dataset.source) ? (
                  <div className="mt-2">
                    <TodoChip value={project.dataset.source} />
                  </div>
                ) : (
                  <p className="text-ink-muted mt-1 text-sm">
                    {project.dataset.source}
                  </p>
                )}
                {project.dataset.note &&
                  (isTodo(project.dataset.note) ? (
                    <div className="mt-3">
                      <TodoChip value={project.dataset.note} />
                    </div>
                  ) : (
                    <p className="text-ink-subtle mt-3 text-[13px] leading-relaxed">
                      {project.dataset.note}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Results --------------------------------------------------------- */}
      <Section eyebrow="04" title="Results" tone="subtle">
        <div className="border-line bg-line grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="bg-bg p-6">
              <Stat label={metric.label} value={metric.value} method={metric.method} />
            </div>
          ))}
        </div>

        {project.outcome && (
          <div className="mt-10 max-w-prose">
            <Prose>{project.outcome}</Prose>
          </div>
        )}
      </Section>

      {/* Live demo ------------------------------------------------------- */}
      {project.slug === "ghost-transaction-detection" && (
        <Section
          eyebrow="Try it"
          title="Score a transaction"
          description="The explainable rule tier, running live. Not the trained model - this uses no labels, which is exactly why it is the part that transfers to a target that has none."
        >
          <Reveal>
            <MlDemo />
          </Reveal>
        </Section>
      )}

      {/* Media gallery --------------------------------------------------- */}
      {(project.media?.length ?? 0) > 0 && (
        <Section
          eyebrow="05"
          title="Gallery"
          description="Figures and reels. Panels crop to keep the carousel working, so every figure links through to the uncropped file."
        >
          <Reveal>
            <ProjectGallery project={project} />
          </Reveal>
        </Section>
      )}

      {/* What I'd do next ------------------------------------------------ */}
      <Section eyebrow="06" title="What I would do next" tone="subtle">
        <ol className="divide-line border-line max-w-prose divide-y border-y">
          {project.nextSteps.map((step, index) => (
            <li key={step} className="flex gap-5 py-5">
              <span className="text-overline text-ink-subtle font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                {isTodo(step) ? (
                  <TodoChip value={step} />
                ) : (
                  <p className="text-ink-muted text-[15px] leading-relaxed">{step}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {project.attribution && (
          <p className="border-line text-ink-subtle mt-12 max-w-prose border-t pt-6 text-[13px] leading-relaxed">
            {project.attribution}
          </p>
        )}
      </Section>

      <ProjectNav current={project} />
    </>
  );
}
