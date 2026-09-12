import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { identities } from "@/content/identities";
import { profile } from "@/content/profile";

/**
 * Phase 0 placeholder. It exists to prove the scaffold end to end — design
 * tokens, typed content, fonts, motion, accessibility — and is replaced by the
 * real homepage in Phase 1.
 */
export default function HomePage() {
  return (
    <>
      <section className="border-line/60 border-b py-24 md:py-36">
        <div className="container-content">
          <Reveal>
            <p className="text-overline text-accent font-mono uppercase">
              {profile.location} · {profile.availability}
            </p>
            <h1 className="text-display text-ink mt-6 max-w-[16ch] font-semibold">
              {profile.name}
            </h1>
            <p className="text-ink-muted mt-6 max-w-prose text-lg leading-relaxed md:text-xl">
              {profile.bio}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 flex flex-wrap items-center gap-4">
              {profile.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    className="rounded-pill border-line text-ink-muted hover:border-accent hover:text-ink inline-flex items-center gap-2 border px-4 py-2 text-sm transition-colors"
                  >
                    <Icon name={link.icon} className="size-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Section
        id="identities"
        eyebrow="Five identities"
        title="One practitioner, five ways in"
        description="Each identity has its own accent token, so a visitor can follow a single thread — data science, engineering, teaching, leadership, delivery — through the whole site."
      >
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {identities.map((identity, index) => (
            <li key={identity.id}>
              <Reveal delay={index * 0.06}>
                <article
                  className="rounded-card border-line bg-surface shadow-elev-sm hover:shadow-elev-md h-full border p-6 transition-shadow"
                  style={{
                    borderTopColor: `var(${identity.accentVar})`,
                    borderTopWidth: 3,
                  }}
                >
                  <Icon
                    name={identity.icon}
                    className="size-6"
                    style={{ color: `var(${identity.accentVar})` }}
                  />
                  <h3 className="text-title text-ink mt-4 font-semibold">
                    {identity.label}
                  </h3>
                  <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                    {identity.summary}
                  </p>
                  <ul className="text-ink-subtle mt-5 space-y-2 text-sm">
                    {identity.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span
                          aria-hidden
                          className="rounded-pill mt-2 size-1 shrink-0"
                          style={{ backgroundColor: `var(${identity.accentVar})` }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="work"
        eyebrow="Scaffold status"
        title="Phase 0 complete"
        description="Framework, tokens, content model and backend service are in place. Content and design land in the phases that follow."
        className="border-line/60 bg-bg-subtle border-t"
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { phase: "Phase 1", label: "Design system & homepage" },
            { phase: "Phase 2", label: "Real project content" },
            { phase: "Phase 3+", label: "Identity deep-dives" },
            { phase: "Phase 6", label: "Live ML demo endpoint" },
          ].map((item) => (
            <li
              key={item.phase}
              className="rounded-card border-line-strong border border-dashed p-5"
            >
              <p className="text-ink-subtle font-mono text-xs tracking-widest uppercase">
                {item.phase}
              </p>
              <p className="text-ink mt-2 text-sm">{item.label}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
