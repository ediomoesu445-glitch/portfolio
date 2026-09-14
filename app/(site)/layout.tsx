import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PersonSchema } from "@/components/seo/PersonSchema";

/**
 * Chrome for the public site.
 *
 * A route group, so the URLs are unchanged: app/(site)/about/page.tsx is
 * still /about. Everything outside this group - the admin panel - renders in
 * the bare document shell from the root layout.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PersonSchema />
      <a
        href="#main"
        className="focus:rounded-card focus:bg-alarm focus:text-alarm-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
