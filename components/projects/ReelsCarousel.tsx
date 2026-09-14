import { projects } from "@/content/projects";
import { isTodo } from "@/lib/content";
import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze";

/**
 * Every project's demo reel in one carousel.
 *
 * Reels live here rather than on the case studies because there is one per
 * project — a carousel of one is a still image with arrows. Figures stay
 * letterboxed in their own grid, where a cropped confusion matrix would lose
 * its axis labels.
 */
const reels: SqueezeSlide[] = [...projects]
  .sort((a, b) => a.order - b.order)
  .flatMap((project) =>
    (project.media ?? [])
      .filter((media) => media.kind === "video")
      .map((media): SqueezeSlide => {
        const pending = isTodo(media.src);
        return {
          id: `${project.slug}-reel`,
          title: project.title,
          description: pending ? media.shot : media.alt,
          image: pending ? undefined : media.poster,
          imageAlt: media.alt,
          // Nothing to show yet, so the panel carries the same hatched
          // treatment a labelled gap gets everywhere else on the site.
          background: pending
            ? "repeating-linear-gradient(135deg, var(--alarm-soft) 0 14px, transparent 14px 28px), var(--bg-subtle)"
            : undefined,
          overlay: (
            <span className="font-mono text-[11px] tracking-[0.12em] text-white uppercase">
              {pending
                ? `Reel ${String(project.order).padStart(2, "0")} · to capture`
                : `Reel ${String(project.order).padStart(2, "0")}`}
            </span>
          ),
          action: "Open the case study",
          href: `/projects/${project.slug}`,
        };
      }),
  );

export const reelCount = reels.length;
export const capturedReelCount = [...projects].filter((project) =>
  (project.media ?? []).some((media) => media.kind === "video" && !isTodo(media.src)),
).length;

export function ReelsCarousel() {
  if (reels.length === 0) return null;

  return (
    <SqueezeCarousel
      slides={reels}
      label="Project demo reels"
      height="clamp(200px, 34cqi, 360px)"
      radius={2}
      duration={900}
    />
  );
}
