import type { Affiliation, LeadershipRole } from "./types";

/**
 * Leadership, convening and delivery roles, drawn from the CV and ordered
 * newest first. The outcomes here are specific on purpose: a leadership
 * section that lists offices without saying what changed is unassessable.
 */
export const leadershipRoles: LeadershipRole[] = [
  {
    org: "National Association of Nigerian Students (NANS)",
    role: "Executive Secretary - National Directorate of Humanitarian Affairs & Students Social Intervention",
    period: "May 2025 - May 2026",
    scope:
      "National directorate, Abuja. Humanitarian and social-intervention programmes.",
    stakeholders: [
      "NANS national leadership",
      "IDPs and vulnerable students, Borno State",
      "Students with disabilities",
      "NETISEN ICTS",
      "Postgraduate students, University of Uyo",
      "Female students nationwide",
    ],
    summary:
      "Ran documentation, communication and programme coordination for the directorate - the administrative spine that decides whether a humanitarian programme can show what it did.",
    outcomes: [
      "Compiled beneficiary, challenge and outcome reports for the visit to IDPs and vulnerable students in Borno State, so the intervention could be accounted for rather than just announced.",
      "Coordinated the International Women's Day 2026 online webinar for female students nationwide.",
      "Structured the Students Career Symposium for Students with Disabilities in Abuja.",
      "Brokered the Students Technology Training Programme (STEP) with NETISEN ICTS, delivering digital skills training.",
      "Documented the impact of the Business Summit and Grant Programme at the University of Uyo, measuring how grants and training moved postgraduate outcomes.",
    ],
    identities: ["leader", "project-manager"],
  },
  {
    org: "National Youth Service Corps (NYSC)",
    role: "Environmental Protection & Sanitation - Community Development Service",
    period: "Mar 2026 - Present",
    scope: "CDS group, Abuja. Community environmental and sanitation projects.",
    stakeholders: [
      "Host communities",
      "Local leaders",
      "Fellow corps members and volunteers",
    ],
    summary:
      "Planned and delivered community environmental projects end to end - sensitisation, clean-up and waste-segregation exercises, and the advocacy around them.",
    outcomes: [
      "Ran awareness campaigns on environmental protection, sanitation and sustainable living.",
      "Coordinated clean-up exercises and waste-segregation projects.",
      "Managed community projects from planning to execution against set objectives and timelines, and tracked their impact afterwards.",
      "Designed the posters, presentations and digital content that carried the message.",
    ],
    identities: ["project-manager", "leader"],
  },
  {
    org: "Destiny Centre Unveiling Chapel",
    role: "Head of Media & Public Relations",
    period: "May 2025 - Present",
    scope: "Media unit - live sound, streaming and AV for every service.",
    stakeholders: [
      "Congregation and streaming audience",
      "The media and technical team",
      "Other church departments",
    ],
    summary:
      "Strategic communication and image management for the church, plus the team and the equipment that deliver it. A weekly production deadline that does not move.",
    outcomes: [
      "Led the media team - delegation, accountability, and coordination across departments.",
      "Delivered live sound, live-streaming and audio-visual for all services.",
      "Built and ran the digital outreach across online platforms and social media.",
      "Kept records of media activity and campaigns for accountability and compliance.",
    ],
    identities: ["leader", "project-manager"],
  },
  {
    org: "DipGold Human Development Foundation (DGHDF)",
    role: "Programme & Digital Media Support",
    period: "Sep 2024 - Present",
    scope: "Community development, advocacy and humanitarian programmes.",
    stakeholders: [
      "Community stakeholders",
      "IDPs, flood victims and orphans",
      "Government agencies and NGOs",
      "Local and international partners",
    ],
    summary:
      "Monitoring, evaluation and digital media across the foundation's community work - capturing activity, reach and outcome data, and collecting it in the field rather than at a desk.",
    outcomes: [
      "Documented and evaluated community project outcomes, with recommendations for later interventions.",
      "Supported medical outreaches providing free screening and services to vulnerable communities.",
      "Helped organise relief distribution for internally displaced persons, flood victims and orphans.",
      "Contributed to capacity-building programmes equipping community members with skills for self-reliance.",
    ],
    identities: ["project-manager", "leader"],
  },
  {
    org: "Synergy Conference",
    role: "Convener & Lead Coordinator",
    period: "Jul 2023 - Present",
    scope:
      "Multi-sector conference convening Students' Union Governments from tertiary institutions nationwide. TODO(metric): attendance and budget.",
    stakeholders: [
      "Students' Union Governments nationwide",
      "Government agencies",
      "Private organisations and NGOs",
      "Community leaders",
      "Speakers and partners",
    ],
    summary:
      "Conceived and ran the first-ever conference bringing together Students' Union Governments from tertiary institutions, tagged The Synergy in Leadership, Academics and Business. Concept, speakers, partners, logistics, execution and post-event reporting.",
    outcomes: [
      "Set the theme and direction, and convened students alongside government agencies, private organisations, NGOs and community leaders.",
      "Coordinated logistics, programme and schedule across multiple sectors, and moderated the sessions.",
      "Produced post-event reporting for stakeholders, closing the loop between what was promised and what was delivered.",
      "Established partnerships with government agencies and foundations intended to outlast the event itself.",
      "TODO(metric): attendance against target, number of institutions represented, and budget against plan.",
    ],
    identities: ["leader", "project-manager"],
  },
  {
    org: "Akwa Ibom State University of Education (affiliated to the University of Uyo)",
    role: "President, Students' Union Government",
    period: "Jan 2023 - Dec 2023",
    scope:
      "Elected head of the union executive, representing the student body to university management and external stakeholders.",
    stakeholders: [
      "The student body",
      "University management",
      "Akwa Ibom State Government",
      "Zenith Bank · First Bank",
      "Akwa Ibom Investment Corporation",
      "State Ministry of Power and Petroleum",
      "Nsit Ibom LGA · Afaha Nsit Village Council",
    ],
    summary:
      "Led the union executive for a full session: advocacy, welfare, union finances and the programme of events - and negotiated with management where student interests and institutional decisions collided.",
    outcomes: [
      "Secured the release of a transformer from the state government for the community housing most students, which had been without power for over eighteen months.",
      "Negotiated a reduction in a school-fee hike through dialogue with management, defusing a protest that was already forming.",
      "Had the school coaster buses repaired and initiated a shuttle system, creating a new Director of Transport office in the union to run it.",
      "Convened the first-ever Synergy Conference, bringing together Students' Union Governments from tertiary institutions nationwide.",
      "Hosted the first Made in College Display and Exhibition - trade fairs and competitions showcasing student enterprise.",
      "Facilitated free bank accounts for students and ran a financial-literacy summit alongside them.",
      "Built partnerships with Zenith Bank, First Bank, Akwa Ibom Investment Corporation, the State Ministry of Power and Petroleum, Nsit Ibom LGA and others.",
    ],
    identities: ["leader", "project-manager"],
  },
  {
    org: "National Association of Nigerian Students (NANS)",
    role: "Senator, National Students' Parliament",
    period: "Jan 2023 - Dec 2023",
    scope: "National students' parliament, representing constituency interests.",
    stakeholders: [
      "Constituent students",
      "NANS national leadership",
      "Parliamentary committees",
    ],
    summary:
      "Represented constituent students in the national parliament - debate, resolutions, and oversight of national NANS programmes.",
    outcomes: [
      "Debated and passed resolutions affecting student welfare and unionism.",
      "Provided oversight on national NANS programmes and projects.",
      "Advocated for reform in tertiary education funding and management.",
      "Mediated between students and national leadership.",
    ],
    identities: ["leader"],
  },
];

/** Memberships and special-interest groups. */
export const affiliations: Affiliation[] = [
  {
    name: "Young African Leaders Initiative (YALI) Nigeria",
    detail:
      "Special-interest group official since Jul 2025. Leadership training, youth participation in governance, and mentorship of students in civic responsibility.",
  },
  {
    name: "American Spaces Nigeria",
    detail:
      "Special-interest group official since Jun 2025. Cultural exchange, digital literacy and civic-engagement workshops.",
  },
  {
    name: "Smfest Africa",
    detail:
      "Special-interest group official since May 2025. Creativity, media and technology programming for students across Africa; volunteering certification, Oct 2025.",
  },
];
