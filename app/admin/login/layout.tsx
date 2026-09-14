import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign in",
  // The panel is gated, but a login page in a search index still advertises
  // that there is something here to attack.
  robots: { index: false, follow: false },
};

/**
 * The login page deliberately sits outside the (panel) route group, so it does
 * not inherit the admin shell - a sign-out button on a sign-in screen would be
 * nonsense.
 */
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="max-w-content mx-auto w-full flex-1 px-5 py-10 md:px-8">
      {children}
    </main>
  );
}
