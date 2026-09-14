import type { Metadata } from "next";
import {
  ReelsCarousel,
  capturedReelCount,
  reelCount,
} from "@/components/projects/ReelsCarousel";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

const ordered = [...projects].sort((a, b) => a.order - b.order);

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Energy-sector analytics and machine-learning projects: fraud and anomaly detection, computer vision for pipeline inspection, production forecasting and a digital twin.",
};

export default function ProjectsPage() {
  return (
    <Section
      divided={false}
      eyebrow={`${projects.length} projects`}
      title="Work"
      description="Four projects, all in energy. Each one reports the figure it can defend rather than the flattering one, and says plainly what it has not shown."
    >
      <ProjectsExplorer projects={ordered} />

      <div className="border-line mt-24 border-t pt-16">
        <Reveal>
          <ReelsCarousel />
        </Reveal>
        <p className="text-ink-subtle mt-6 text-[13px]">
          {capturedReelCount === 0
            ? `Demo reels for each project. None of the ${reelCount} are recorded yet — each panel carries the shot it is waiting for.`
            : `Demo reels for each project. ${capturedReelCount} of ${reelCount} recorded.`}
        </p>
      </div>
    </Section>
  );
}
