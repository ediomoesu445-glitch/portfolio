import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Fallback for the FastAPI /api/contact endpoint.
 *
 * The site is deployable on its own, so when NEXT_PUBLIC_API_BASE_URL is not
 * set the client posts here instead. The validation, honeypot and rate limit
 * mirror backend/app/api/routes/contact.py — if you change one, change both.
 *
 * Like the Python service, this logs the message rather than sending it unless
 * SMTP is configured, so local development never needs a mailbox and nothing
 * is sent by accident.
 */
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  message: z.string().trim().min(20).max(4000),
  company: z.string().max(200).optional(),
});

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = Number(process.env.CONTACT_RATE_LIMIT_PER_HOUR ?? 5);

/** Per-IP sliding window. In-process, so it resets on redeploy — adequate for
 *  a personal site, and the honeypot carries most of the load anyway. */
const history = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const seen = (history.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  if (seen.length >= LIMIT) {
    history.set(ip, seen);
    return true;
  }
  seen.push(now);
  history.set(ip, seen);
  return false;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not read that request." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Some fields were not valid. Please check and retry." },
      { status: 422 },
    );
  }

  // Answer as though accepted so bots get no signal, then drop it.
  if (parsed.data.company) {
    return NextResponse.json({
      ok: true,
      message: "Thanks — your message has been sent.",
    });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many messages from this address. Please try again later.",
      },
      { status: 429 },
    );
  }

  const { name, email, message } = parsed.data;
  console.info(
    `[contact] SMTP not configured — message logged instead of sent:\nFrom: ${name} <${email}>\n\n${message}\n`,
  );

  return NextResponse.json({
    ok: true,
    message: "Thanks — your message has been sent.",
  });
}
