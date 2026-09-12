import Image from "next/image";
import type { ProjectMedia } from "@/content/types";
import { isTodo, todoLabel } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * One frame for every visual asset: an image, or a video with a poster.
 *
 * Charts and figures are letterboxed rather than cropped (`fit="contain"`) —
 * cropping a confusion matrix to fill a box loses the axis labels. Media whose
 * source is still a TODO sentinel renders as a labelled placeholder instead of
 * a broken image.
 */
export function MediaFrame({
  media,
  caption,
  aspect = "16 / 10",
  fit = "contain",
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: {
  media: ProjectMedia;
  caption?: string;
  /** Any CSS aspect-ratio value. */
  aspect?: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const pending = isTodo(media.src);

  return (
    <figure className={cn("group", className)}>
      <div
        style={{ aspectRatio: aspect }}
        className={cn(
          "rounded-card border-line bg-bg-subtle relative w-full overflow-hidden border",
          pending && "border-alarm/40 bg-alarm-soft/30 border-dashed",
        )}
      >
        {pending ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <span aria-hidden className="text-alarm font-mono text-2xl">
              ◌
            </span>
            <p className="text-alarm max-w-xs font-mono text-[11px] leading-relaxed">
              {todoLabel(media.src)}
            </p>
          </div>
        ) : media.kind === "video" ? (
          <video
            className={cn(
              "absolute inset-0 size-full",
              fit === "cover" ? "object-cover" : "object-contain",
            )}
            poster={media.poster}
            controls
            playsInline
            preload="none"
            aria-label={media.alt}
          >
            {media.srcWebm && <source src={media.srcWebm} type="video/webm" />}
            <source src={media.src} type="video/mp4" />
            Your browser cannot play this video.
          </video>
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(fit === "cover" ? "object-cover" : "object-contain", "p-px")}
          />
        )}
      </div>

      {caption && (
        <figcaption className="text-ink-subtle mt-3 text-[13px] leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
