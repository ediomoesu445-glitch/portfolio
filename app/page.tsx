import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { LensExperience, LensFallback } from "@/components/home/LensExperience";
import { ResponsiveHeroBanner } from "@/components/ui/responsive-hero-banner";
import { ButtonLink } from "@/components/ui/Button";
import { Headshot } from "@/components/ui/Headshot";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { affiliations } from "@/content/leadership";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";

/**
 * Quick stats.
 *
 * Four figures, each transcribed from a committed result file in the project
 * it comes from, and each carrying the note that makes it checkable. The first
 * leads with what it replaced, because that is the point.
 */
const quickStats = [
  {
    label: "PR-AUC, artefact-free",
    value: "0.8619",
    superseded: "0.9995",
    caveat: "The higher figure measured the simulator, not fraud.",
    method: "Ghost-transaction detection · XGBoost, held-out test split.",
  },
  {
    label: "Alarm precision",
    value: "99.50%",
    method: "Anomaly detection · LightGBM tier, at a 1.32% false-alarm rate.",
  },
  {
    label: "Lab-to-field accuracy drop",
    value: "31.80 pp",
    method: "Pipeline defect detection · across 21 corrupted conditions.",
  },
  {
    label: "Best forecast skill",
    value: "+0.717",
    method: "Digital twin · well 15/9-F-15 D, against a persistence baseline.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <ResponsiveHeroBanner
        // Real drilling channels from the Volve log, sunk almost to black.
        // Sensor traces rather than a stock photograph: linear enough to sit
        // behind display type, and true to the work.
        backgroundImageUrl="/media/anomaly-detection-predictive-maintenance/drilling-channels-flagged.png"
        backgroundImageAlt=""
        leading={<Headshot size="md" />}
        badgeLabel="Open"
        badgeText={`${profile.location} · ${profile.availability}`}
        title={profile.name}
        description="I build analytics and machine-learning systems for the energy sector - and publish the number I can defend, not the flattering one."
        primaryAction={{
          label: `See all ${projects.length} projects`,
          href: "/projects",
          icon: <ArrowRight className="size-4" aria-hidden />,
        }}
        secondaryAction={{ label: "Read the research", href: "/research" }}
        stripTitle="Member of"
        stripItems={affiliations.map((item) => item.name)}
      />

      {/* Lens ------------------------------------------------------------- */}
      <section className="border-line border-b py-12 md:py-14">
        <Container>
          <Reveal>
            {/* useSearchParams needs a boundary on a statically rendered page;
                the fallback renders the first lens so the server HTML is
                complete and indexable. */}
            <Suspense fallback={<LensFallback />}>
              <LensExperience projects={projects} />
            </Suspense>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-line mt-12 flex flex-wrap items-center gap-3 border-t pt-10">
              <ButtonLink href="/about">About me</ButtonLink>
              {profile.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  className="interactive rounded-card border-line text-ink-muted hover:text-ink inline-flex size-10 items-center justify-center border"
                >
                  <Icon name={link.icon} className="size-4" />
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Quick stats ----------------------------------------------------- */}
      <section className="border-line border-b">
        <Container>
          <RevealGroup className="bg-line grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat) => (
              <RevealItem key={stat.label} className="bg-bg px-6 py-10">
                <Stat {...stat} size="md" />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Contact --------------------------------------------------------- */}
      <Section
        id="contact"
        divided={false}
        eyebrow="Next"
        title="Open to remote roles and relocation"
        description="If any of this is the kind of work your team needs doing, I would like to hear about it."
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/contact" variant="primary">
            Get in touch
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href={`mailto:${profile.email}`}>{profile.email}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
