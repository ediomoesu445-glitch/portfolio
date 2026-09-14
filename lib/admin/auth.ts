/**
 * Single-user authentication for the admin panel.
 *
 * Built on Web Crypto rather than node:crypto so the same code runs in
 * middleware, which may execute on the Edge runtime, and in route handlers.
 * No dependencies are added for this.
 *
 * The password is never stored. ADMIN_PASSWORD_HASH holds a PBKDF2 digest in
 * the form `iterations:saltHex:hashHex`; generate one with:
 *
 *     node scripts/hash-password.mjs "your password"
 *
 * The session is a signed token, not an encrypted one: it carries only an
 * expiry, so there is nothing in it worth hiding. The signature is what makes
 * it unforgeable, and ADMIN_SESSION_SECRET is what makes the signature
 * unforgeable. Rotating that secret logs the session out.
 */

const encoder = new TextEncoder();

/** Eight hours. Long enough for an editing session, short enough to matter. */
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export const SESSION_COOKIE = "admin_session";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
}

/**
 * Compares two strings in time independent of where they first differ.
 *
 * A plain `===` leaks the length of the matching prefix through timing, which
 * over enough attempts is enough to recover a signature.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function hashPassword(
  password: string,
  saltHex?: string,
  iterations = 210_000,
): Promise<string> {
  const salt = saltHex
    ? fromHex(saltHex)
    : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    256,
  );
  return `${iterations}:${toHex(salt.buffer as ArrayBuffer)}:${toHex(bits)}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 3) return false;
  const [iterationsRaw, saltHex] = parts;
  const iterations = Number.parseInt(iterationsRaw, 10);
  if (!Number.isFinite(iterations) || iterations < 1000) return false;

  const candidate = await hashPassword(password, saltHex, iterations);
  return timingSafeEqual(candidate, stored);
}

async function signingKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function createSession(secret: string): Promise<string> {
  const payload = JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const body = base64UrlEncode(payload);
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(secret),
    encoder.encode(body),
  );
  return `${body}.${toHex(signature)}`;
}

/** True only for a token this server signed that has not yet expired. */
export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  const expected = await crypto.subtle.sign(
    "HMAC",
    await signingKey(secret),
    encoder.encode(body),
  );
  if (!timingSafeEqual(toHex(expected), signature)) return false;

  try {
    const { exp } = JSON.parse(base64UrlDecode(body)) as { exp?: number };
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

/**
 * Whether the panel is usable at all.
 *
 * Both secrets must be present. If either is missing the panel refuses to
 * authenticate anyone rather than falling back to an open door - a misconfigured
 * deploy should lock you out, not let everyone in.
 */
export function adminConfig(): { hash: string; secret: string } | null {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!hash || !secret || secret.length < 16) return null;
  return { hash, secret };
}
