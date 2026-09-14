import { notFound } from "next/navigation";
import { collectionById } from "@/lib/admin/collections";
import { readCollection } from "@/lib/admin/store";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

/**
 * Reads the collection on the server and hands it to the editor.
 *
 * Reading here rather than fetching on mount means the editor renders with
 * real content on the first paint, and avoids a fetch-in-effect that would
 * cascade renders. The layout is force-dynamic, so this runs per request and
 * always sees current content.
 */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: id } = await params;
  const collection = collectionById[id];
  if (!collection) notFound();

  let state: { data: unknown; sha?: string };
  try {
    state = await readCollection(collection.id);
  } catch (error) {
    return (
      <div>
        <h1 className="text-ink font-display text-2xl font-bold">{collection.label}</h1>
        <p className="text-alarm mt-4 text-sm">
          {error instanceof Error ? error.message : "Could not load this collection."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-ink font-display text-2xl font-bold">{collection.label}</h1>
        <p className="text-ink-muted mt-1 text-sm">{collection.description}</p>
      </div>
      <CollectionEditor
        collection={collection}
        initialData={state.data}
        initialSha={state.sha}
      />
    </div>
  );
}
