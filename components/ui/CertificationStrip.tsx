import { BadgeCheck } from "lucide-react";
import type { Certification } from "@/content/types";
import { formatMonth, isTodo } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Overline } from "./Heading";
import { TodoChip } from "./TodoChip";

/**
 * A horizontal strip of credentials.
 *
 * Deliberately plain: a certificate is a fact with a date and an issuer, and
 * dressing it up as a badge would imply a weight none of them carry on their
 * own. The issuer is the part a reader checks, so it is not the small print.
 */
export function CertificationStrip({
  certifications,
  title = "Certifications",
  className,
}: {
  certifications: Certification[];
  title?: string;
  className?: string;
}) {
  if (certifications.length === 0) return null;

  return (
    <div className={className}>
      <Overline>{title}</Overline>
      <ul className="border-line bg-line mt-5 grid gap-px border md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <li key={certification.name} className="bg-bg p-5">
            <div className="flex items-start gap-3">
              <BadgeCheck className="text-normal mt-0.5 size-4 shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="text-ink text-sm leading-snug font-medium">
                  {certification.credentialUrl ? (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive hover:text-normal"
                    >
                      {certification.name}
                    </a>
                  ) : (
                    certification.name
                  )}
                </p>
                <p className="text-ink-muted mt-1 text-[13px]">
                  {certification.issuer}
                </p>
                <div className="mt-2">
                  {isTodo(certification.issued) ? (
                    <TodoChip value={certification.issued} />
                  ) : (
                    <span
                      className={cn(
                        "text-ink-subtle font-mono text-[11px] tracking-[0.1em] uppercase",
                      )}
                    >
                      {formatMonth(certification.issued)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
