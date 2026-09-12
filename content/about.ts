/**
 * The narrative bio.
 *
 * Paragraphs are authored here rather than in the page so the copy can be
 * rewritten without touching JSX. Anything that would be a claim about
 * day-to-day work or motivation is a TODO — it cannot be inferred from the
 * repositories or from a role title.
 */
export const about = {
  lede: "I build analytics and machine-learning systems for the energy sector, and I teach.",

  paragraphs: [
    "My work sits where regulatory data meets decision-making: forecasting, anomaly and fraud detection, computer vision for inspection, and the APIs and services that put a model in front of someone who has to act on it. Four projects on this site show that work end to end — each publishing the figure it can defend rather than the flattering one.",
    "TODO(content): a paragraph in your own voice — how you came to this work, and what you are trying to get better at. This is the part a reader remembers, and the one thing that cannot be written for you.",
    "Alongside the technical work I teach mathematics, ICT and computational thinking, and I have held student-government, convening and community roles. Those are not a detour from the engineering. Explaining a method to someone who has no reason to trust it yet is most of what makes analysis useful inside an institution.",
  ],

  /** Factual context on the regulator, for readers outside Nigerian energy. */
  context: {
    title: "Where I work",
    body: "The Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA) is the statutory regulator for Nigeria's midstream and downstream petroleum operations — the processing, transport, storage, distribution and retail of petroleum products, downstream of production. It licenses and supervises operators across that chain and administers the associated tariffs, levies and remittances. I serve as a Data Scientist on NYSC placement in the Finance & Accounts Directorate.",
    note: "TODO(content): one or two sentences on what you actually work on there, at whatever level of detail you are comfortable publishing. Say so explicitly if the work cannot be described.",
  },

  /** Short, checkable facts for the sidebar. */
  facts: [
    { label: "Based in", value: "Abuja, Nigeria" },
    { label: "Open to", value: "Remote roles and relocation" },
    { label: "Degree", value: "B.Sc. Ed. Mathematics, University of Uyo" },
    { label: "Current role", value: "Data Scientist (NYSC), NMDPRA" },
  ],
} as const;
