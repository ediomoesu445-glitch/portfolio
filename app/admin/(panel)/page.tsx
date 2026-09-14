import Link from "next/link";
import { collections } from "@/lib/admin/collections";
import { storeBackend } from "@/lib/admin/store";

export default function AdminIndex() {
  const backend = storeBackend();

  return (
    <div>
      <h1 className="text-ink font-display mb-6 text-2xl font-bold">Collections</h1>

      <div className="border-line bg-surface/50 rounded-card mb-8 border p-4">
        <p className="text-ink-muted text-sm">
          {backend === "github" ? (
            <>
              Saving commits to GitHub, which triggers a rebuild. Changes appear in this
              panel immediately and on the live site in about a minute.
            </>
          ) : (
            <>
              No GitHub token set, so saving writes to{" "}
              <code className="text-ink font-mono text-xs">content/data/</code> on disk.
              That is the right behaviour locally; set GITHUB_TOKEN in production.
            </>
          )}
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link
              href={`/admin/${collection.id}`}
              className="interactive border-line bg-surface hover:bg-surface-raised rounded-card block h-full border p-4"
            >
              <span className="text-ink block text-sm font-medium">
                {collection.label}
              </span>
              <span className="text-ink-subtle mt-1 block text-xs leading-relaxed">
                {collection.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
