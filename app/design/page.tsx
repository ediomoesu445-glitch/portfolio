import type { Metadata } from "next";
import {
  BeforeAfterSlider,
  Card,
  Heading,
  Marquee,
  MediaFrame,
  Overline,
  Pill,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
  Stat,
  Timeline,
  TimelineItem,
} from "@/components/ui";
import { duration, ease, revealDistance } from "@/components/motion/motion-tokens";
import { projects } from "@/content/projects";

/**
 * Internal style guide — every primitive rendered against real content.
 *
 * Not linked from the site and excluded from indexing. It exists so the design
 * system can be reviewed in one place rather than inferred from whichever page
 * happens to use a given component.
 */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "bg", token: "--bg", note: "field" },
  { name: "bg-subtle", token: "--bg-subtle", note: "inset wells" },
  { name: "surface", token: "--surface", note: "panels" },
  { name: "surface-raised", token: "--surface-raised", note: "hover" },
  { name: "line", token: "--line", note: "hairlines" },
  { name: "line-strong", token: "--line-strong", note: "emphasis" },
  { name: "ink", token: "--ink", note: "primary text" },
  { name: "ink-muted", token: "--ink-muted", note: "secondary" },
  { name: "ink-subtle", token: "--ink-subtle", note: "labels" },
  { name: "alarm", token: "--alarm", note: "qualified figures" },
  { name: "normal", token: "--normal", note: "verified · interactive" },
  { name: "focus", token: "--focus", note: "focus ring" },
];

const typeScale = [
  { name: "display", className: "text-display font-display font-bold" },
  { name: "headline", className: "text-headline font-display font-bold" },
  { name: "title", className: "text-title font-display font-semibold" },
  { name: "subtitle", className: "text-subtitle font-display font-semibold" },
  { name: "body", className: "text-base" },
  { name: "small", className: "text-sm text-ink-muted" },
];

const pipeline = projects.find((p) => p.slug === "pipeline-defect-detection")!;
const fraud = projects.find((p) => p.slug === "ghost-transaction-detection")!;

export default function DesignSystemPage() {
  return (
    <>
      <Section
        divided={false}
        eyebrow="Internal reference"
        title="Design system"
        description="Control Room: a desaturated field where saturated colour is reserved for exceptional states, after ISA-101. Two accents only — alarm amber for a figure that is qualified, normal teal for one that is verified."
      >
        <Pill variant="normal">Dark is the default</Pill>
      </Section>

      {/* Palette ---------------------------------------------------------- */}
      <Section id="palette" eyebrow="01" title="Palette">
        <div className="border-line bg-line grid grid-cols-2 gap-px border sm:grid-cols-3 lg:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="bg-bg p-4">
              <div
                className="border-line h-14 w-full border"
                style={{ backgroundColor: `var(${s.token})` }}
              />
              <p className="text-ink mt-3 font-mono text-[11px]">{s.name}</p>
              <p className="text-ink-subtle font-mono text-[11px]">{s.note}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-muted mt-6 max-w-prose text-sm">
          Identities are told apart by tag and typography, not hue. Five decorative
          colours would contradict the one rule this palette rests on.
        </p>
      </Section>

      {/* Type ------------------------------------------------------------- */}
      <Section id="type" eyebrow="02" title="Type" tone="subtle">
        <div className="space-y-8">
          {typeScale.map((t) => (
            <div
              key={t.name}
              className="border-line grid gap-3 border-b pb-8 last:border-0 md:grid-cols-[8rem_1fr]"
            >
              <Overline className="pt-2">{t.name}</Overline>
              <p className={t.className}>Ghost transaction detection</p>
            </div>
          ))}
          <div className="grid gap-3 md:grid-cols-[8rem_1fr]">
            <Overline className="pt-1">overline · mono</Overline>
            <Overline>NMDPRA · Finance &amp; Accounts · Abuja</Overline>
          </div>
        </div>
        <p className="text-ink-subtle mt-10 font-mono text-xs">
          Archivo (display) · IBM Plex Sans (body) · IBM Plex Mono (data)
        </p>
      </Section>

      {/* Stat ------------------------------------------------------------- */}
      <Section
        id="stat"
        eyebrow="03"
        title="Stat"
        description="The signature element. A figure appears with whatever qualifies it, in the same object — the flattering number it replaced struck through, and the caveat in amber beside it."
      >
        <div className="border-line bg-line grid gap-px border md:grid-cols-3">
          <div className="bg-bg p-6">
            <Stat
              label="PR-AUC, artefact-free"
              value="0.8619"
              superseded="0.9995"
              caveat="The higher figure measured the simulator's own generator signature, not fraud."
              method="XGBoost, held-out test split."
              size="lg"
            />
          </div>
          <div className="bg-bg p-6">
            <Stat
              label="Alarm precision"
              value="99.50%"
              method="LightGBM tier; share of raised alarms that were real faults."
              size="lg"
            />
          </div>
          <div className="bg-bg p-6">
            <Stat
              label="Demo recording"
              value="TODO(media): not yet captured"
              size="lg"
            />
          </div>
        </div>
      </Section>

      {/* Pills and cards -------------------------------------------------- */}
      <Section id="pill" eyebrow="04" title="Pill and Card" tone="subtle">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>neutral</Pill>
          <Pill variant="alarm">qualified</Pill>
          <Pill variant="normal">verified</Pill>
          <Pill variant="code">DS</Pill>
          <Pill variant="code">ML</Pill>
          <Pill size="md">python</Pill>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <Overline>Static</Overline>
            <p className="text-ink-muted mt-2 text-sm">
              A plain panel. No hover, no pointer.
            </p>
          </Card>
          <Card href={fraud.links[0]?.href} external>
            <Overline>Interactive</Overline>
            <p className="text-ink-muted mt-2 text-sm">
              Given an href it becomes a link and picks up the shared hover treatment.
              Try keyboard focus.
            </p>
          </Card>
        </div>
      </Section>

      {/* Media ------------------------------------------------------------ */}
      <Section
        id="media"
        eyebrow="05"
        title="MediaFrame"
        description="One frame for every asset. Figures are letterboxed rather than cropped — cropping a confusion matrix to fill a box loses the axis labels. A source still marked TODO renders as a placeholder, never a broken image."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <MediaFrame
            media={pipeline.media![0]}
            aspect="3 / 4"
            caption="Grad-CAM overlays per class, lifted from reports/figures/."
          />
          <MediaFrame
            media={pipeline.media!.at(-1)!}
            aspect="3 / 4"
            caption="A recording that has not been captured yet."
          />
        </div>
      </Section>

      {/* Before / after --------------------------------------------------- */}
      <Section
        id="before-after"
        eyebrow="06"
        title="BeforeAfterSlider"
        description="Drag it, or focus it and use the arrow keys. The control is a real range input, so pointer, keyboard and screen-reader behaviour all come for free."
        tone="subtle"
      >
        <div className="max-w-xl">
          <BeforeAfterSlider
            aspect="1 / 1"
            label="Reveal the motion-blurred input"
            before={{
              src: "/media/pipeline-defect-detection/input-crazing-clean.jpg",
              alt: "A crazing defect on a clean, sharply imaged steel surface.",
              label: "clean",
            }}
            after={{
              src: "/media/pipeline-defect-detection/input-crazing-motion-blur-severe.png",
              alt: "The same crazing defect under severe simulated motion blur.",
              label: "motion blur, severe",
            }}
          />
          <p className="text-ink-muted mt-4 max-w-prose text-sm">
            The same input, clean and under severe motion blur. Accuracy across all
            corrupted conditions falls to 67.83% from 99.63%.
          </p>
        </div>
      </Section>

      {/* Timeline --------------------------------------------------------- */}
      <Section id="timeline" eyebrow="07" title="Timeline">
        <Timeline className="max-w-prose">
          <TimelineItem
            period="Aug 2026 — Present"
            title="Data Scientist (NYSC placement)"
            subtitle="NMDPRA — Finance & Accounts Directorate, Abuja"
            current
            meta={<Pill variant="code">DS</Pill>}
          >
            <p className="text-ink-muted text-sm">
              Entries take any children — achievements, stack pills, a nested Stat.
            </p>
          </TimelineItem>
          <TimelineItem
            period="TODO(date)"
            title="An entry whose date is not yet supplied"
            subtitle="The period renders as a placeholder rather than a guess"
          />
        </Timeline>
      </Section>

      {/* Marquee ---------------------------------------------------------- */}
      <Section
        id="marquee"
        eyebrow="08"
        title="Marquee"
        description="For lists where sequence carries no meaning. With reduced motion requested it renders as a plain wrapped list rather than a stopped ticker, so nothing is stranded off-screen."
        tone="subtle"
      >
        <Marquee
          items={[...pipeline.stack, ...fraud.stack, "FastAPI", "Docker"].map(
            (item) => (
              <Pill key={item} size="md">
                {item}
              </Pill>
            ),
          )}
        />
      </Section>

      {/* Motion ----------------------------------------------------------- */}
      <Section
        id="motion"
        eyebrow="09"
        title="Motion"
        description='Three durations, two easings, one entrance distance. MotionConfig reducedMotion="user" wraps the whole tree, so no component checks the preference itself.'
      >
        <div className="border-line bg-line grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "fast",
              value: `${duration.fast * 1000}ms`,
              use: "hover, colour",
            },
            {
              label: "base",
              value: `${duration.base * 1000}ms`,
              use: "state change",
            },
            {
              label: "slow",
              value: `${duration.slow * 1000}ms`,
              use: "entrance",
            },
            {
              label: "distance",
              value: `${revealDistance}px`,
              use: "reveal rise",
            },
          ].map((d) => (
            <div key={d.label} className="bg-bg p-6">
              <Overline>{d.label}</Overline>
              <p className="font-display text-ink mt-2 text-2xl font-bold">{d.value}</p>
              <p className="text-ink-subtle mt-1 text-sm">{d.use}</p>
            </div>
          ))}
        </div>

        <p className="text-ink-subtle mt-6 font-mono text-xs">
          ease-out-expo [{ease.outExpo.join(", ")}] · ease-out-soft [
          {ease.outSoft.join(", ")}]
        </p>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3">
          {["Reveal", "RevealGroup", "RevealItem"].map((name) => (
            <RevealItem key={name}>
              <Card>
                <p className="text-ink font-mono text-sm">{name}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} className="mt-4">
          <Card tone="bare">
            <p className="text-ink-muted text-sm">
              A single Reveal with a delay. Scroll away and back — it plays once.
            </p>
          </Card>
        </Reveal>
      </Section>

      <Section id="headings" divided title="Headings" eyebrow="10" tone="subtle">
        <Heading level={2} size="display" eyebrow="display">
          Ediomo Ubong Esu
        </Heading>
        <Heading level={3} size="title" eyebrow="title" className="mt-12">
          Semantic level and visual size are separate
        </Heading>
      </Section>
    </>
  );
}
