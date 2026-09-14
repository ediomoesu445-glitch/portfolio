import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { collectionById, type CollectionId } from "./collections";

/**
 * Where admin edits are read from and written to.
 *
 * Two backends, chosen by whether GITHUB_TOKEN is set:
 *
 * - **GitHub** (production). Content is committed to the repo, Vercel sees the
 *   push and redeploys. The panel reads from GitHub too, not from the bundled
 *   JSON, so it always shows current content rather than whatever the last
 *   build happened to contain. Edits are therefore visible in the panel
 *   immediately and on the live site once the rebuild lands.
 * - **Local files** (development). No token, no network, no commits - you edit
 *   content/data/*.json on disk and the dev server hot-reloads.
 *
 * Every write goes through git either way, so content changes keep the same
 * audit trail as code changes. That is the point of choosing a git-backed
 * panel over a database.
 */

const API = "https://api.github.com";

interface GitHubConfig {
  token: string;
  repo: string;
  branch: string;
}

function githubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

export function storeBackend(): "github" | "local" {
  return githubConfig() ? "github" : "local";
}

function pathFor(id: CollectionId): string {
  return `content/data/${collectionById[id].file}`;
}

async function githubRequest(
  config: GitHubConfig,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${API}/repos/${config.repo}/${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    // Content changes between requests by design, so caching would show the
    // editor a stale document and cause a lost update on the next save.
    cache: "no-store",
  });
}

interface FileState {
  data: unknown;
  /** The blob SHA, which GitHub requires to accept an update. */
  sha?: string;
}

export async function readCollection(id: CollectionId): Promise<FileState> {
  const config = githubConfig();
  const relative = pathFor(id);

  if (!config) {
    const raw = await readFile(join(process.cwd(), relative), "utf8");
    return { data: JSON.parse(raw) as unknown };
  }

  const response = await githubRequest(
    config,
    `contents/${relative}?ref=${encodeURIComponent(config.branch)}`,
  );
  if (!response.ok) {
    throw new Error(
      `Could not read ${relative} from GitHub (${response.status}). ` +
        "Check GITHUB_REPO, GITHUB_BRANCH and the token's Contents permission.",
    );
  }

  const payload = (await response.json()) as { content: string; sha: string };
  const decoded = Buffer.from(payload.content, "base64").toString("utf8");
  return { data: JSON.parse(decoded) as unknown, sha: payload.sha };
}

export async function writeCollection(
  id: CollectionId,
  data: unknown,
  message: string,
  sha?: string,
): Promise<{ committed: boolean; url?: string; sha?: string }> {
  const config = githubConfig();
  const relative = pathFor(id);
  // Trailing newline and two-space indent match what prettier writes, so an
  // admin edit does not show up as a whole-file reformat in the diff.
  const serialised = JSON.stringify(data, null, 2) + "\n";

  if (!config) {
    await writeFile(join(process.cwd(), relative), serialised, "utf8");
    return { committed: false };
  }

  // Re-read for the current SHA when the caller did not carry one. GitHub
  // rejects a blind update, which is what stops two sessions overwriting
  // each other.
  let blobSha = sha;
  if (!blobSha) {
    blobSha = (await readCollection(id)).sha;
  }

  const response = await githubRequest(config, `contents/${relative}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(serialised, "utf8").toString("base64"),
      sha: blobSha,
      branch: config.branch,
    }),
  });

  if (response.status === 409) {
    throw new Error(
      "That file changed since you opened it. Reload the page and redo the edit.",
    );
  }
  if (!response.ok) {
    const detail = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      `GitHub rejected the commit (${response.status}): ${detail.message ?? "unknown error"}`,
    );
  }

  const payload = (await response.json()) as {
    commit?: { html_url?: string };
    content?: { sha?: string };
  };
  // The new SHA lets the editor stay open and save again without a reload.
  return {
    committed: true,
    url: payload.commit?.html_url,
    sha: payload.content?.sha,
  };
}
