"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Collection jump list plus sign-out.
 *
 * A select rather than a row of links: fifteen collections wrap badly on a
 * phone, and this panel is most useful precisely when you are not at a desk.
 */
export function AdminNav({
  collections,
}: {
  collections: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) router.push(`/admin/${event.target.value}`);
        }}
        aria-label="Jump to a collection"
        className="rounded-card border-line bg-bg text-ink focus:border-normal focus:ring-focus/40 border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      >
        <option value="">Jump to...</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => void signOut()}
        disabled={busy}
        className="border-line text-ink-muted hover:text-ink rounded-card border px-3 py-2 text-sm disabled:opacity-50"
      >
        Sign out
      </button>
    </div>
  );
}
