import { Download } from "lucide-react";
import type { Metadata } from "next";
import { about } from "@/content/about";
import { education, certifications } from "@/content/education";
import { profile } from "@/content/profile";
import { formatPeriod, isTodo } from "@/lib/content";
import { languages } from "@/content/skills";
import { ButtonLink } from "@/components/ui/Button";
import { CertificationStrip } from "@/components/ui/CertificationStrip";
import { Headshot } from "@/components/ui/Headshot";
import { SkillBar } from "@/components/ui/SkillBar";
import { Overline } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";
import { TodoChip } from "@/components/ui/TodoChip";

export const metadata: Metadata = {
  title: "About",
  description:
    "Data scientist at Nigeria's midstream and downstream petroleum regulator, mathematics graduate of the University of Uyo, and teacher.",
};

export default function AboutPage() {
  return (
    <>
      <Section divided={false} eyebrow="About" title={about.lede}>
        <div className="mb-12">
          <Headshot size="lg" />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <Reveal className="max-w-prose space-y-6">
            {about.paragraphs.map((paragraph) =>
              isTodo(paragraph) ? (
                <TodoChip key={paragraph} value={paragraph} />
              ) : (
                <p key={paragraph} className="text-ink-muted text-lg leading-relaxed">
                  {paragraph}
                </p>
              ),
            )}

            <div className="flex flex-wrap items-center gap-3 pt-4">
              {profile.resumeUrl ? (
                <ButtonLink href={profile.resumeUrl} variant="primary" download>
                  <Download className="size-4" aria-hidden />
                  Download CV
                </ButtonLink>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="interactive rounded-card border-line text-ink-subtle inline-flex cursor-not-allowed items-center gap-2 border px-5 py-2.5 text-sm font-medium"
                    aria-disabled="true"
                  >
                    <Download className="size-4" aria-hidden />
                    Download CV
                  </span>
                  <TodoChip value="TODO(content): add public/ediomo-esu-cv.pdf, then set profile.resumeUrl" />
                </div>
              )}
              <ButtonLink href={`mailto:${profile.email}`}>Get in touch</ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="divide-line border-line divide-y border-y">
              {about.facts.map((fact) => (
                <div key={fact.label} className="py-4">
                  <dt className="text-overline text-ink-subtle font-mono uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-ink mt-1.5 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <Overline>Languages</Overline>
              <div className="mt-4 space-y-4">
                {languages.map((language, index) => (
                  <SkillBar
                    key={language.name}
                    label={language.name}
                    level={language.level}
                    fraction={language.fraction}
                    note={language.note}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Context" title={about.context.title} tone="subtle">
        <div className="max-w-prose space-y-5">
          <p className="text-ink-muted text-lg leading-relaxed">{about.context.body}</p>
          {isTodo(about.context.note) ? (
            <TodoChip value={about.context.note} />
          ) : (
            <p className="text-ink-muted text-lg leading-relaxed">
              {about.context.note}
            </p>
          )}
        </div>
      </Section>

      <Section eyebrow="Study" title="Education">
        <Reveal>
          <Timeline className="max-w-3xl">
            {education.map((item) => (
              <TimelineItem
                key={item.institution}
                period={formatPeriod(item.start, item.end)}
                title={item.credential}
                subtitle={`${item.institution} · ${item.location}`}
              >
                {item.details && item.details.length > 0 && (
                  <ul className="space-y-2">
                    {item.details.map((detail) =>
                      isTodo(detail) ? (
                        <li key={detail}>
                          <TodoChip value={detail} />
                        </li>
                      ) : (
                        <li
                          key={detail}
                          className="text-ink-muted flex gap-3 text-[15px] leading-relaxed"
                        >
                          <span
                            aria-hidden
                            className="bg-line-strong mt-2.5 size-1 shrink-0"
                          />
                          {detail}
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </TimelineItem>
            ))}
          </Timeline>
        </Reveal>

        {certifications.length > 0 && (
          <Reveal className="mt-16">
            <CertificationStrip certifications={certifications} />
          </Reveal>
        )}
      </Section>
    </>
  );
}
