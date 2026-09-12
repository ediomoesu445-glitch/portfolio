import type { SkillGroup } from "./types";

/**
 * TODO(content): confirm and prune.
 *
 * Seeded from the identity descriptions, not from a CV. Delete anything you
 * would not want to be interviewed on.
 */
export const skillGroups: SkillGroup[] = [
  {
    label: "Analytics & modelling",
    identities: ["data-scientist"],
    items: [
      "Python",
      "pandas",
      "Forecasting",
      "Anomaly detection",
      "Statistical analysis",
      "TODO(content)",
    ],
  },
  {
    label: "Machine learning",
    identities: ["ai-engineer", "data-scientist"],
    items: ["scikit-learn", "Computer vision", "Model evaluation", "TODO(content)"],
  },
  {
    label: "Backend & infrastructure",
    identities: ["ai-engineer"],
    items: ["FastAPI", "REST API design", "Docker", "TODO(content)"],
  },
  {
    label: "Teaching & communication",
    identities: ["educator", "leader"],
    items: [
      "Mathematics instruction",
      "ICT instruction",
      "Computational thinking",
      "Mentorship",
    ],
  },
  {
    label: "Delivery & coordination",
    identities: ["project-manager", "leader"],
    items: [
      "Program coordination",
      "Event delivery",
      "Stakeholder management",
      "TODO(content)",
    ],
  },
];
