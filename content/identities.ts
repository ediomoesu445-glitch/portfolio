import type { Identity } from "./types";

/**
 * The five identities the whole site is organised around. Order matters: it
 * drives nav order, the identity switcher and the default project sort.
 */
export const identities: Identity[] = [
  {
    id: "data-scientist",
    label: "Data Scientist",
    title: "Data Scientist — Energy & Regulatory Analytics",
    summary:
      "Regulatory analytics for oil & gas: forecasting, anomaly detection and fraud signals on midstream and downstream data.",
    highlights: [
      "Revenue and volume forecasting on regulatory datasets",
      "Anomaly and fraud detection across transaction and metering records",
      "Analysis that turns raw filings into decisions finance teams can defend",
    ],
    accentVar: "--color-identity-data",
    icon: "LineChart",
  },
  {
    id: "ai-engineer",
    label: "AI/ML & Backend",
    title: "AI/ML & Backend Engineer",
    summary:
      "Computer vision and ML workflows, plus the APIs and services that serve them in production.",
    highlights: [
      "Computer-vision models from dataset to deployed endpoint",
      "Training and inference pipelines that survive real data",
      "FastAPI services, containerised and documented",
    ],
    accentVar: "--color-identity-ai",
    icon: "BrainCircuit",
  },
  {
    id: "educator",
    label: "Educator",
    title: "Educator — Mathematics, ICT & Computational Thinking",
    summary:
      "Teaching and mentorship that gets students from formulas to reasoning they can actually apply.",
    highlights: [
      "Mathematics and ICT instruction",
      "Computational thinking taught as a transferable habit, not a syllabus",
      "One-to-one mentorship alongside classroom teaching",
    ],
    accentVar: "--color-identity-educator",
    icon: "GraduationCap",
  },
  {
    id: "leader",
    label: "Leader",
    title: "Emerging Leader — Student Government, Convening & Community",
    summary:
      "Student-government service, conference convening, and community and media leadership.",
    highlights: [
      "Student-government leadership and representation",
      "Convening conferences end to end",
      "Community organising and media leadership",
    ],
    accentVar: "--color-identity-leader",
    icon: "Users",
  },
  {
    id: "project-manager",
    label: "Project Manager",
    title: "Project Manager — Programs, Events & Technical Builds",
    summary:
      "End-to-end coordination of programs, events and technical builds — scope, schedule, stakeholders, delivery.",
    highlights: [
      "Programs and events run from planning through delivery",
      "Technical builds coordinated across contributors",
      "Stakeholder communication that keeps scope honest",
    ],
    accentVar: "--color-identity-pm",
    icon: "KanbanSquare",
  },
];

export const identityById = Object.fromEntries(
  identities.map((identity) => [identity.id, identity]),
) as Record<Identity["id"], Identity>;
