import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminConfig,
  createSession,
  verifyPassword,
} from "@/lib/admin/auth";

/**
 * Exchanges the admin password for a session cookie.
 *
 * Failures are deliberately slow and vague: one message for every rejection,
 * and a fixed delay so a wrong password costs the same whether the panel is
 * configured or not. There is one account, so there is no username to
 * enumerate; the only thing worth protecting is the password itself.
 */
export async function POST(request: Request) {
  const config = adminConfig();
  const body = (await request.json().catch(() => ({}))) as { password?: string };

  // Same floor on every path, so timing says nothing about which check failed.
  const settled = new Promise((resolve) => setTimeout(resolve, 400));

  const ok =
    config !== null &&
    typeof body.password === "string" &&
    body.password.length > 0 &&
    (await verifyPassword(body.password, config.hash));

  await settled;

  if (!ok || !config) {
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSession(config.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
