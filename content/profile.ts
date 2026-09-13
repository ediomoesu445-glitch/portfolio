import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ediomo Ubong Esu",
  shortName: "Ediomo Esu",
  headline:
    "Researcher · Data Scientist · AI/ML & Backend Engineer · Educator · Emerging Leader · Project Manager",
  bio: [
    "Early-career data scientist with a foundation in mathematics, statistics and computing, applying machine learning, computer vision and statistical modelling to problems in Nigeria's oil and gas sector.",
    "I am currently serving a one-year NYSC placement at Nigeria's midstream and downstream petroleum regulator, rotating through the Finance & Accounts Directorate, and I have taught mathematics, physics and ICT at secondary level.",
  ].join(" "),
  location: "Abuja, Nigeria",
  availability: "Open to remote roles and relocation",
  email: "ediomoesu445@gmail.com",
  phone: "+234 812 838 8445",
  resumeUrl: "/ediomo-esu-cv.pdf",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ediomo-esu",
      icon: "Linkedin",
      primary: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/ediomoesu445-glitch",
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
