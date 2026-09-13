import type { SkillGroup } from "./types";

/** Technical skills, as listed on the CV. */
export const skillGroups: SkillGroup[] = [
  {
    label: "Programming",
    identities: ["data-scientist", "ai-engineer"],
    items: ["Python", "SQL", "Java", "C", "MySQL"],
  },
  {
    label: "Machine learning",
    identities: ["ai-engineer", "data-scientist"],
    items: [
      "Supervised & unsupervised learning",
      "Feature engineering",
      "Model building",
      "Evaluation & selection",
      "Optimization",
      "End-to-end ML workflows",
    ],
  },
  {
    label: "Computer vision",
    identities: ["ai-engineer"],
    items: [
      "Image preprocessing & augmentation",
      "CNNs",
      "Transfer learning",
      "Image classification & object detection",
      "Visual defect & anomaly detection",
      "Grad-CAM explainability",
      "OpenCV",
    ],
  },
  {
    label: "Statistical modelling",
    identities: ["researcher", "data-scientist", "educator"],
    items: [
      "Predictive analytics",
      "Probability",
      "Hypothesis testing",
      "Regression",
      "Time-series forecasting",
      "A/B testing",
    ],
  },
  {
    label: "Mathematical foundations",
    identities: ["researcher", "data-scientist", "educator"],
    items: [
      "Linear algebra",
      "Calculus & differential equations",
      "Optimization",
      "Numerical analysis",
      "Operations research",
    ],
  },
  {
    label: "Energy sector & domain knowledge",
    identities: ["data-scientist"],
    items: [
      "Oil & gas value-chain data",
      "Midstream & downstream regulatory reporting",
      "Budget & account compliance monitoring",
      "Production & finance data structures",
    ],
  },
  {
    label: "Data engineering & preparation",
    identities: ["data-scientist", "ai-engineer"],
    items: [
      "Data preprocessing & cleaning",
      "EDA",
      "Data mining & extraction",
      "Large-scale dataset management",
      "Data governance",
    ],
  },
  {
    label: "Tools & ecosystem",
    identities: ["data-scientist", "ai-engineer", "project-manager"],
    items: [
      "Python data-science stack",
      "Jupyter",
      "Git",
      "Relational databases",
      "Power BI",
      "Tableau",
      "Excel",
      "Dashboards",
    ],
  },
  {
    label: "Teaching & communication",
    identities: ["educator", "leader"],
    items: [
      "Mathematics instruction",
      "Physics instruction",
      "ICT & robotics",
      "Computational thinking",
      "Mentorship",
      "Insight communication for non-technical audiences",
    ],
  },
  {
    label: "Delivery & coordination",
    identities: ["project-manager", "leader"],
    items: [
      "End-to-end event delivery",
      "Monitoring & evaluation",
      "Budget oversight",
      "Stakeholder engagement",
      "Post-event reporting",
    ],
  },
];

/** From the CV. Shown on the about page. */
export const languages = [
  { name: "English", level: "Full professional / native-level" },
  { name: "Ibibio", level: "Native" },
  { name: "French", level: "Basic" },
  { name: "German", level: "Basic" },
];
