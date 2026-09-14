import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { collections } from "@/lib/admin/collections";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  // Belt and braces alongside the robots.txt rule: a panel that turns up in
  // search results is an invitation, even behind a password.
  robots: { index: false, follow: false },
};

/** Rendered per request so the editor never serves a cached session state. */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="max-w-content mx-auto w-full flex-1 px-5 py-10 md:px-8">
      <div className="border-line mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b pb-5">
        <div>
          <Link href="/admin" className="text-ink font-display text-xl font-bold">
            Content admin
          </Link>
          <p className="text-ink-subtle mt-1 text-xs">
            Edits commit to the repo. The site rebuilds automatically.
          </p>
        </div>
        <AdminNav
          collections={collections.map((c) => ({ id: c.id, label: c.label }))}
        />
      </div>
      {children}
    </main>
  );
}
