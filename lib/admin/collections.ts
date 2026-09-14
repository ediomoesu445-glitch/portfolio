/**
 * What the admin panel knows how to edit.
 *
 * Every collection describes its fields once, and the form engine renders them.
 * Fifteen hand-written forms would drift from content/types.ts the first time
 * a field was added; one schema per collection at least drifts visibly.
 *
 * The schema is deliberately a little stricter than the TypeScript. `method`
 * on a metric is optional in the type because plenty of older entries predate
 * the rule, but the panel treats it as required whenever the value is a real
 * figure - see `requiredUnlessTodo`. The whole site rests on numbers being
 * traceable, so the tool that adds numbers should be the thing that insists.
 */

export const IDENTITY_IDS = [
  "researcher",
  "data-scientist",
  "ai-engineer",
  "educator",
  "leader",
  "project-manager",
] as const;

const PROJECT_STATUS = ["shipped", "in-progress", "research", "archived"];
const LINK_KINDS = ["repo", "demo", "writeup", "paper", "video", "external"];
const MEDIA_KINDS = ["image", "video", "lottie"];
const MOTION_ASSETS = [
  "anomaly-events",
  "anomaly-timeseries",
  "gradcam-slider",
  "transaction-graph",
  "dashboard-mock",
  "findings-chart",
];

export type Field =
  | { kind: "text"; name: string; label: string; help?: string; required?: boolean }
  | {
      kind: "textarea";
      name: string;
      label: string;
      help?: string;
      rows?: number;
      required?: boolean;
      /** Enforced only when the sibling `value` is not a TODO sentinel. */
      requiredUnlessTodo?: string;
    }
  | { kind: "number"; name: string; label: string; help?: string }
  | { kind: "boolean"; name: string; label: string; help?: string }
  | {
      kind: "select";
      name: string;
      label: string;
      options: readonly string[];
      help?: string;
      allowEmpty?: boolean;
    }
  | {
      kind: "multiselect";
      name: string;
      label: string;
      options: readonly string[];
      help?: string;
    }
  | { kind: "stringList"; name: string; label: string; help?: string }
  | { kind: "object"; name: string; label: string; fields: Field[]; help?: string }
  | {
      kind: "objectList";
      name: string;
      label: string;
      fields: Field[];
      /** Which field to show as the row heading in the list. */
      titleKey: string;
      help?: string;
    };

export interface Collection {
  id: string;
  label: string;
  /** Filename under content/data/. */
  file: string;
  /** A list of records, or one object. */
  kind: "list" | "single";
  /** For lists: which field labels a row. */
  titleKey?: string;
  /** For lists: a second line under the title. */
  subtitleKey?: string;
  description: string;
  fields: Field[];
}

const metricFields: Field[] = [
  { kind: "text", name: "label", label: "Label", required: true },
  {
    kind: "text",
    name: "value",
    label: "Value",
    required: true,
    help: 'The measured figure, or TODO(metric): what is still needed. Never an estimate.',
  },
  {
    kind: "textarea",
    name: "method",
    label: "Method",
    rows: 2,
    requiredUnlessTodo: "value",
    help: "How the figure was derived, specifically enough that someone could reproduce it. Required whenever the value is a real number.",
  },
  {
    kind: "text",
    name: "superseded",
    label: "Superseded value",
    help: "A prior, misleading figure this one replaced. Rendered struck through.",
  },
  {
    kind: "textarea",
    name: "caveat",
    label: "Caveat",
    rows: 2,
    help: "Why the figure is qualified. Shown in the alarm accent, before the number.",
  },
];

const mediaFields: Field[] = [
  { kind: "select", name: "kind", label: "Kind", options: MEDIA_KINDS },
  {
    kind: "text",
    name: "src",
    label: "Source",
    required: true,
    help: "Path under /public, or TODO(media): ... while the asset is still to be captured.",
  },
  { kind: "text", name: "srcWebm", label: "WebM source", help: "Video only." },
  { kind: "text", name: "poster", label: "Poster", help: "Video only." },
  { kind: "text", name: "alt", label: "Alt text", required: true },
  {
    kind: "textarea",
    name: "shot",
    label: "Shot required",
    rows: 2,
    help: "For media not yet captured: the exact shot, including target filename.",
  },
  { kind: "number", name: "width", label: "Width" },
  { kind: "number", name: "height", label: "Height" },
];

export const collections: Collection[] = [
  {
    id: "profile",
    label: "Profile",
    file: "profile.json",
    kind: "single",
    description: "Name, headline, contact details and social links.",
    fields: [
      { kind: "text", name: "name", label: "Full name", required: true },
      { kind: "text", name: "shortName", label: "Short name", required: true },
      { kind: "textarea", name: "headline", label: "Headline", rows: 2, required: true },
      { kind: "textarea", name: "bio", label: "Bio", rows: 5, required: true },
      { kind: "text", name: "location", label: "Location" },
      { kind: "text", name: "availability", label: "Availability" },
      { kind: "text", name: "email", label: "Email" },
      { kind: "text", name: "phone", label: "Phone" },
      { kind: "text", name: "resumeUrl", label: "CV path", help: "Under /public." },
      {
        kind: "object",
        name: "headshot",
        label: "Headshot",
        fields: [
          { kind: "text", name: "src", label: "Source" },
          { kind: "text", name: "alt", label: "Alt text" },
          { kind: "textarea", name: "shot", label: "Shot required", rows: 2 },
        ],
      },
      {
        kind: "objectList",
        name: "links",
        label: "Social links",
        titleKey: "label",
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          { kind: "text", name: "href", label: "URL", required: true },
          { kind: "text", name: "icon", label: "Icon", help: "lucide-react icon name." },
          { kind: "boolean", name: "primary", label: "Show in footer and contact" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    file: "about.json",
    kind: "single",
    description: "The narrative bio, the regulator context and the fact list.",
    fields: [
      { kind: "textarea", name: "lede", label: "Lede", rows: 3, required: true },
      { kind: "stringList", name: "paragraphs", label: "Paragraphs" },
      {
        kind: "object",
        name: "context",
        label: "Context",
        fields: [
          { kind: "text", name: "title", label: "Title" },
          { kind: "textarea", name: "body", label: "Body", rows: 5 },
          { kind: "textarea", name: "note", label: "Note", rows: 4 },
        ],
      },
      {
        kind: "objectList",
        name: "facts",
        label: "Facts",
        titleKey: "label",
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          { kind: "text", name: "value", label: "Value", required: true },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    file: "projects.json",
    kind: "list",
    titleKey: "title",
    subtitleKey: "tagline",
    description: "The case studies, their metrics, media and next steps.",
    fields: [
      { kind: "text", name: "slug", label: "Slug", required: true, help: "URL segment. Changing it changes the page's address." },
      { kind: "number", name: "order", label: "Order" },
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "textarea", name: "tagline", label: "Tagline", rows: 2, required: true },
      { kind: "multiselect", name: "identities", label: "Identities", options: IDENTITY_IDS },
      { kind: "textarea", name: "summary", label: "Summary", rows: 4, required: true },
      { kind: "textarea", name: "objective", label: "Objective", rows: 4, required: true },
      { kind: "textarea", name: "problem", label: "Problem", rows: 4 },
      { kind: "textarea", name: "approach", label: "Approach", rows: 4 },
      { kind: "textarea", name: "method", label: "Method and tools", rows: 4 },
      { kind: "textarea", name: "outcome", label: "Outcome", rows: 5 },
      {
        kind: "textarea",
        name: "caveat",
        label: "Caveat",
        rows: 3,
        help: "Scope or validity limits. Shown before the metrics, not in small print.",
      },
      { kind: "stringList", name: "nextSteps", label: "Next steps", help: "Statements of intent. Never phrased as done." },
      { kind: "stringList", name: "stack", label: "Stack" },
      { kind: "objectList", name: "metrics", label: "Metrics", titleKey: "label", fields: metricFields },
      {
        kind: "objectList",
        name: "links",
        label: "Links",
        titleKey: "label",
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          { kind: "text", name: "href", label: "URL", required: true },
          { kind: "select", name: "kind", label: "Kind", options: LINK_KINDS },
        ],
      },
      { kind: "objectList", name: "media", label: "Media", titleKey: "alt", fields: mediaFields },
      {
        kind: "object",
        name: "dataset",
        label: "Dataset",
        fields: [
          { kind: "text", name: "name", label: "Name" },
          { kind: "text", name: "source", label: "Source" },
          { kind: "textarea", name: "note", label: "Note", rows: 3 },
        ],
      },
      { kind: "select", name: "motionAsset", label: "Motion asset", options: MOTION_ASSETS, allowEmpty: true },
      { kind: "select", name: "status", label: "Status", options: PROJECT_STATUS },
      { kind: "text", name: "date", label: "Date", help: "ISO YYYY-MM. Most recent work." },
      { kind: "text", name: "started", label: "Started", help: "ISO YYYY-MM." },
      { kind: "boolean", name: "featured", label: "Featured" },
      { kind: "textarea", name: "confidentialityNote", label: "Confidentiality note", rows: 2 },
      { kind: "textarea", name: "attribution", label: "Attribution", rows: 2 },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    file: "experience.json",
    kind: "list",
    titleKey: "role",
    subtitleKey: "org",
    description: "Professional roles, newest first.",
    fields: [
      { kind: "text", name: "role", label: "Role", required: true },
      { kind: "text", name: "org", label: "Organisation", required: true },
      { kind: "text", name: "location", label: "Location" },
      { kind: "text", name: "start", label: "Start", required: true, help: "ISO YYYY-MM." },
      { kind: "text", name: "end", label: "End", help: "ISO YYYY-MM. Leave empty while current." },
      { kind: "boolean", name: "current", label: "Currently in this role", help: "Use for a fixed-term role that is ongoing but has a known end date." },
      { kind: "multiselect", name: "identities", label: "Identities", options: IDENTITY_IDS },
      { kind: "textarea", name: "summary", label: "Summary", rows: 4, required: true },
      { kind: "stringList", name: "achievements", label: "Achievements" },
      { kind: "stringList", name: "stack", label: "Stack" },
    ],
  },
  {
    id: "education",
    label: "Education",
    file: "education.json",
    kind: "list",
    titleKey: "credential",
    subtitleKey: "institution",
    description: "Degrees and study.",
    fields: [
      { kind: "text", name: "credential", label: "Credential", required: true },
      { kind: "text", name: "institution", label: "Institution", required: true },
      { kind: "text", name: "location", label: "Location" },
      { kind: "text", name: "start", label: "Start" },
      { kind: "text", name: "end", label: "End", help: "Leave empty while in progress." },
      { kind: "stringList", name: "details", label: "Details" },
    ],
  },
  {
    id: "certifications",
    label: "Certifications",
    file: "certifications.json",
    kind: "list",
    titleKey: "name",
    subtitleKey: "issuer",
    description: "Certificates and credentials.",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true },
      { kind: "text", name: "issuer", label: "Issuer", required: true },
      { kind: "text", name: "issued", label: "Issued", help: "ISO YYYY-MM." },
      { kind: "text", name: "credentialUrl", label: "Credential URL" },
    ],
  },
  {
    id: "skill-groups",
    label: "Skills",
    file: "skill-groups.json",
    kind: "list",
    titleKey: "label",
    description: "Grouped skills, filtered by identity.",
    fields: [
      { kind: "text", name: "label", label: "Group", required: true },
      { kind: "multiselect", name: "identities", label: "Identities", options: IDENTITY_IDS },
      { kind: "stringList", name: "items", label: "Skills" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    file: "languages.json",
    kind: "list",
    titleKey: "name",
    subtitleKey: "level",
    description: "Spoken languages and CEFR levels.",
    fields: [
      { kind: "text", name: "name", label: "Language", required: true },
      { kind: "text", name: "level", label: "Level", required: true, help: "CEFR level, or Native." },
      { kind: "number", name: "fraction", label: "Fraction", help: "0 to 1. Drives the bar length." },
      { kind: "text", name: "note", label: "Note" },
    ],
  },
  {
    id: "teaching",
    label: "Teaching",
    file: "teaching.json",
    kind: "single",
    description: "Subjects, clubs, approach and mentorship.",
    fields: [
      { kind: "textarea", name: "intro", label: "Intro", rows: 4, required: true },
      {
        kind: "objectList",
        name: "approach",
        label: "Approach",
        titleKey: "title",
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "textarea", name: "detail", label: "Detail", rows: 3, required: true },
        ],
      },
      {
        kind: "objectList",
        name: "subjects",
        label: "Subjects",
        titleKey: "name",
        fields: [
          { kind: "text", name: "name", label: "Subject", required: true },
          { kind: "textarea", name: "detail", label: "Detail", rows: 3, required: true },
        ],
      },
      {
        kind: "objectList",
        name: "clubs",
        label: "Clubs",
        titleKey: "name",
        fields: [
          { kind: "text", name: "name", label: "Club", required: true },
          { kind: "text", name: "role", label: "Role" },
          { kind: "textarea", name: "summary", label: "Summary", rows: 3 },
        ],
      },
      { kind: "stringList", name: "mentorship", label: "Mentorship" },
    ],
  },
  {
    id: "leadership-roles",
    label: "Leadership",
    file: "leadership-roles.json",
    kind: "list",
    titleKey: "role",
    subtitleKey: "org",
    description: "Leadership roles, framed as scope, stakeholders and outcome.",
    fields: [
      { kind: "text", name: "role", label: "Role", required: true },
      { kind: "text", name: "org", label: "Organisation", required: true },
      { kind: "text", name: "period", label: "Period", help: "Already formatted, or a TODO sentinel." },
      { kind: "textarea", name: "scope", label: "Scope", rows: 2, help: "Who was represented, how many attended." },
      { kind: "stringList", name: "stakeholders", label: "Stakeholders", help: "Who had to be brought along." },
      { kind: "textarea", name: "summary", label: "Summary", rows: 4, required: true },
      { kind: "stringList", name: "outcomes", label: "Outcomes" },
      { kind: "multiselect", name: "identities", label: "Identities", options: IDENTITY_IDS },
    ],
  },
  {
    id: "affiliations",
    label: "Affiliations",
    file: "affiliations.json",
    kind: "list",
    titleKey: "name",
    description: "Memberships and programmes.",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true },
      { kind: "textarea", name: "detail", label: "Detail", rows: 2 },
    ],
  },
  {
    id: "lenses",
    label: "Lenses",
    file: "lenses.json",
    kind: "list",
    titleKey: "id",
    subtitleKey: "headline",
    description: "The home page rewritten for one kind of reader.",
    fields: [
      { kind: "select", name: "id", label: "Identity", options: IDENTITY_IDS, help: "Appears in the URL as ?lens=" },
      { kind: "textarea", name: "headline", label: "Headline", rows: 2, required: true },
      { kind: "textarea", name: "blurb", label: "Blurb", rows: 5, required: true },
      { kind: "stringList", name: "skills", label: "Highlighted skills" },
      { kind: "stringList", name: "projects", label: "Featured project slugs" },
      {
        kind: "objectList",
        name: "credentials",
        label: "Credentials",
        titleKey: "title",
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "text", name: "org", label: "Organisation" },
          { kind: "text", name: "detail", label: "Detail" },
          { kind: "text", name: "href", label: "Link" },
        ],
      },
    ],
  },
  {
    id: "identities",
    label: "Identities",
    file: "identities.json",
    kind: "list",
    titleKey: "label",
    subtitleKey: "title",
    description: "The six identities the whole site is organised around. Order drives nav and filters.",
    fields: [
      { kind: "select", name: "id", label: "ID", options: IDENTITY_IDS },
      { kind: "text", name: "label", label: "Short label", required: true },
      { kind: "text", name: "title", label: "Full title", required: true },
      { kind: "textarea", name: "summary", label: "Summary", rows: 3, required: true },
      { kind: "stringList", name: "highlights", label: "Highlights" },
      { kind: "text", name: "code", label: "Instrument code", help: "P&ID style tag, e.g. DS-01." },
      { kind: "text", name: "icon", label: "Icon", help: "lucide-react icon name." },
    ],
  },
  {
    id: "research-findings",
    label: "Research findings",
    file: "research-findings.json",
    kind: "list",
    titleKey: "question",
    subtitleKey: "projectLabel",
    description: "What each project established about method.",
    fields: [
      { kind: "text", name: "id", label: "ID", required: true },
      { kind: "textarea", name: "question", label: "Question", rows: 2, required: true },
      { kind: "textarea", name: "finding", label: "Finding", rows: 4, required: true },
      { kind: "textarea", name: "soWhat", label: "So what", rows: 3, required: true },
      { kind: "text", name: "project", label: "Project slug" },
      { kind: "text", name: "projectLabel", label: "Project label" },
      {
        kind: "object",
        name: "headline",
        label: "Headline figure",
        fields: [
          { kind: "text", name: "value", label: "Value", required: true },
          { kind: "text", name: "superseded", label: "Superseded value" },
          { kind: "text", name: "label", label: "Label", required: true },
        ],
      },
    ],
  },
  {
    id: "research-stance",
    label: "Research stance",
    file: "research-stance.json",
    kind: "single",
    description: "The short statement above the findings.",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "textarea", name: "body", label: "Body", rows: 6, required: true },
    ],
  },
];

export type CollectionId = string;

export const collectionById: Record<string, Collection> = Object.fromEntries(
  collections.map((collection) => [collection.id, collection]),
);
