/**
 * Content model.
 *
 * Every piece of copy on the site is typed here and authored in the sibling
 * data files. Components read from these structures only — no hard-coded copy
 * in JSX — so the site can be edited without touching React.
 */

/** The five professional identities the site is organised around. */
export type IdentityId =
  "data-scientist" | "ai-engineer" | "educator" | "leader" | "project-manager";

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
  width?: number;
  height?: number;
}

export interface Project {
  slug: string;
  title: string;
  /** One line, shown on cards. */
  tagline: string;
  /** Which identities this project evidences (drives filtering). */
  identities: IdentityId[];
  /** Longer description, 2-4 sentences, shown on the detail view. */
  summary: string;
  problem?: string;
  approach?: string;
  outcome?: string;
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
