/**
 * The narrative bio. The personal paragraph is Ediomo's own words, from the
 * Europass CV; the rest is drawn from the professional summary.
 */
export const about = {
  lede: "I build analytics and machine-learning systems for the energy sector, and I teach.",

  paragraphs: [
    "I am an early-career data scientist with a foundation in mathematics, statistics and computing, applying machine learning, computer vision and statistical modelling to problems in Nigeria's oil and gas sector. I work in Python and SQL across the full modelling cycle, with self-directed projects in production forecasting, financial-integrity monitoring, and computer-vision-based pipeline and asset inspection.",
    "I believe in the philosophy of synergy - that combining diverse perspectives and strengths achieves outcomes far greater than any of them alone. It is the idea behind the conference I convene, and it is also how I approach collaboration and problem-solving: exploring new ideas, asking deeper questions, and respectfully challenging perspectives to get to clarity.",
    "That shows up in the work as a particular kind of stubbornness about evidence. Each project on this site reports the figure it can defend rather than the flattering one, and says plainly what it has not shown. On one of them, deleting a single misleading feature cost 0.14 PR-AUC - and publishing the lower number was the right call.",
    "Alongside the technical work I have taught mathematics, physics and ICT at secondary level, run an ICT lab and its clubs, served as a students' union president and a national student senator, and convened a multi-sector conference. Those are not a detour from the engineering. Explaining a method to someone who has no reason to trust it yet is most of what makes analysis useful inside an institution.",
    "I am keen to keep growing through mentorship, structured training and hands-on work alongside experienced teams, and I am open to roles, scholarships, fellowships and internships in energy data analytics, energy-sector digitalisation and applied research - in Nigeria or internationally.",
  ],

  /** Factual context on the regulator, for readers outside Nigerian energy. */
  context: {
    title: "Where I work",
    body: "The Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA) is the statutory regulator for Nigeria's midstream and downstream petroleum operations - the processing, transport, storage, distribution and retail of petroleum products, downstream of production. It licenses and supervises operators across that chain and administers the associated tariffs, levies and remittances.",
    note: "My placement rotates through the Finance & Accounts Directorate - Regional Accounts, Budget, Account System, Final Account and Treasury. That means reconciling financial data from regional offices, checking budget variance against approved allocations, and supporting year-end account preparation. It is also where the ghost-transaction project came from: seeing how budget and transaction data actually flows is what made the problem legible.",
  },

  /** Short, checkable facts for the sidebar. */
  facts: [
    { label: "Based in", value: "Abuja, Nigeria" },
    { label: "Open to", value: "Remote roles and relocation" },
    { label: "Degree", value: "B.Sc. (Ed.) Mathematics, University of Uyo - 2:1" },
    {
      label: "Also studying",
      value: "B.Sc. Computer Science, University of the People",
    },
    { label: "Current role", value: "Data Science Intern (NYSC), NMDPRA" },
    { label: "Languages", value: "English, Ibibio, French (basic), German (basic)" },
  ],
} as const;
