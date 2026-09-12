import type { LeadershipRole } from "./types";

/**
 * Leadership and project-management roles, shown separately from technical
 * experience. Ordered newest first.
 *
 * TODO(content): every entry below is a scaffold. Replace them with the real
 * student-government, conference and community roles — including the scale
 * figures, which are what make this section worth reading.
 */
export const leadershipRoles: LeadershipRole[] = [
  {
    org: "TODO(content): student government body",
    role: "TODO(content): office held",
    period: "TODO(date)",
    scope: "TODO(content): who you represented, and how many",
    summary:
      "TODO(content): what the office was responsible for and what you set out to change.",
    outcomes: [
      "TODO(content): something that changed because you held the role",
      "TODO(content): a second outcome",
    ],
    identities: ["leader"],
  },
  {
    org: "TODO(content): conference or convening",
    role: "TODO(content): convener or organising role",
    period: "TODO(date)",
    scope: "TODO(content): attendance, speakers, venues, budget",
    summary: "TODO(content): what the event was for and what you were accountable for.",
    outcomes: [
      "TODO(content): delivery outcome — attendance against target, budget against plan",
    ],
    identities: ["leader", "project-manager"],
  },
  {
    org: "TODO(content): community or media organisation",
    role: "TODO(content): role",
    period: "TODO(date)",
    scope: "TODO(content): reach or audience",
    summary: "TODO(content): what you led and for whom.",
    outcomes: ["TODO(content): outcome"],
    identities: ["leader"],
  },
];
