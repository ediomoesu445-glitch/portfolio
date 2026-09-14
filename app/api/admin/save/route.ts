import { NextResponse } from "next/server";
import { collectionById, type Field } from "@/lib/admin/collections";
import { readCollection, writeCollection } from "@/lib/admin/store";
import { isTodo } from "@/lib/content";

/**
 * Validates an admin edit and commits it.
 *
 * Validation runs here rather than only in the browser. The form already
 * prevents most of this, but the endpoint is the thing that actually decides
 * what reaches the repo, and a form check is a convenience, not a guarantee.
 */

interface SaveBody {
  collection?: string;
  data?: unknown;
  message?: string;
  sha?: string;
}

function labelPath(path: string[]): string {
  return path.length ? path.join(" > ") : "record";
}

/** Walks a record against its schema, collecting every problem at once. */
function validate(fields: Field[], value: unknown, path: string[]): string[] {
  const errors: string[] = [];
  if (typeof value !== "object" || value === null) {
    return [`${labelPath(path)} must be an object.`];
  }
  const record = value as Record<string, unknown>;

  for (const field of fields) {
    const raw = record[field.name];
    const here = [...path, field.label];
    const empty =
      raw === undefined ||
      raw === null ||
      (typeof raw === "string" && raw.trim() === "");

    if ("required" in field && field.required && empty) {
      errors.push(`${labelPath(here)} is required.`);
      continue;
    }

    // The rule the whole site rests on: a real figure must say how it was
    // measured. A TODO sentinel is exempt, because it is openly not a result.
    if (field.kind === "textarea" && field.requiredUnlessTodo) {
      const companion = record[field.requiredUnlessTodo];
      const isPlaceholder =
        typeof companion === "string" && isTodo(companion);
      const hasCompanion =
        typeof companion === "string" && companion.trim() !== "";
      if (hasCompanion && !isPlaceholder && empty) {
        errors.push(
          `${labelPath(here)} is required when the value is a real figure. ` +
            "Say how it was measured, or mark the value as TODO(metric).",
        );
      }
    }

    if (empty) continue;

    if (field.kind === "objectList") {
      if (!Array.isArray(raw)) {
        errors.push(`${labelPath(here)} must be a list.`);
        continue;
      }
      raw.forEach((item, index) => {
        errors.push(...validate(field.fields, item, [...here, `#${index + 1}`]));
      });
    } else if (field.kind === "object") {
      errors.push(...validate(field.fields, raw, here));
    } else if (field.kind === "stringList" || field.kind === "multiselect") {
      if (!Array.isArray(raw)) errors.push(`${labelPath(here)} must be a list.`);
    } else if (field.kind === "select") {
      if (typeof raw === "string" && !field.options.includes(raw)) {
        errors.push(
          `${labelPath(here)} must be one of: ${field.options.join(", ")}.`,
        );
      }
    } else if (field.kind === "number") {
      if (typeof raw !== "number" || Number.isNaN(raw)) {
        errors.push(`${labelPath(here)} must be a number.`);
      }
    }
  }

  return errors;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SaveBody;
  const collection = body.collection
    ? collectionById[body.collection]
    : undefined;

  if (!collection) {
    return NextResponse.json(
      { message: "Unknown collection." },
      { status: 400 },
    );
  }

  const records =
    collection.kind === "list"
      ? Array.isArray(body.data)
        ? body.data
        : null
      : [body.data];

  if (!records) {
    return NextResponse.json(
      { message: `${collection.label} must be a list.` },
      { status: 400 },
    );
  }

  const errors = records.flatMap((record, index) =>
    validate(
      collection.fields,
      record,
      collection.kind === "list" ? [`Item ${index + 1}`] : [],
    ),
  );

  if (errors.length > 0) {
    return NextResponse.json(
      { message: "That edit was not saved.", errors },
      { status: 422 },
    );
  }

  try {
    const result = await writeCollection(
      collection.id,
      body.data,
      body.message?.trim() || `Update ${collection.label} from the admin panel`,
      body.sha,
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Save failed." },
      { status: 500 },
    );
  }
}

/** Current content plus the SHA the next save must carry. */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("collection");
  const collection = id ? collectionById[id] : undefined;
  if (!collection) {
    return NextResponse.json({ message: "Unknown collection." }, { status: 400 });
  }
  try {
    return NextResponse.json(await readCollection(collection.id));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Read failed." },
      { status: 500 },
    );
  }
}
