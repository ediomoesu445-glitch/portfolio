import type { ReactNode } from "react";
import { Container } from "./Container";
import { Heading } from "./Heading";
import { cn } from "@/lib/utils";

type Tone = "default" | "subtle";

const tones: Record<Tone, string> = {
  default: "",
  subtle: "bg-bg-subtle",
};

/**
 * One vertical rhythm for the whole site. Sections own their spacing and
 * dividing rule so pages never hand-tune margins between them.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  tone = "default",
  divided = true,
  width,
  headerClassName,
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  tone?: Tone;
  /** Draws the hairline rule that separates this section from the one above. */
  divided?: boolean;
  width?: "content" | "prose" | "wide";
  headerClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        "py-20 md:py-28",
        divided && "border-line border-t",
        tones[tone],
        className,
      )}
    >
      <Container width={width}>
        {(eyebrow || title || description) && (
          <header className={cn("mb-12 max-w-prose", headerClassName)}>
            {title ? (
              <Heading level={2} size="headline" eyebrow={eyebrow} id={headingId}>
                {title}
              </Heading>
            ) : null}
            {description && (
              <div className="text-ink-muted mt-5 text-lg leading-relaxed">
                {description}
              </div>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
