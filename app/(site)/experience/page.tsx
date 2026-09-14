import type { Metadata } from "next";
import { identityById } from "@/content/identities";
import { experience } from "@/content/experience";
import { formatPeriod } from "@/lib/content";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional roles: data science at Nigeria's midstream and downstream petroleum regulator, teaching, and leadership.",
};

export default function ExperiencePage() {
  return (
    <Section
      divided={false}
      eyebrow="Roles"
      title="Experience"
      headingLevel={1}
      description="Newest first. Where a date or an achievement has not been supplied yet it shows as a placeholder rather than being filled with a guess."
    >
      <Reveal>
        <Timeline className="max-w-3xl">
          {experience.map((role) => (
            <TimelineItem
              key={`${role.org}-${role.role}`}
              headingLevel={2}
              period={formatPeriod(role.start, role.end)}
              title={role.role}
              subtitle={`${role.org} · ${role.location}`}
              current={role.current ?? role.end === null}
              meta={
                <div className="flex gap-1.5">
                  {role.identities.map((id) => (
                    <Pill key={id} variant="code">
                      {identityById[id].code}
                    </Pill>
                  ))}
                </div>
              }
            >
              <p className="text-ink-muted max-w-prose text-[15px] leading-relaxed">
                {role.summary}
              </p>

              <ul className="mt-5 space-y-2.5">
                {role.achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="text-ink-muted flex gap-3 text-[15px] leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="bg-line-strong mt-2.5 size-1 shrink-0"
                    />
                    {achievement}
                  </li>
                ))}
              </ul>

              {role.stack && role.stack.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {role.stack.map((item) => (
                    <li key={item}>
                      <Pill>{item}</Pill>
                    </li>
                  ))}
                </ul>
              )}
            </TimelineItem>
          ))}
        </Timeline>
      </Reveal>
    </Section>
  );
}
