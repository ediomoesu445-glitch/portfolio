import type { Metadata } from "next";
import { certifications } from "@/content/education";
import { teaching } from "@/content/teaching";
import { isTodo } from "@/lib/content";
import { Card } from "@/components/ui/Card";
import { Overline } from "@/components/ui/Heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CertificationStrip } from "@/components/ui/CertificationStrip";
import { Section } from "@/components/ui/Section";
import { TodoChip } from "@/components/ui/TodoChip";

export const metadata: Metadata = {
  title: "Teaching",
  description:
    "Mathematics, ICT and computational thinking: subjects taught, clubs led, and one-to-one mentorship.",
};

/** Renders body copy, or an authoring placeholder when it is still a TODO. */
function Copy({ children }: { children: string }) {
  if (isTodo(children)) return <TodoChip value={children} />;
  return <p className="text-ink-muted text-[15px] leading-relaxed">{children}</p>;
}

/** The credentials a school or a scholarship panel would actually ask about. */
const teachingCredentials = certifications.filter((certification) =>
  ["TRCN", "Leadership", "NYSC"].some((key) =>
    `${certification.name} ${certification.issuer}`.includes(key),
  ),
);

export default function TeachingPage() {
  return (
    <>
      <Section
        divided={false}
        eyebrow="Educator"
        title="Teaching"
        headingLevel={1}
        description={teaching.intro}
      >
        <RevealGroup as="ul" className="grid gap-6 md:grid-cols-3">
          {teaching.approach.map((item) => (
            <RevealItem as="li" key={item.title}>
              <Card className="h-full">
                <h2 className="text-subtitle font-display text-ink font-semibold">
                  {item.title}
                </h2>
                <div className="mt-3">
                  <Copy>{item.detail}</Copy>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section eyebrow="Curriculum" title="Subjects taught" tone="subtle">
        <Reveal>
          <dl className="divide-line border-line max-w-3xl divide-y border-y">
            {teaching.subjects.map((subject) => (
              <div
                key={subject.name}
                className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8"
              >
                <dt className="text-subtitle font-display text-ink font-semibold">
                  {subject.name}
                </dt>
                <dd>
                  <Copy>{subject.detail}</Copy>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section eyebrow="Beyond the timetable" title="Clubs and mentorship">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <Overline>Clubs led</Overline>
            <ul className="mt-5 space-y-5">
              {teaching.clubs.map((club) => (
                <li key={club.name} className="border-line border-l pl-5">
                  <h3 className="text-subtitle font-display text-ink font-semibold">
                    {isTodo(club.name) ? <TodoChip value={club.name} /> : club.name}
                  </h3>
                  <p className="text-ink-subtle mt-1 text-sm">
                    {isTodo(club.role) ? <TodoChip value={club.role} /> : club.role}
                  </p>
                  <div className="mt-3">
                    <Copy>{club.summary}</Copy>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <Overline>Mentorship</Overline>
            <ul className="mt-5 space-y-4">
              {teaching.mentorship.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="bg-line-strong mt-2.5 size-1 shrink-0" />
                  <div className="flex-1">
                    <Copy>{item}</Copy>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Credentials"
        title="Qualified to teach"
        description="Registration with the Teachers Registration Council of Nigeria is the statutory requirement for classroom practice; the rest is the training behind it."
        tone="subtle"
      >
        <Reveal>
          <CertificationStrip
            certifications={teachingCredentials}
            title="Teaching and leadership credentials"
          />
        </Reveal>
      </Section>
    </>
  );
}
