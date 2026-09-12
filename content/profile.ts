import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ediomo Ubong Esu",
  shortName: "Ediomo Esu",
  headline:
    "Data Scientist · AI/ML & Backend Engineer · Educator · Emerging Leader · Project Manager",
  bio: [
    "I build analytics and machine-learning systems for the energy sector — forecasting, anomaly and fraud detection, and the APIs that put those models in front of the people who act on them.",
    "I currently serve as a Data Scientist (NYSC placement) in the Finance & Accounts Directorate at Nigeria's midstream and downstream petroleum regulator, and I teach mathematics, ICT and computational thinking alongside that work.",
  ].join(" "),
  location: "Abuja, Nigeria",
  availability: "Open to remote roles and relocation",
  email: "ediomoesu445@gmail.com",
  phone: "+234 812 838 8445",
  // TODO(content): add /public/ediomo-esu-cv.pdf, then uncomment.
  // resumeUrl: "/ediomo-esu-cv.pdf",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ediomo-esu",
      icon: "Linkedin",
      primary: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/ediomo-esu",
      icon: "Github",
      primary: true,
    },
    {
      label: "Email",
      href: "mailto:ediomoesu445@gmail.com",
      icon: "Mail",
      primary: true,
    },
  ],
};
