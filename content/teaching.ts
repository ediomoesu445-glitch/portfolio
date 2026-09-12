import type { TeachingContent } from "./types";

/**
 * The educator identity. Subjects are drawn from Ediomo's own description of
 * the work; everything specific to a school, club or cohort is a TODO until
 * supplied, because none of it can be inferred.
 */
export const teaching: TeachingContent = {
  intro:
    "I teach mathematics, ICT and computational thinking, and mentor students one to one alongside classroom work. The aim is not syllabus coverage — it is getting a student from a formula they can reproduce to reasoning they can apply somewhere the formula was never mentioned.",
  approach: [
    {
      title: "Computational thinking as a habit",
      detail:
        "Decomposition, pattern recognition and abstraction taught as transferable reasoning rather than as a unit to be examined and forgotten.",
    },
    {
      title: "Mathematics you can act on",
      detail:
        "TODO(content): one or two sentences on how you teach mathematics — worked problems, modelling, exam technique, whatever is actually true.",
    },
    {
      title: "ICT with real tools",
      detail: "TODO(content): what students actually build or use in your ICT lessons.",
    },
  ],
  subjects: [
    {
      name: "Mathematics",
      detail: "TODO(content): levels taught, e.g. SS1-SS3, and exam boards",
    },
    {
      name: "ICT",
      detail: "TODO(content): levels taught and syllabus",
    },
    {
      name: "Computational thinking",
      detail: "TODO(content): setting — classroom, club, or workshop series",
    },
  ],
  clubs: [
    {
      name: "TODO(content): club or society name",
      role: "TODO(content): your role",
      summary:
        "TODO(content): what the club did, how many students, and what came out of it.",
    },
  ],
  mentorship: [
    "TODO(content): who you mentor, and in what setting",
    "TODO(content): an outcome you are willing to stand behind",
  ],
};
