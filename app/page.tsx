import { Container } from "@/components/ui/Container";
import { Heading, Overline } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { identities } from "@/content/identities";
import { profile } from "@/content/profile";

/**
 * Phase 2 homepage. The sections that present projects and experience arrive in
 * later phases; what is here exercises the design system end to end.
 */
export default function HomePage() {
  return (
    <>
      <section className="py-24 md:py-36">
        <Container>
          <Reveal>
            <Overline>
              {profile.location} · {profile.availability}
            </Overline>
            <Heading level={1} size="display" className="mt-6 max-w-[15ch]">
              {profile.name}
            </Heading>
            <p className="text-ink-muted mt-7 max-w-prose text-lg leading-relaxed md:text-xl">
              {profile.bio}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-10 flex flex-wrap items-center gap-3">
              {profile.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    className="interactive rounded-card border-line text-ink-muted hover:text-ink inline-flex items-center gap-2 border px-4 py-2 text-sm"
                  >
                    <Icon name={link.icon} className="size-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <Section
        id="identities"
        eyebrow="Five identities"
        title="One practitioner, five ways in"
        description="Each identity carries a tag rather than a colour. Colour on this site means one of two things — a figure that is qualified, or a figure that is verified — so it is never spent on decoration."
      >
        <RevealGroup
          as="ul"
          className="border-line bg-line grid gap-px border sm:grid-cols-2 lg:grid-cols-3"
        >
          {identities.map((identity) => (
            <RevealItem as="li" key={identity.id} className="bg-bg">
              <article className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <Icon name={identity.icon} className="text-ink-muted size-5" />
                  <Pill variant="code">{identity.code}</Pill>
                </div>
                <h3 className="text-title font-display text-ink mt-5 font-semibold">
                  {identity.label}
                </h3>
                <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                  {identity.summary}
                </p>
                <ul className="border-line text-ink-subtle mt-5 space-y-2 border-t pt-5 text-sm">
                  {identity.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="bg-line-strong mt-2 size-1 shrink-0"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section
        id="work"
        tone="subtle"
        eyebrow="Build status"
        title="Phase 2 complete"
        description="Palette, type and primitives are in place. Project pages and the identity deep-dives follow."
      >
        <RevealGroup as="ol" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { phase: "Phase 3", label: "Project pages and charts" },
            { phase: "Phase 4", label: "The four projects in full" },
            { phase: "Phase 5", label: "Identity deep-dives" },
            { phase: "Phase 6", label: "Live ML demo endpoint" },
          ].map((item) => (
            <RevealItem as="li" key={item.phase}>
              <Card className="h-full">
                <Overline>{item.phase}</Overline>
                <p className="text-ink mt-2 text-sm">{item.label}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
