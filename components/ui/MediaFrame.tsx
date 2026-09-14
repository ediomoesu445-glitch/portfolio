import Image from "next/image";
import type { ProjectMedia } from "@/content/types";
import { isTodo, todoLabel } from "@/lib/content";
import { getAspect, getDimensions } from "@/lib/media";
import { cn } from "@/lib/utils";
import { VideoReel } from "./VideoReel";

/**
 * A styled stand-in for media that has not been captured yet, showing the
 * exact shot required rather than a generic "coming soon".
 */
export function MediaPlaceholder({
  label,
  shot,
  aspect = "16 / 9",
  className,
}: {
  label: string;
  shot?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: aspect }}
      className={cn(
        "rounded-card border-alarm/40 bg-alarm-soft/40 relative w-full overflow-hidden border border-dashed",
        className,
      )}
    >
      {/* A faint grid, so an empty slot still reads as a deliberate frame. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--alarm) 1px, transparent 1px), linear-gradient(90deg, var(--alarm) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span
          aria-hidden
          className="text-alarm font-mono text-xl"
          title="Awaiting capture"
        >
          ◌
        </span>
        <p className="text-alarm font-mono text-[11px] tracking-[0.12em] uppercase">
          {label}
        </p>
        {shot && (
          <p className="text-ink-muted max-w-sm text-[13px] leading-relaxed">{shot}</p>
        )}
      </div>
    </div>
  );
}

/**
 * One frame for every visual asset: an image, a demo reel, or a labelled gap.
 *
 * Images are given their intrinsic width and height from the media manifest so
 * layout space is reserved before the file arrives, and everything below the
 * fold loads lazily. Figures are letterboxed rather than cropped - cropping a
 * confusion matrix to fill a box loses the axis labels.
 */
export function MediaFrame({
  media,
  caption,
  aspect,
  fit = "contain",
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: {
  media: ProjectMedia;
  caption?: string;
  /** Overrides the intrinsic ratio from the manifest. */
  aspect?: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const pending = isTodo(media.src);
  const ratio = aspect ?? getAspect(media.src);
  const size = getDimensions(media.src);

  return (
    <figure className={cn("group", className)}>
      {pending ? (
        <MediaPlaceholder
          label={media.kind === "video" ? "Recording to capture" : "Image to capture"}
          shot={media.shot ?? todoLabel(media.src)}
          aspect={aspect ?? "16 / 9"}
        />
      ) : media.kind === "video" ? (
        <VideoReel
          src={media.src}
          srcWebm={media.srcWebm}
          poster={media.poster ?? ""}
          alt={media.alt}
          aspect={aspect ?? "16 / 9"}
        />
      ) : (
        <div
          style={{ aspectRatio: ratio }}
          className="rounded-card border-line bg-bg-subtle relative w-full overflow-hidden border"
        >
          <Image
            src={media.src}
            alt={media.alt}
            fill={!size}
            width={size?.width}
            height={size?.height}
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className={cn(
              "absolute inset-0 size-full p-px",
              fit === "cover" ? "object-cover" : "object-contain",
            )}
          />
        </div>
      )}

      {caption && (
        <figcaption className="text-ink-subtle mt-3 text-[13px] leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
