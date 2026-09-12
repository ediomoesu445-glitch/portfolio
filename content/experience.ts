import type { ExperienceItem } from "./types";

/**
 * Ordered newest-first. Dates use ISO YYYY-MM; `TODO(date)` marks a date still
 * to be supplied and renders as a placeholder rather than a guess.
 */
export const experience: ExperienceItem[] = [
  {
    org: "Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA)",
    role: "Data Scientist (NYSC placement) — Finance & Accounts Directorate",
    location: "Abuja, Nigeria",
    start: "TODO(date)",
    end: null,
    identities: ["data-scientist"],
    summary:
      "TODO(content): 1-2 sentences on the directorate's remit and where your analytics sit inside it.",
    achievements: [
      "TODO(content): achievement — what you built or analysed, and what changed as a result",
      "TODO(content): achievement",
      "TODO(content): achievement",
    ],
    stack: ["Python", "TODO(content)"],
  },
  {
    org: "TODO(content): organisation",
    role: "TODO(content): teaching role",
    location: "TODO(content)",
    start: "TODO(date)",
    end: "TODO(date)",
    identities: ["educator"],
    summary:
      "TODO(content): mathematics / ICT / computational-thinking teaching and mentorship.",
    achievements: ["TODO(content): achievement"],
  },
  {
    org: "TODO(content): student government / conference / community body",
    role: "TODO(content): leadership role",
    location: "TODO(content)",
    start: "TODO(date)",
    end: "TODO(date)",
    identities: ["leader", "project-manager"],
    summary: "TODO(content): what you convened or led, and at what scale.",
    achievements: ["TODO(content): achievement"],
  },
];
