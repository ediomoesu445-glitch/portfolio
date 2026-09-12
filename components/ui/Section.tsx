import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn("py-20 md:py-28", className)}
    >
      <div className="container-content">
        {(eyebrow || title || description) && (
          <header className="mb-12 max-w-prose">
            {eyebrow && (
              <p className="text-overline text-accent mb-3 font-mono uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 id={headingId} className="text-headline text-ink font-semibold">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-ink-muted mt-4 text-lg leading-relaxed">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
