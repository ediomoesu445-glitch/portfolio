/**
 * Content model.
 *
 * Every piece of copy on the site is typed here and authored in the sibling
 * data files. Components read from these structures only — no hard-coded copy
 * in JSX — so the site can be edited without touching React.
 */

/** The five professional identities the site is organised around. */
export type IdentityId =
  | "researcher"
  | "data-scientist"
  | "ai-engineer"
  | "educator"
  | "leader"
  | "project-manager";

export interface Identity {
  id: IdentityId;
  /** Short label for nav, chips and filters. */
  label: string;
  /** Full title used in headings. */
  title: string;
  /** One-sentence positioning statement. */
  summary: string;
  /** Two to four proof points shown under the identity. */
  highlights: string[];
  /**
   * A short instrument tag, P&ID style. Identities are distinguished by code
   * and typography rather than by colour: under this palette colour means an
   * alarm or a verified reading, so spending five hues on decoration would
   * break the rule the whole design rests on.
   */
  code: string;
  /** lucide-react icon name, resolved in the component layer. */
  icon: string;
}

export type ProjectStatus = "shipped" | "in-progress" | "research" | "archived";

export interface ProjectMetric {
  label: string;
  /**
   * Use the literal string "TODO(metric)" until the real figure is measured.
   * The UI renders TODO(metric) as a visible placeholder badge, never as a
   * number, so nothing unverified can leak into the published site.
   */
  value: string;
  /** How the figure was derived — shown on hover/expand for credibility. */
  method?: string;
  /** A prior, misleading figure this one replaced. Rendered struck through. */
  superseded?: string;
  /** Why the figure is qualified. Rendered in the alarm accent. */
  caveat?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "repo" | "demo" | "writeup" | "paper" | "video" | "external";
}

export interface ProjectMedia {
  kind: "image" | "video" | "lottie";
  /**
   * Path under /public, or an absolute URL. May also be a TODO sentinel for
   * media that is planned but not yet captured — components must check
   * `isTodo(media.src)` before passing it to next/image.
   */
  src: string;
  /** WebM companion for <video>; MP4 goes in `src`. */
  srcWebm?: string;
  poster?: string;
  alt: string;
  /**
   * For media not yet captured: the exact shot required, including the target
   * filename. Surfaced on the placeholder card and in the capture checklist,
   * so a slot says what would fill it rather than just that it is empty.
   */
  shot?: string;
  width?: number;
  height?: number;
}

/**
 * The bespoke animated asset a case study leads with. Each is a real React
 * component in components/projects/motion/, driven by real data where real
 * data exists and clearly labelled as illustrative where it does not.
 */
export type MotionAssetId =
  | "anomaly-events"
  | "anomaly-timeseries"
  | "gradcam-slider"
  | "transaction-graph"
  | "dashboard-mock"
  | "findings-chart";

export interface ProjectDataset {
  name: string;
  source: string;
  /** Why this data and not the deployment target's own. */
  note?: string;
}

export interface Project {
  slug: string;
  /** Display order on the projects index. */
  order: number;
  title: string;
  /** One line, shown on cards. */
  tagline: string;
  /** Which identities this project evidences (drives filtering). */
  identities: IdentityId[];
  /** Longer description, 2-4 sentences, shown on the detail view. */
  summary: string;
  /** What the work set out to achieve. Opens the case study. */
  objective: string;
  problem?: string;
  approach?: string;
  /** How it was actually done — the method, in method-and-tools terms. */
  method?: string;
  outcome?: string;
  /** Honest next steps. Statements of intent, never claimed as done. */
  nextSteps: string[];
  dataset?: ProjectDataset;
  /** The animated asset this case study opens with. */
  motionAsset?: MotionAssetId;
  stack: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
  media?: ProjectMedia[];
  status: ProjectStatus;
  /** ISO date (YYYY-MM) of most recent work; used for ordering. */
  date: string;
  /** ISO date (YYYY-MM) the work began, for displaying a period. */
  started?: string;
  featured?: boolean;
  /** Set when the work involves material that cannot be published. */
  confidentialityNote?: string;
  /**
   * Scope or validity limits a reader should see before the numbers — e.g. a
   * result measured on a synthetic proxy rather than the real target. Shown
   * next to the metrics, not hidden in small print.
   */
  caveat?: string;
  /** Dataset attribution, where the licence requires it. */
  attribution?: string;
}

export interface ExperienceItem {
  org: string;
  role: string;
  location: string;
  /** ISO YYYY-MM. */
  start: string;
  /** ISO YYYY-MM, or null while current. */
  end: string | null;
  /**
   * Marks an ongoing role that nonetheless has a known end date — a fixed-term
   * placement, say. Without this, only `end: null` reads as current.
   */
  current?: boolean;
  identities: IdentityId[];
  summary: string;
  achievements: string[];
  stack?: string[];
}

export interface EducationItem {
  institution: string;
  credential: string;
  location: string;
  start: string;
  end: string | null;
  details?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** ISO YYYY-MM. */
  issued: string;
  credentialUrl?: string;
}

export interface SkillGroup {
  label: string;
  identities: IdentityId[];
  items: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  /** lucide-react icon name. */
  icon: string;
  /** Shown in the footer/contact block vs. only in structured data. */
  primary?: boolean;
}

export interface Profile {
  name: string;
  shortName: string;
  headline: string;
  /** 2-3 sentence bio for the hero/about section. */
  bio: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  links: SocialLink[];
  /** Path to the CV under /public, when one is published. */
  resumeUrl?: string;
  /** Professional headshot for the hero and about page. */
  headshot?: { src: string; alt: string; shot?: string };
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  org: string;
  identities: IdentityId[];
}

/**
 * Sentinel for facts that are not yet supplied or not yet measured.
 *
 * Any string of the form `TODO(...)` is treated as missing data by the UI: it
 * renders as a visible amber placeholder chip instead of being displayed as a
 * value, and `isTodo()` in lib/content.ts detects it. This is deliberate —
 * unverified numbers must never reach the published site looking like results.
 */
export type Todo = `TODO(${string})`;

export interface TeachingApproach {
  title: string;
  detail: string;
}

export interface TeachingSubject {
  name: string;
  detail: string;
}

export interface TeachingClub {
  name: string;
  role: string;
  summary: string;
}

export interface TeachingContent {
  intro: string;
  approach: TeachingApproach[];
  subjects: TeachingSubject[];
  clubs: TeachingClub[];
  mentorship: string[];
}

export interface LeadershipRole {
  org: string;
  role: string;
  /** Already-formatted period, or a TODO sentinel. */
  period: string;
  /** The scale of the role — who was represented, how many attended. */
  scope?: string;
  summary: string;
  outcomes: string[];
  identities: IdentityId[];
}

/** A membership or programme, rather than a role with outcomes. */
export interface Affiliation {
  name: string;
  detail?: string;
}

/**
 * A "lens" — the home page seen through one professional identity.
 *
 * Selecting a lens rewrites the hero copy, the highlighted skills and the
 * featured items. The choice lives in the URL (`?lens=educator`) so a single
 * link can open the site already framed for the reader it is being sent to.
 */
export interface LensItem {
  title: string;
  org?: string;
  detail?: string;
  /** Internal route this item links to, when there is one. */
  href?: string;
}

export interface Lens {
  id: IdentityId;
  /** The one-line positioning statement that replaces the hero copy. */
  headline: string;
  /** Two or three sentences under the headline. */
  blurb: string;
  /** The skills worth highlighting for this reader. */
  skills: string[];
  /** Project slugs to feature, in order. */
  projects: string[];
  /** CV material to surface — roles, credentials, memberships. */
  credentials: LensItem[];
}

/**
 * A methodological finding — something a project established about *method*,
 * usually at the cost of a more flattering headline number.
 */
export interface ResearchFinding {
  id: string;
  /** The question the work was actually answering. */
  question: string;
  /** What was established, with the figures that establish it. */
  finding: string;
  /** Why it matters beyond this one project. */
  soWhat: string;
  /** Slug of the project it came from. */
  project: string;
  projectLabel: string;
  headline: {
    value: string;
    /** The figure this one replaced, where there was one. */
    superseded?: string;
    label: string;
  };
}
