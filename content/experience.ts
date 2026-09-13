import type { ExperienceItem } from "./types";

/** Ordered newest-first. Dates are ISO YYYY-MM, taken from the CVs. */
export const experience: ExperienceItem[] = [
  {
    org: "Nigerian Midstream & Downstream Petroleum Regulatory Authority (NMDPRA)",
    role: "Data Science Intern — NYSC Corps Member, Energy Regulatory Analytics",
    location: "Abuja, Nigeria",
    start: "2026-03",
    end: "2026-12",
    current: true,
    identities: ["data-scientist"],
    summary:
      "A national service placement rotating through the Finance & Accounts Directorate — Regional Accounts, Budget, Account System, Final Account and Treasury — learning how financial and operational data moves across a national energy regulator.",
    achievements: [
      "Consolidated and reconciled financial data submitted by regional and zonal offices, and supported budget tracking and variance checks against approved allocations.",
      "Helped ensure transaction records were captured and coded correctly in the core accounting system, supported year-end account preparation with consistency checks, and assisted with cash-flow and disbursement monitoring in Treasury.",
      "Used Python to explore sample budget and transaction data for patterns and anomalies, and built dashboards and reports that put the findings in front of supervisors in a form they could act on.",
      "Gained first-hand insight into regulatory reporting and financial oversight in the oil and gas value chain — the exposure that shaped the self-directed projects on this site.",
    ],
    stack: ["Python", "SQL", "Excel", "Power BI", "Dashboards"],
  },
  {
    org: "Notre Dame Shalom School",
    role: "ICT Operations Manager & Data Analyst",
    location: "Abuja, Nigeria",
    start: "2025-09",
    end: "2026-04",
    identities: ["educator", "data-scientist"],
    summary:
      "Built and ran the school's data systems while teaching mathematics and ICT — the analysis and the infrastructure it depended on, in the same job.",
    achievements: [
      "Built and managed the school's database systems, with accurate record-keeping, data security and workable access for students, staff and administration.",
      "Analysed academic performance data — test scores, attendance and grades — into termly reports for management that flagged where intervention was needed.",
      "Taught mathematics and ICT, and led the ICT department and club, mentoring students in coding, robotics and digital projects.",
      "Advised on ICT infrastructure and supported staff training, integrating digital tools across teaching and administration.",
    ],
    stack: [
      "Databases",
      "Excel",
      "ICT administration",
      "Video editing",
      "Graphics design",
    ],
  },
  {
    org: "Wells International School",
    role: "Mathematics Teacher & Head of ICT",
    location: "Akwa Ibom, Nigeria",
    start: "2024-09",
    end: "2025-08",
    identities: ["educator"],
    summary:
      "Multi-disciplinary secondary teaching, the school's ICT and multimedia infrastructure, and the clubs that ran on it — plus pastoral duty as Compound Master.",
    achievements: [
      "Delivered instruction across mathematics, further mathematics, physics, geography, government and technical drawing, building analytical alongside conceptual understanding.",
      "Led the ICT and Science Clubs, mentoring students in coding, robotics, multimedia design and scientific inquiry, and running their projects, competitions and exhibitions.",
      "Managed the school's multimedia resources and ICT infrastructure, including AV equipment and technical support for staff and students.",
      "Ran extra lessons for both stretched and struggling learners, giving personalised support where the timetable could not.",
      "Served as Compound Master, responsible for discipline and a safe learning environment across the premises, and as Assistant Games Master.",
    ],
    stack: [
      "Mathematics",
      "Further mathematics",
      "Physics",
      "ICT",
      "Robotics",
      "Multimedia",
    ],
  },
];
