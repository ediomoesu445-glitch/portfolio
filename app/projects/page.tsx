import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

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
      <ProjectsExplorer projects={projects} />
    </Section>
  );
}
