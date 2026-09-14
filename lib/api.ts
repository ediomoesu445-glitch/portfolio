import { projects as localProjects } from "@/content/projects";
import type { Project } from "@/content/types";

/**
 * Client for the FastAPI service in /backend.
 *
 * The site must render with the backend down - it is a portfolio, not a
 * dashboard - so every call falls back to the typed content files and logs the
 * failure rather than throwing. Set NEXT_PUBLIC_API_BASE_URL to enable it.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export const isBackendConfigured = API_BASE.length > 0;

async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!response.ok) {
    throw new Error(`${path} responded ${response.status}`);
  }
  return (await response.json()) as T;
}

/** Projects from the API when configured, otherwise from /content. */
export async function fetchProjects(): Promise<Project[]> {
  if (!isBackendConfigured) return localProjects;
  try {
    return await getJson<Project[]>("/api/projects", {
      next: { revalidate: 300 },
    });
  } catch (error) {
    console.warn("[api] falling back to local project content:", error);
    return localProjects;
  }
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot field - must stay empty for a submission to be accepted. */
  company?: string;
}

export interface ContactResult {
  ok: boolean;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  const endpoint = isBackendConfigured ? `${API_BASE}/api/contact` : "/api/contact";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as Partial<ContactResult>;
  return {
    ok: response.ok,
    message:
      data.message ??
      (response.ok
        ? "Message sent."
        : "Something went wrong. Please email me directly."),
  };
}

export interface ScoreSignal {
  name: string;
  label: string;
  triggered: boolean;
  weight: number;
  detail: string;
}

export interface ScoreResult {
  score: number;
  band: "low" | "elevated" | "high";
  signals: ScoreSignal[];
  excluded: ScoreSignal[];
  rule_version: string;
  note: string;
  latency_ms: number;
}

export interface TransactionInput {
  amount: number;
  oldBalanceOrig: number;
  newBalanceOrig: number;
  oldBalanceDest: number;
  newBalanceDest: number;
  type: string;
}

/**
 * Scores one transaction with the explainable rule tier.
 *
 * Posts to the FastAPI service when NEXT_PUBLIC_API_BASE_URL is set, and to
 * the Next route handler otherwise. Both run the same rules; neither serves
 * the trained model.
 */
export async function scoreTransaction(
  input: TransactionInput,
): Promise<{ ok: true; data: ScoreResult } | { ok: false; message: string }> {
  const endpoint = isBackendConfigured
    ? `${API_BASE}/api/ml/predict`
    : "/api/ml/predict";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const detail = (await response.json().catch(() => ({}))) as {
        detail?: string;
      };
      return {
        ok: false,
        message: detail.detail ?? "The scorer rejected that input.",
      };
    }
    return { ok: true, data: (await response.json()) as ScoreResult };
  } catch {
    return { ok: false, message: "Could not reach the scorer. Is it running?" };
  }
}
