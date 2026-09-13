import type { Lens } from "./types";

/**
 * The five lenses.
 *
 * Each rewrites the home page for one kind of reader: a hiring manager for an
 * analytics role, a school, a fellowship panel, a programme office. The order
 * matches `identities`, and the `id` is what appears in the URL as `?lens=`.
 *
 * Credentials are drawn from the CV. Figures that would make a role assessable
 * — cohort sizes, attendance, budgets — live in experience.ts and
 * leadership.ts, marked TODO where the CV does not give them.
 */
export const lenses: Lens[] = [
  {
    id: "researcher",
    headline:
      "I find the thing that makes a result smaller, and then I publish the smaller result.",
    blurb:
      "Applied research across mathematics and statistical modelling, machine learning, computer vision and education — built on a mathematics degree and a survey-based thesis. Every project here produced a finding about method: an artefact that inflated a score, a threshold that meant nothing off its own split, a benchmark that did not predict the field. Four of the five made the headline number worse.",
    skills: [
      "Research design",
      "Statistical modelling",
      "Probability & hypothesis testing",
      "Regression & time-series analysis",
      "Survey design",
      "Inferential statistics",
      "Optimization & numerical analysis",
      "Baseline and skill scoring",
      "Threshold calibration",
      "Leakage and artefact diagnostics",
      "Robustness evaluation",
      "Reproducible pipelines",
    ],
    projects: [
      "ghost-transaction-detection",
      "anomaly-detection-predictive-maintenance",
      "pipeline-defect-detection",
      "energy-asset-digital-twin",
      "examination-malpractice-study",
    ],
    credentials: [
      {
        title: "Five methodological findings",
        org: "Across every project on this site",
        detail:
          "An artefact worth 0.14 PR-AUC, a 110-fold calibration spread, a 31.80 pp lab-to-field gap, a forecast that lost to persistence, and an undergraduate study on examination malpractice.",
        href: "/research",
      },
      {
        title: "B.Sc. (Ed.) Mathematics & Education",
        org: "University of Uyo · 2020–2025 · Second Class Upper",
        detail:
          "Thesis: causes and situational prevention of examination malpractice in school mathematics across Nsit Ibom LGA — instrument design, primary data collection and inferential testing.",
        href: "/about",
      },
      {
        title: "Mathematical foundations",
        org: "Pure, applied and computational mathematics",
        detail:
          "Algebra, analysis, number theory, topology and logic, alongside numerical analysis, optimization, operations research, differential equations and cryptography.",
        href: "/about",
      },
      {
        title: "B.Sc. Computer Science (in progress)",
        org: "University of the People · since Aug 2025",
        detail:
          "Algorithms and complexity, discrete mathematics and software engineering principles, studied alongside full-time work.",
        href: "/about",
      },
      {
        title: "Open to research roles",
        org: "Scholarships · fellowships · applied research",
        detail:
          "In energy data analytics, energy-sector digitalisation and applied research, in Nigeria or internationally.",
        href: "/contact",
      },
    ],
  },
  {
    id: "data-scientist",
    headline:
      "I turn regulatory and operational data into decisions a team can defend.",
    blurb:
      "Forecasting, anomaly detection and fraud signals on energy-sector data, with the evaluation done honestly enough that the number I publish is the one that survives scrutiny. Currently serving a one-year NYSC placement at Nigeria's midstream and downstream petroleum regulator.",
    skills: [
      "Python",
      "SQL",
      "pandas",
      "scikit-learn",
      "Time-series forecasting",
      "Anomaly & fraud detection",
      "Statistical modelling",
      "Hypothesis testing",
      "Feature engineering",
      "Power BI",
      "Tableau",
    ],
    projects: [
      "anomaly-detection-predictive-maintenance",
      "core-anomaly-detection",
      "ghost-transaction-detection",
      "energy-asset-digital-twin",
      "pipeline-defect-detection",
    ],
    credentials: [
      {
        title: "Data Science Intern — Energy Regulatory Analytics",
        org: "NMDPRA · Finance & Accounts · Jan–Dec 2026",
        detail:
          "Rotating through Regional Accounts, Budget, Account System, Final Account and Treasury at Nigeria's midstream and downstream petroleum regulator.",
        href: "/experience",
      },
      {
        title: "Energy-domain knowledge",
        org: "Midstream & downstream regulation",
        detail:
          "Oil and gas value-chain data, regulatory reporting, budget and account compliance monitoring, and production and finance data structures — the context that decides whether a model asks a useful question.",
      },
      {
        title: "B.Sc. (Ed.) Mathematics & Education",
        org: "University of Uyo · 2020–2025 · Second Class Upper",
        detail:
          "Coursework in predictive modelling, statistical analysis, optimization, operations research and numerical analysis.",
        href: "/about",
      },
      {
        title: "Professional Certificate in Data Science",
        org: "Vextor Hub Limited · 2025",
        detail: "A structured programme across the end-to-end modelling cycle.",
        href: "/about",
      },
    ],
  },

  {
    id: "ai-engineer",
    headline:
      "I build the models and the services that put them in front of someone who acts on them.",
    blurb:
      "Computer vision and ML workflows from dataset to deployed endpoint, and the APIs, containers and demos that make them usable. A model nobody can call is not finished.",
    skills: [
      "PyTorch",
      "CNNs & transfer learning",
      "Image classification & object detection",
      "Grad-CAM explainability",
      "OpenCV",
      "ONNX",
      "FastAPI",
      "Docker",
      "Streamlit",
      "Gradio",
      "Robustness evaluation",
    ],
    projects: [
      "pipeline-defect-detection",
      "core-anomaly-detection",
      "anomaly-detection-predictive-maintenance",
      "energy-asset-digital-twin",
      "ghost-transaction-detection",
    ],
    credentials: [
      {
        title: "Professional Certificate in AI/ML Engineering",
        org: "Vextor Hub Limited · Jul–Nov 2025",
        detail:
          "Alongside an earlier Data Science certificate from the same programme.",
        href: "/about",
      },
      {
        title: "Deployable inference paths",
        org: "ONNX · FastAPI · Docker",
        detail:
          "Models exported for CPU inference, served behind documented endpoints and containerised — including the service behind this site.",
      },
      {
        title: "Explainability as a requirement",
        org: "Grad-CAM · SHAP",
        detail:
          "Saliency and attribution run on failures as well as successes, because a saliency map over a mistake says more than one over a win.",
        href: "/projects/pipeline-defect-detection",
      },
      {
        title: "Data Science Intern — Energy Regulatory Analytics",
        org: "NMDPRA · Finance & Accounts · Jan–Dec 2026",
        href: "/experience",
      },
    ],
  },

  {
    id: "educator",
    headline:
      "I teach mathematics, physics and ICT — and the reasoning that outlasts the syllabus.",
    blurb:
      "Secondary-level teaching, an ICT lab and the clubs that ran in it, one-to-one mentorship, and research on why students cheat and what actually prevents it. Certified by the Teachers Registration Council of Nigeria.",
    skills: [
      "Mathematics instruction",
      "Physics instruction",
      "ICT & robotics",
      "Computational thinking",
      "Lesson material design",
      "Mentorship",
      "Survey design",
      "Inferential statistics",
    ],
    projects: ["examination-malpractice-study"],
    credentials: [
      {
        title: "Mathematics & ICT Educator",
        org: "Wells International School · Sep 2024 – Aug 2025",
        detail:
          "Taught mathematics and physics at secondary level — algebra, calculus, trigonometry, statistics — and mentored students through their assessments.",
        href: "/experience",
      },
      {
        title: "Data Analyst & ICT Operations Manager",
        org: "Notre Dame Shalom School · Sep 2025 – Apr 2026",
        detail:
          "Termly academic-performance reporting for school management, records digitised into structured databases, and the ICT infrastructure kept running.",
        href: "/experience",
      },
      {
        title: "Certified Teacher (TRCN)",
        org: "Teachers Registration Council of Nigeria · Aug 2025",
        detail: "The statutory registration for teaching practice in Nigeria.",
        href: "/about",
      },
      {
        title: "Head of ICT & Science Clubs",
        org: "Wells International School",
        detail:
          "Coding fundamentals and robotics projects to build early computational thinking, plus the lab that made them possible.",
        href: "/teaching",
      },
    ],
  },

  {
    id: "leader",
    headline:
      "I have represented students nationally, convened a conference, and led the team behind the desk.",
    blurb:
      "Elected union president, a seat in the national students' parliament, a multi-sector conference convened end to end, and a church media and technical department led. Leadership here means accountability for something that had to work.",
    skills: [
      "Student representation",
      "Convening",
      "Public speaking",
      "Stakeholder engagement",
      "Budget oversight",
      "Media & technical production",
      "Community organising",
      "Team leadership",
    ],
    projects: [],
    credentials: [
      {
        title: "President, Students' Union Government",
        org: "Akwa Ibom State University of Education · 2023",
        detail:
          "Secured a transformer from the state government for a student community eighteen months without power, and negotiated down a fee hike that was about to become a protest.",
        href: "/leadership",
      },
      {
        title: "Executive Secretary — Humanitarian Affairs",
        org: "NANS National Directorate · May 2025 – May 2026",
        detail:
          "Documentation and coordination across humanitarian programmes, from a visit to IDPs in Borno State to a career symposium for students with disabilities.",
        href: "/leadership",
      },
      {
        title: "Senator, National Students' Parliament",
        org: "National Association of Nigerian Students (NANS) · 2023",
        detail:
          "Debated and passed resolutions on student welfare, and provided oversight on national NANS programmes.",
        href: "/leadership",
      },
      {
        title: "Convener & Lead Coordinator",
        org: "Synergy Conference · 2023 – Present",
        detail:
          "Founded the first conference to bring Students' Union Governments from tertiary institutions nationwide into one room, and have run it end to end since.",
        href: "/leadership",
      },
      {
        title: "Head of Media & Technical Department",
        org: "Destiny Centre Unveiling Chapel · May 2025 – Apr 2026",
        detail:
          "Live sound, live-streaming and AV delivery for every service, plus the team and the content production behind it.",
        href: "/leadership",
      },
      {
        title: "YALI Nigeria · American Spaces · Smfest Africa",
        org: "Memberships · 2025 – Present",
        detail:
          "Leadership-development, digital-literacy and innovation programmes across Nigeria and Africa.",
        href: "/leadership",
      },
      {
        title: "Leadership & Management Certificate",
        org: "More Leadership Academy, Uyo · 2023",
        href: "/about",
      },
    ],
  },

  {
    id: "project-manager",
    headline:
      "I take programmes and events from a plan to a thing that actually happened.",
    blurb:
      "End-to-end conference delivery, monitoring and evaluation across community programmes, and budget oversight in elected office. The work is scope, schedule, stakeholders and the unglamorous business of tracking delivery against what was funded.",
    skills: [
      "End-to-end delivery",
      "Monitoring & evaluation",
      "Budget oversight",
      "Scope & schedule management",
      "Stakeholder engagement",
      "Event logistics",
      "Post-event reporting",
      "Field data collection",
    ],
    projects: ["energy-asset-digital-twin"],
    credentials: [
      {
        title: "Conference delivery, end to end",
        org: "Synergy Conference · 2023 – Present",
        detail:
          "Concept through to the day itself — programme, speakers, partners, logistics, budget and the run of show — then post-event reporting for stakeholders.",
        href: "/leadership",
      },
      {
        title: "Programme M&E and digital media",
        org: "DipGold Human Development Foundation · Sep 2024 – Dec 2025",
        detail:
          "Captured activity, reach and outcome data for community-development programmes, and collected field data directly with community stakeholders.",
        href: "/leadership",
      },
      {
        title: "CDS project delivery",
        org: "NYSC Environmental Protection & Sanitation · 2026",
        detail:
          "Planned and executed community environmental and sanitation projects, monitored outcomes, and produced the outreach materials.",
        href: "/leadership",
      },
      {
        title: "Union budget oversight and delivery",
        org: "Students' Union Government · 2023",
        detail:
          "Oversaw union funds as elected president, and shipped the programme behind them — a shuttle system that needed a new transport office to run it, an exhibition, and a financial-literacy summit.",
        href: "/leadership",
      },
      {
        title: "Technical build coordination",
        org: "Energy Asset Digital Twin",
        detail:
          "Three modules, one dataset, one dashboard — scoped and sequenced so each piece could be evaluated on its own.",
        href: "/projects/energy-asset-digital-twin",
      },
    ],
  },
];

export const lensById = Object.fromEntries(
  lenses.map((lens) => [lens.id, lens]),
) as Record<Lens["id"], Lens>;

/** Validates a `?lens=` value, falling back to the first lens. */
export function resolveLens(value: string | null | undefined): Lens {
  const match = lenses.find((lens) => lens.id === value);
  return match ?? lenses[0];
}
