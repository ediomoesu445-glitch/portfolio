import type { Metadata } from "next";
import { identityById } from "@/content/identities";
import { affiliations, leadershipRoles } from "@/content/leadership";
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
    "Student government, a national students' parliament, conference convening, community M&E and media leadership — each shown with its scope, its stakeholders and what it delivered.",
};

export default function LeadershipPage() {
  return (
    <Section
      divided={false}
      eyebrow="Leadership & delivery"
      title="Convening, representing, shipping"
      description="Each role on three axes: the scope it covered, the people who had to be brought along, and what actually came out of it. The middle one is the axis most CVs leave out, and usually the hardest part."
    >
      <RevealGroup as="ul" className="grid gap-6 lg:grid-cols-2">
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

              <h2 className="text-subtitle font-display text-ink mt-4 font-semibold text-balance">
                {role.role}
              </h2>
              <p className="text-ink-muted mt-1 text-sm">{role.org}</p>

              <p className="text-ink-muted mt-4 text-sm leading-relaxed">
                {role.summary}
              </p>

              {/* Scope ------------------------------------------------- */}
              {role.scope && (
                <div className="border-line mt-6 border-t pt-4">
                  <Overline>Scope</Overline>
                  {isTodo(role.scope) ? (
                    <div className="mt-2">
                      <TodoChip value={role.scope} />
                    </div>
                  ) : (
                    <p className="text-ink-subtle mt-2 text-[13px] leading-relaxed">
                      {role.scope}
                    </p>
                  )}
                </div>
              )}

              {/* Stakeholders ------------------------------------------ */}
              {role.stakeholders && role.stakeholders.length > 0 && (
                <div className="border-line mt-5 border-t pt-4">
                  <Overline>Stakeholders</Overline>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {role.stakeholders.map((person) => (
                      <li key={person}>
                        <Pill>{person}</Pill>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcome ----------------------------------------------- */}
              <div className="border-line mt-5 border-t pt-4">
                <Overline>Outcome</Overline>
                <ul className="mt-3 space-y-2.5">
                  {role.outcomes.map((outcome) =>
                    isTodo(outcome) ? (
                      <li key={outcome}>
                        <TodoChip value={outcome} />
                      </li>
                    ) : (
                      <li
                        key={outcome}
                        className="text-ink-muted flex gap-2.5 text-sm leading-relaxed"
                      >
                        <span aria-hidden className="bg-normal mt-2 size-1 shrink-0" />
                        {outcome}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="border-line mt-20 border-t pt-12">
        <Overline>Memberships</Overline>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {affiliations.map((item) => (
            <li key={item.name}>
              <p className="text-subtitle font-display text-ink font-semibold">
                {item.name}
              </p>
              {item.detail && (
                <p className="text-ink-muted mt-2 text-sm leading-relaxed">
                  {item.detail}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
