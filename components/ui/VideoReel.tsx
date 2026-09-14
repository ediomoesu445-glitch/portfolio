"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { getDimensions } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * A short demo reel.
 *
 * Muted, looping, inline and lazy - but never autoplaying with sound, and
 * never autoplaying at all when the visitor has asked for reduced motion. In
 * that case the poster is shown instead, with the control still available so
 * the footage is reachable rather than withheld.
 *
 * The poster is required: without it the frame has nothing to paint before the
 * video loads and the layout jumps.
 */
export function VideoReel({
  src,
  srcWebm,
  poster,
  alt,
  aspect = "16 / 9",
  className,
}: {
  /** MP4 source. */
  src: string;
  /** WebM source, served first where supported. */
  srcWebm?: string;
  poster: string;
  alt: string;
  aspect?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const posterSize = getDimensions(poster);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setStarted(true);
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <div
      style={{ aspectRatio: aspect }}
      className={cn(
        "rounded-card border-line bg-bg-subtle relative w-full overflow-hidden border",
        className,
      )}
    >
      {/* The poster is painted as a real image until playback starts, so the
          frame is filled immediately and nothing reflows. */}
      {!started && (
        <Image
          src={poster}
          alt={alt}
          fill={!posterSize}
          width={posterSize?.width}
          height={posterSize?.height}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 size-full object-cover"
        />
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        // Autoplay only when motion is welcome; sound is never involved.
        autoPlay={prefersReducedMotion ? false : undefined}
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        <source src={src} type="video/mp4" />
        Your browser cannot play this video.
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause: ${alt}` : `Play: ${alt}`}
        className="interactive rounded-card border-line bg-bg/90 text-ink hover:border-line-strong absolute right-3 bottom-3 inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase backdrop-blur-sm"
      >
        {playing ? (
          <Pause className="size-3.5" aria-hidden />
        ) : (
          <Play className="size-3.5" aria-hidden />
        )}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
