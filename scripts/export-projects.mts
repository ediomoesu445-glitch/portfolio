/**
 * Generates backend/data/projects.json from the typed content files.
 *
 * /content is the single source of truth for project copy. The FastAPI service
 * serves the same records, so this script keeps them in step instead of asking
 * anyone to edit two files by hand. Run it after editing content/projects.ts:
 *
 *     npm run sync:projects
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../content/projects.ts";

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, "..", "backend", "data", "projects.json");

writeFileSync(target, JSON.stringify(projects, null, 2) + "\n", "utf8");
console.log(`Wrote ${projects.length} projects to backend/data/projects.json`);
