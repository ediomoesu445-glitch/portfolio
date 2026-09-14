"use client";

import { useCallback, useMemo, useState } from "react";
import type { Collection, Field } from "@/lib/admin/collections";
import { isTodo } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The form engine.
 *
 * One component renders every collection, driven by the schema rather than by
 * fifteen hand-written forms that would drift from the content model.
 *
 * Content arrives as a prop from a server component that reads it live, so the
 * editor shows what is actually in the repo right now rather than whatever the
 * last build happened to bundle - and it does so without a fetch-on-mount
 * effect, which would cascade renders. Saving returns the new blob SHA, so the
 * editor stays open and can save again without reloading.
 */

type Json = Record<string, unknown>;

/** Immutable set at a nested path, creating containers as needed. */
function setPath(target: unknown, path: (string | number)[], value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;

  if (typeof head === "number") {
    const list = Array.isArray(target) ? [...target] : [];
    list[head] = setPath(list[head], rest, value);
    return list;
  }
  const object = typeof target === "object" && target !== null ? { ...(target as Json) } : {};
  object[head] = setPath(object[head], rest, value);
  return object;
}

function getPath(target: unknown, path: (string | number)[]): unknown {
  return path.reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Json)[key as string];
  }, target);
}

/** A blank record shaped by the schema, so a new item is not an empty object. */
function blankRecord(fields: Field[]): Json {
  const record: Json = {};
  for (const field of fields) {
    if (field.kind === "stringList" || field.kind === "multiselect" || field.kind === "objectList") {
      record[field.name] = [];
    } else if (field.kind === "boolean") {
      record[field.name] = false;
    } else if (field.kind === "object") {
      record[field.name] = blankRecord(field.fields);
    } else if (field.kind === "select") {
      record[field.name] = field.options[0] ?? "";
    } else if (field.kind !== "number") {
      record[field.name] = "";
    }
  }
  return record;
}

const inputClass =
  "w-full rounded-card border border-line bg-bg px-3 py-2 text-sm text-ink " +
  "placeholder:text-ink-subtle focus:border-normal focus:outline-none " +
  "focus:ring-2 focus:ring-focus/40";

function FieldLabel({ field }: { field: Field }) {
  const required = "required" in field && field.required;
  return (
    <div className="mb-1.5">
      <label className="text-ink text-sm font-medium">
        {field.label}
        {required && <span className="text-alarm ml-1">*</span>}
      </label>
      {field.help && (
        <p className="text-ink-subtle mt-0.5 text-xs leading-relaxed">{field.help}</p>
      )}
    </div>
  );
}

function StringListInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {value.map((entry, index) => (
        <div key={index} className="flex gap-2">
          <textarea
            rows={2}
            className={inputClass}
            value={entry}
            onChange={(event) => {
              const next = [...value];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="border-line text-ink-subtle hover:text-alarm hover:border-alarm rounded-card shrink-0 self-start border px-2 py-2 text-xs"
            aria-label={`Remove item ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="border-line text-ink-muted hover:text-ink rounded-card border border-dashed px-3 py-1.5 text-xs"
      >
        Add
      </button>
    </div>
  );
}

function FieldInput({
  field,
  path,
  data,
  onChange,
  siblings,
}: {
  field: Field;
  path: (string | number)[];
  data: unknown;
  onChange: (path: (string | number)[], value: unknown) => void;
  siblings: Json;
}) {
  const here = [...path, field.name];
  const value = getPath(data, here);
  const set = (next: unknown) => onChange(here, next);

  switch (field.kind) {
    case "text":
      return (
        <input
          type="text"
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(event) => set(event.target.value)}
        />
      );

    case "textarea": {
      // Surface the metric rule at the point of editing, not just on save.
      const companion = field.requiredUnlessTodo
        ? siblings[field.requiredUnlessTodo]
        : undefined;
      const owed =
        typeof companion === "string" &&
        companion.trim() !== "" &&
        !isTodo(companion) &&
        !((value as string) ?? "").trim();
      return (
        <div>
          <textarea
            rows={field.rows ?? 3}
            className={cn(inputClass, owed && "border-alarm")}
            value={(value as string) ?? ""}
            onChange={(event) => set(event.target.value)}
          />
          {owed && (
            <p className="text-alarm mt-1 text-xs">
              Required: this value is a real figure, so it needs a method.
            </p>
          )}
        </div>
      );
    }

    case "number":
      return (
        <input
          type="number"
          step="any"
          className={inputClass}
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(event) =>
            set(event.target.value === "" ? undefined : Number(event.target.value))
          }
        />
      );

    case "boolean":
      return (
        <label className="text-ink-muted flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-normal size-4"
            checked={Boolean(value)}
            onChange={(event) => set(event.target.checked)}
          />
          {value ? "Yes" : "No"}
        </label>
      );

    case "select":
      return (
        <select
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(event) => set(event.target.value || undefined)}
        >
          {(field.allowEmpty || value === undefined) && <option value="">(none)</option>}
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "multiselect": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const on = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  set(on ? selected.filter((s) => s !== option) : [...selected, option])
                }
                className={cn(
                  "rounded-pill border px-3 py-1 font-mono text-xs",
                  on
                    ? "border-normal bg-normal-soft text-normal-strong"
                    : "border-line text-ink-muted hover:text-ink",
                )}
                aria-pressed={on}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    case "stringList":
      return (
        <StringListInput
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={set}
        />
      );

    case "object":
      return (
        <div className="border-line space-y-4 rounded-card border p-4">
          {field.fields.map((child) => (
            <div key={child.name}>
              <FieldLabel field={child} />
              <FieldInput
                field={child}
                path={here}
                data={data}
                onChange={onChange}
                siblings={(value as Json) ?? {}}
              />
            </div>
          ))}
        </div>
      );

    case "objectList": {
      const items = Array.isArray(value) ? (value as Json[]) : [];
      return (
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={index}
              className="border-line rounded-card border"
              open={!item[field.titleKey]}
            >
              <summary className="text-ink flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm">
                <span className="truncate">
                  {String(item[field.titleKey] || `Item ${index + 1}`)}
                </span>
                <span className="text-ink-subtle ml-3 shrink-0 font-mono text-xs">
                  {index + 1}/{items.length}
                </span>
              </summary>
              <div className="border-line space-y-4 border-t p-4">
                {field.fields.map((child) => (
                  <div key={child.name}>
                    <FieldLabel field={child} />
                    <FieldInput
                      field={child}
                      path={[...here, index]}
                      data={data}
                      onChange={onChange}
                      siblings={item}
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => set(items.filter((_, i) => i !== index))}
                    className="border-line text-ink-subtle hover:text-alarm hover:border-alarm rounded-card border px-3 py-1.5 text-xs"
                  >
                    Remove
                  </button>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...items];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        set(next);
                      }}
                      className="border-line text-ink-muted hover:text-ink rounded-card border px-3 py-1.5 text-xs"
                    >
                      Move up
                    </button>
                  )}
                </div>
              </div>
            </details>
          ))}
          <button
            type="button"
            onClick={() => set([...items, blankRecord(field.fields)])}
            className="border-line text-ink-muted hover:text-ink rounded-card border border-dashed px-3 py-1.5 text-xs"
          >
            Add {field.label.toLowerCase()}
          </button>
        </div>
      );
    }
  }
}

export function CollectionEditor({
  collection,
  initialData,
  initialSha,
}: {
  collection: Collection;
  initialData: unknown;
  initialSha?: string;
}) {
  const [data, setData] = useState<unknown>(initialData);
  const [sha, setSha] = useState<string | undefined>(initialSha);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");

  const items = useMemo(
    () => (collection.kind === "list" && Array.isArray(data) ? (data as Json[]) : []),
    [collection.kind, data],
  );

  const onChange = useCallback((path: (string | number)[], value: unknown) => {
    setData((current: unknown) => setPath(current, path, value));
    setDirty(true);
  }, []);

  async function save() {
    setSaving(true);
    setErrors([]);
    setStatus(null);
    const response = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: collection.id, data, message, sha }),
    });
    const payload = (await response.json()) as {
      message?: string;
      errors?: string[];
      committed?: boolean;
      url?: string;
      sha?: string;
    };
    setSaving(false);

    if (!response.ok) {
      setErrors(payload.errors ?? []);
      setStatus(payload.message ?? "Save failed.");
      return;
    }

    setDirty(false);
    setMessage("");
    if (payload.sha) setSha(payload.sha);
    setStatus(
      payload.committed
        ? "Committed. The site rebuilds in about a minute."
        : "Saved to content/data/ on disk.",
    );
  }

  const record: Json =
    collection.kind === "list" ? (items[selected] ?? {}) : ((data as Json) ?? {});

  const rootPath: (string | number)[] = collection.kind === "list" ? [selected] : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {collection.kind === "list" && (
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  className={cn(
                    "w-full rounded-card px-3 py-2 text-left text-sm",
                    index === selected
                      ? "bg-surface text-ink border-line border"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  <span className="block truncate">
                    {String(item[collection.titleKey ?? "title"] || `Item ${index + 1}`)}
                  </span>
                  {collection.subtitleKey && (
                    <span className="text-ink-subtle mt-0.5 block truncate text-xs">
                      {String(item[collection.subtitleKey] ?? "")}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setData([...items, blankRecord(collection.fields)]);
                setSelected(items.length);
                setDirty(true);
              }}
              className="border-line text-ink-muted hover:text-ink rounded-card border border-dashed px-3 py-2 text-xs"
            >
              Add {collection.label.toLowerCase().replace(/s$/, "")}
            </button>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (!confirm("Delete this record? It is removed on save.")) return;
                  setData(items.filter((_, i) => i !== selected));
                  setSelected(Math.max(0, selected - 1));
                  setDirty(true);
                }}
                className="border-line text-ink-subtle hover:text-alarm hover:border-alarm rounded-card border px-3 py-2 text-xs"
              >
                Delete this record
              </button>
            )}
          </div>
        </aside>
      )}

      <div className="min-w-0 space-y-5">
        {collection.fields.map((field) => (
          <div key={field.name}>
            <FieldLabel field={field} />
            <FieldInput
              field={field}
              path={rootPath}
              data={data}
              onChange={onChange}
              siblings={record}
            />
          </div>
        ))}

        <div className="border-line bg-surface/60 rounded-card sticky bottom-4 space-y-3 border p-4 backdrop-blur">
          {errors.length > 0 && (
            <ul className="text-alarm space-y-1 text-xs">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
          {status && <p className="text-ink-muted text-xs">{status}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Commit message (optional)"
              className={cn(inputClass, "flex-1 min-w-[200px]")}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving || !dirty}
              className="rounded-card bg-normal text-normal-ink px-5 py-2 text-sm font-medium disabled:opacity-40"
            >
              {saving ? "Saving..." : dirty ? "Save" : "Saved"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
