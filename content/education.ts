import type { Certification, EducationItem } from "./types";

export const education: EducationItem[] = [
  {
    institution: "University of the People",
    credential: "B.Sc. Computer Science (in progress)",
    location: "California, United States",
    start: "2025-08",
    end: null,
    details: [
      "Studied alongside full-time work: data structures and software design, algorithms and complexity, discrete mathematics, computer systems fundamentals and software engineering principles.",
    ],
  },
  {
    institution: "University of Uyo",
    credential: "B.Sc. (Ed.) Mathematics & Education",
    location: "Akwa Ibom, Nigeria",
    start: "2020-01",
    end: "2025-12",
    details: [
      "Second Class Honours (Upper Division).",
      "Thesis: causes and situational prevention of examination malpractice in school mathematics in Nsit Ibom Local Government Area.",
      "Relevant coursework: predictive modelling, statistical analysis and probability, data analytics, optimization, operations research, numerical analysis, computational mathematics.",
    ],
  },
];

/** Newest first. */
export const certifications: Certification[] = [
  {
    name: "National Youth Service Corps (NYSC) Discharge Certificate",
    issuer: "National Youth Service Corps",
    issued: "2026-12",
  },
  {
    name: "Smfest Volunteering Certification",
    issuer: "Smfest Africa",
    issued: "2025-10",
  },
  {
    name: "Professional Certificate in AI/ML Engineering",
    issuer: "Vextor Hub Limited",
    issued: "2025-11",
  },
  {
    name: "Certified Teacher (TRCN)",
    issuer: "Teachers Registration Council of Nigeria",
    issued: "2025-08",
  },
  {
    name: "Professional Certificate in Data Science",
    issuer: "Vextor Hub Limited",
    issued: "2025-05",
  },
  {
    name: "Leadership & Management Certificate",
    issuer: "More Leadership Academy, Uyo",
    issued: "2023-12",
  },
];
