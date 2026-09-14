import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, adminConfig, verifySession } from "@/lib/admin/auth";

/**
 * Gate on the admin panel.
 *
 * Named `proxy` in `proxy.ts`: Next 16 deprecated the `middleware` convention
 * in favour of this one. Behaviour is the same.
 *
 * Every /admin page and every /api/admin endpoint requires a valid session,
 * with the login route itself as the only exception. The check runs here
 * rather than in each page so a new admin route is protected by existing
 * rather than by someone remembering to guard it.
 *
 * If the panel is not configured, /admin returns 404 rather than a login form.
 * An unconfigured deploy should look like it has no admin at all.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginApi) return NextResponse.next();

  const config = adminConfig();
  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  const authenticated = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
    config.secret,
  );

  if (isLoginPage) {
    if (authenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (authenticated) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const login = new URL("/admin/login", request.url);
  // Carry where they were headed so the login can return them to it.
  if (pathname !== "/admin") login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
