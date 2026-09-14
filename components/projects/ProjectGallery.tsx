import type { Project, ProjectMedia } from "@/content/types";
import { isTodo } from "@/lib/content";
import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze";

/**
 * Alt text here is written as "the thing, what it shows" or "the thing. What it
 * shows." The carousel wants those two halves separately — a dark opening line
 * and a grey sentence running on from it — so split on the first break rather
 * than duplicating every caption in the content files.
 */
function split(alt: string): { title: string; description?: string } {
  const sentence = alt.match(/^(.+?[.!?])\s+(.*)$/);
  if (sentence) return { title: sentence[1], description: sentence[2] };

  const clause = alt.match(/^(.+?),\s+(showing|with|against|from|and)\s+(.*)$/i);
  if (clause) {
    return {
      title: `${clause[1]}.`,
      description: `${clause[2][0].toUpperCase()}${clause[2].slice(1)} ${clause[3]}`,
    };
  }

  return { title: alt };
}

/** A corner wordmark: what this panel is, in the instrument voice. */
function mark(text: string) {
  return (
    <span className="font-mono text-[11px] tracking-[0.12em] text-white uppercase">
      {text}
    </span>
  );
}

function toSlide(media: ProjectMedia, index: number): SqueezeSlide {
  const pending = isTodo(media.src);
  const position = String(index + 1).padStart(2, "0");

  if (pending) {
    return {
      id: media.src,
      title:
        media.kind === "video"
          ? "A reel that has not been recorded yet."
          : "An image that has not been captured yet.",
      description: media.shot,
      // No picture to show, so the panel carries the placeholder treatment the
      // rest of the site uses for a labelled gap.
      background:
        "repeating-linear-gradient(135deg, var(--alarm-soft) 0 14px, transparent 14px 28px), var(--bg-subtle)",
      overlay: mark(media.kind === "video" ? "Reel · to capture" : "To capture"),
    };
  }

  const { title, description } = split(media.alt);

  return {
    id: media.src,
    title,
    description,
    image: media.kind === "video" ? media.poster : media.src,
    imageAlt: media.alt,
    overlay: mark(media.kind === "video" ? `Reel ${position}` : `Figure ${position}`),
    // Panels crop to keep the squeeze working, so every real figure keeps a
    // route to the uncropped file — a confusion matrix is unreadable without
    // its axis labels.
    action: media.kind === "video" ? undefined : "View full size",
    href: media.kind === "video" ? undefined : media.src,
    target: "_blank",
  };
}

/**
 * The case-study gallery: every figure and reel for one project, in a carousel
 * that opens one panel and squeezes the rest into slats.
 */
export function ProjectGallery({ project }: { project: Project }) {
  const media = project.media ?? [];
  if (media.length === 0) return null;

  return (
    <SqueezeCarousel
      slides={media.map(toSlide)}
      label={`${project.title} — figures and reels`}
      height="clamp(200px, 34cqi, 360px)"
      radius={2}
      gap={16}
      slatGap={8}
      slatWidth={8}
      duration={900}
    />
  );
}
