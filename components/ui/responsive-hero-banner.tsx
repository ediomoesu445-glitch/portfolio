import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getDimensions } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Vendored from 21st.dev and adapted. Four deliberate departures from the
 * original, all of which would otherwise break something already built here:
 *
 * 1. The original renders its own <header> with a nav and a mobile menu. This
 *    site already has SiteHeader - sticky, active-route aware, with a mobile
 *    disclosure that closes on Escape and returns focus. Two navs on one page
 *    is a bug, not a feature, so the header is gone and the banner sits under
 *    the real one.
 * 2. The accompanying CSS redefines --font-sans as Inter and --color-background
 *    as #09090b. Pasting that would replace Archivo and IBM Plex site-wide and
 *    overwrite the Control Room palette. Only the missing animation utilities
 *    were taken; the theme is untouched.
 * 3. `<img>` became next/image, as everywhere else here.
 * 4. The "partners" strip asked for logos of organisations. There are no
 *    sponsors to show, and putting institutional logos under a partnership
 *    heading would claim endorsements that do not exist - so the strip takes
 *    plain text and is labelled for what it is.
 */

export interface HeroAction {
  label: string;
  href: string;
  /** Renders after the label - an arrow, usually. */
  icon?: ReactNode;
}

export interface ResponsiveHeroBannerProps {
  /** Full-bleed image behind the copy. Darkened heavily; it is a texture. */
  backgroundImageUrl: string;
  /** Description of that image for anyone who cannot see it. */
  backgroundImageAlt?: string;
  badgeLabel?: string;
  badgeText?: string;
  title: string;
  titleLine2?: string;
  description?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Heading above the closing strip. Say what the list actually is. */
  stripTitle?: string;
  /** Plain text entries. No logos - see note 4 above. */
  stripItems?: string[];
  /** Sits above the badge. The headshot, usually. */
  leading?: ReactNode;
  children?: ReactNode;
  className?: string;
}

function ActionLink({
  action,
  variant,
}: {
  action: HeroAction;
  variant: "primary" | "ghost";
}) {
  const external = action.href.startsWith("http") || action.href.startsWith("mailto:");
  const classes = cn(
    "inline-flex items-center gap-2 rounded-card px-5 py-3 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-normal text-normal-ink hover:bg-normal/90"
      : "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/15",
  );

  if (external) {
    return (
      <a href={action.href} className={classes}>
        {action.label}
        {action.icon}
      </a>
    );
  }

  return (
    <Link href={action.href} className={classes}>
      {action.label}
      {action.icon}
    </Link>
  );
}

/**
 * A full-bleed banner: a darkened image, a badge, a display heading, two calls
 * to action and a closing strip.
 */
export function ResponsiveHeroBanner({
  backgroundImageUrl,
  backgroundImageAlt = "",
  badgeLabel,
  badgeText,
  title,
  titleLine2,
  description,
  primaryAction,
  secondaryAction,
  stripTitle,
  stripItems,
  leading,
  children,
  className,
}: ResponsiveHeroBannerProps) {
  const dimensions = getDimensions(backgroundImageUrl);

  return (
    <section className={cn("relative isolate w-full overflow-hidden", className)}>
      <Image
        src={backgroundImageUrl}
        alt={backgroundImageAlt}
        width={dimensions?.width ?? 1600}
        height={dimensions?.height ?? 900}
        priority
        sizes="100vw"
        className="absolute inset-0 size-full object-cover opacity-[0.12]"
      />
      {/* The image is a texture, not a picture: sunk to 16% and then faded
          into the page ground, so display type reads cleanly over it and the
          banner still belongs to a desaturated palette. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--bg), rgb(0 0 0 / 0.25) 30%, var(--bg))",
        }}
      />

      <div className="max-w-content relative z-10 mx-auto w-full px-5 py-12 md:px-8 md:py-16">
        {leading && <div className="animate-fade-slide-in-1 mb-4">{leading}</div>}

        {badgeText && (
          <div className="animate-fade-slide-in-1 rounded-pill border-line bg-surface/80 mb-6 inline-flex items-center gap-3 border px-2.5 py-1.5 backdrop-blur">
            {badgeLabel && (
              <span className="rounded-pill bg-normal text-normal-ink px-2 py-0.5 font-mono text-[11px] tracking-[0.1em] uppercase">
                {badgeLabel}
              </span>
            )}
            <span className="text-ink-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              {badgeText}
            </span>
          </div>
        )}

        <h1 className="animate-fade-slide-in-2 text-display font-display text-ink max-w-[14ch] font-bold">
          {title}
          {titleLine2 && (
            <>
              <br className="hidden sm:block" />
              {titleLine2}
            </>
          )}
        </h1>

        {description && (
          <p className="animate-fade-slide-in-3 text-ink-muted mt-7 max-w-2xl text-lg leading-relaxed md:text-xl">
            {description}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="animate-fade-slide-in-4 mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {primaryAction && <ActionLink action={primaryAction} variant="primary" />}
            {secondaryAction && <ActionLink action={secondaryAction} variant="ghost" />}
          </div>
        )}

        {children}

        {stripItems && stripItems.length > 0 && (
          <div className="animate-fade-slide-in-4 border-line mt-16 border-t pt-6">
            {stripTitle && (
              <p className="text-overline text-ink-subtle font-mono uppercase">
                {stripTitle}
              </p>
            )}
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {stripItems.map((item) => (
                <li key={item} className="text-ink-muted text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default ResponsiveHeroBanner;
