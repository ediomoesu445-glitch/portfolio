import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { researchFindings, researchStance } from "@/content/research";
import { isTodo } from "@/lib/content";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { TodoChip } from "@/components/ui/TodoChip";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Methodological findings from applied work in data, machine learning, computer vision and education - including the ones that made the headline number smaller.",
};

/** Body copy, or a visible placeholder where it is still a TODO. */
function Prose({ children }: { children: string }) {
  if (isTodo(children)) return <TodoChip value={children} />;
  return <p className="text-ink-muted text-[15px] leading-relaxed">{children}</p>;
}

export default function ResearchPage() {
  return (
    <>
      <Section
        divided={false}
        eyebrow="Researcher"
        title="Findings, not just models"
        headingLevel={1}
        description="Every project on this site produced something about method as well as a result. Collected here because the pattern only shows when they sit together."
      >
        <Reveal>
          <div className="border-normal max-w-prose border-l pl-6">
            <Overline>{researchStance.title}</Overline>
            <p className="text-ink-muted mt-3 text-[17px] leading-relaxed">
              {researchStance.body}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="The findings" title="What each project established">
        <ol className="divide-line border-line divide-y border-y">
          {researchFindings.map((item, index) => (
            <li key={item.id}>
              <Reveal>
                <article className="grid gap-8 py-12 lg:grid-cols-[1fr_18rem] lg:gap-12">
                  <div className="max-w-prose">
                    <div className="flex items-center gap-3">
                      <span className="text-overline text-ink-subtle font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Pill variant="code">RS</Pill>
                    </div>

                    <h2 className="text-title font-display text-ink mt-4 font-semibold text-balance">
                      {item.question}
                    </h2>

                    <div className="mt-5">
                      <Prose>{item.finding}</Prose>
                    </div>

                    <div className="border-line mt-6 border-l pl-5">
                      <Overline>So what</Overline>
                      <div className="mt-2">
                        <Prose>{item.soWhat}</Prose>
                      </div>
                    </div>

                    <Link
                      href={`/projects/${item.project}`}
                      className="interactive group text-overline text-ink-subtle hover:text-ink mt-6 inline-flex items-center gap-2 font-mono uppercase"
                    >
                      {item.projectLabel}
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>

                  <div className="border-line border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                    <Stat
                      label={item.headline.label}
                      value={item.headline.value}
                      superseded={item.headline.superseded}
                      size="lg"
                    />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Next"
        title="Open to research roles, scholarships and fellowships"
        description="In energy data analytics, energy-sector digitalisation and applied research - in Nigeria or internationally."
        tone="subtle"
      >
        <Link
          href="/contact"
          className="interactive rounded-card border-normal bg-normal text-normal-ink inline-flex items-center gap-2 border px-5 py-2.5 text-sm font-medium"
        >
          Get in touch
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
    </>
  );
}
