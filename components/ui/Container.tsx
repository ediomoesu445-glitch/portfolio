import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Width = "content" | "prose" | "wide";

const widths: Record<Width, string> = {
  content: "max-w-content",
  prose: "max-w-prose",
  wide: "max-w-wide",
};

/** Centres content and owns the page's horizontal gutter. */
export function Container({
  width = "content",
  as: Component = "div",
  className,
  children,
}: {
  width?: Width;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Component className={cn("mx-auto w-full px-5 md:px-8", widths[width], className)}>
      {children}
    </Component>
  );
}
