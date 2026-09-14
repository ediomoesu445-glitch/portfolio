import Image from "next/image";
import { profile } from "@/content/profile";
import { isTodo } from "@/lib/content";
import { getDimensions } from "@/lib/media";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-14",
  md: "size-24",
  lg: "size-36",
} as const;

/**
 * The headshot slot.
 *
 * Until a photograph exists it renders as a labelled frame rather than a
 * broken image or a generic avatar, so the gap is obviously a gap - and the
 * capture spec travels with it in the title attribute.
 */
export function Headshot({
  size = "md",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  const headshot = profile.headshot;
  if (!headshot) return null;

  const pending = isTodo(headshot.src);
  const dimensions = pending ? null : getDimensions(headshot.src);

  if (pending) {
    return (
      <div
        title={headshot.shot}
        className={cn(
          "border-alarm/50 bg-alarm-soft/40 rounded-pill flex shrink-0 items-center justify-center border border-dashed",
          sizes[size],
          className,
        )}
      >
        <span aria-hidden className="text-alarm font-mono text-[10px]">
          ◌
        </span>
        <span className="sr-only">Headshot to be added</span>
      </div>
    );
  }

  return (
    <Image
      src={headshot.src}
      alt={headshot.alt}
      width={dimensions?.width ?? 400}
      height={dimensions?.height ?? 400}
      className={cn(
        "border-line rounded-pill shrink-0 border object-cover",
        sizes[size],
        className,
      )}
    />
  );
}
