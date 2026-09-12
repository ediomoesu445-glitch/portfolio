import type { Metadata } from "next";
import { identityById } from "@/content/identities";
import { leadershipRoles } from "@/content/leadership";
import { isTodo } from "@/lib/content";
import { Card } from "@/components/ui/Card";
import { Overline } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TodoChip } from "@/components/ui/TodoChip";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Student government, conference convening, and community and media leadership — each shown with what was delivered and at what scale.",
};

export default function LeadershipPage() {
  return (
    <Section
      divided={false}
      eyebrow="Leadership & delivery"
      title="Convening, representing, shipping"
      description="Leadership roles shown with the thing that makes them assessable: what was delivered, at what scale, against what plan."
    >
      <RevealGroup as="ul" className="grid gap-6 lg:grid-cols-3">
        {leadershipRoles.map((role) => (
          <RevealItem as="li" key={`${role.org}-${role.role}`}>
            <Card className="h-full">
              <div className="flex items-start justify-between gap-3">
                {isTodo(role.period) ? (
                  <TodoChip value={role.period} />
                ) : (
                  <Overline>{role.period}</Overline>
                )}
                <div className="flex gap-1.5">
                  {role.identities.map((id) => (
                    <Pill key={id} variant="code">
                      {identityById[id].code}
                    </Pill>
                  ))}
                </div>
              </div>

              <h2 className="text-subtitle font-display text-ink mt-4 font-semibold">
                {role.role}
              </h2>
              <p className="text-ink-muted mt-1 text-sm">{role.org}</p>

              {role.scope && (
                <p className="border-line text-ink-subtle mt-4 border-y py-3 font-mono text-[12px]">
                  {role.scope}
                </p>
              )}

              <p className="text-ink-muted mt-4 text-sm leading-relaxed">
                {role.summary}
              </p>

              <ul className="mt-4 space-y-2">
                {role.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="text-ink-subtle flex gap-2.5 text-sm leading-relaxed"
                  >
                    <span aria-hidden className="bg-line-strong mt-2 size-1 shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
