/**
 * Copies content/data/projects.json to backend/data/projects.json.
 *
 * /content is the single source of truth for project copy. The FastAPI service
 * serves the same records, so this script keeps them in step instead of asking
 * anyone to edit two files by hand. Run it after editing projects:
 *
 *     npm run sync:projects
 *
 * It reads the JSON rather than importing content/projects.ts, because that
 * module now imports JSON itself and Node's ESM loader requires an explicit
 * `with { type: "json" }` attribute that the bundler does not need. Reading the
 * file directly sidesteps the mismatch and is one less layer besides.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "..", "content", "data", "projects.json");
const target = join(here, "..", "backend", "data", "projects.json");

const raw = readFileSync(source, "utf8");

// Parse before writing: a malformed file should fail here rather than ship a
// broken payload to the service.
const projects = JSON.parse(raw) as unknown[];
if (!Array.isArray(projects)) {
  throw new Error("content/data/projects.json must contain an array");
}

writeFileSync(target, JSON.stringify(projects, null, 2) + "\n", "utf8");
console.log(`Wrote ${projects.length} projects to backend/data/projects.json`);
