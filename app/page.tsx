import { ArrowRight } from "lucide-react";
import { IdentitySwitcher } from "@/components/home/IdentitySwitcher";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading, Overline } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { featuredProjects, projects } from "@/content/projects";
import { profile } from "@/content/profile";

/**
 * Quick stats.
 *
 * Four figures, each transcribed from a committed result file in the project
 * it comes from, and each carrying the note that makes it checkable. The first
 * one leads with what it replaced, because that is the point.
 */
const quickStats = [
  {
    label: "PR-AUC, artefact-free",
    value: "0.8619",
    superseded: "0.9995",
    caveat: "The higher figure measured the simulator, not fraud.",
    method: "Ghost transaction detection · XGBoost, held-out test split.",
  },
  {
    label: "Alarm precision",
    value: "99.50%",
    method: "CORE · LightGBM tier, at a 1.32% false-alarm rate.",
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
      {/* Hero */}
      <section className="border-line border-b py-24 md:py-36">
        <Container>
          <Reveal>
            <Overline>
              {profile.location} · {profile.availability}
            </Overline>
            <Heading level={1} size="display" className="mt-6 max-w-[14ch]">
              {profile.name}
            </Heading>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="text-ink-muted mt-8 max-w-2xl text-xl leading-relaxed md:text-2xl">
              I build analytics and machine-learning systems for the energy sector — and
              publish the number I can defend, not the flattering one.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/projects" variant="primary">
                See the work
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
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

      {/* Quick stats */}
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

      {/* Identity switcher */}
      <Section
        id="identities"
        divided={false}
        eyebrow="Five identities"
        title="One practitioner, five ways in"
        description="Data science, engineering, teaching, leadership, delivery. Pick a thread and follow it through the work."
      >
        <Reveal>
          <IdentitySwitcher projects={projects} />
        </Reveal>
      </Section>

      {/* Featured projects */}
      <Section
        id="work"
        tone="subtle"
        eyebrow="Selected work"
        title="Featured projects"
        description="Four projects in energy — fraud and anomaly detection, computer vision for inspection, and production forecasting."
      >
        <RevealGroup as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <RevealItem as="li" key={project.slug}>
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10">
          <ButtonLink href="/projects">
            All {projects.length} projects
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </Section>

      {/* Contact */}
      <Section
        id="contact"
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
