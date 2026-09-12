"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A nav item is active on its own route and on anything nested under it. */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile panel and returns focus to the control that
  // opened it, so keyboard users are never left adrift.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-line bg-bg/90 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="max-w-content mx-auto flex h-16 w-full items-center justify-between gap-6 px-5 md:px-8">
        <Link
          href="/"
          className="text-ink font-mono text-sm font-medium tracking-tight"
          aria-label={`${profile.shortName} — home`}
        >
          {profile.shortName}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "interactive rounded-card relative px-3 py-2 text-sm",
                      active ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                    {/* The active marker is a rule, not a colour fill — the
                        accents are reserved for figures. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-px",
                        active ? "bg-normal" : "bg-transparent",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="interactive rounded-card border-line text-ink-muted hover:text-ink inline-flex size-9 items-center justify-center border lg:hidden"
          >
            {open ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation. Kept in the DOM and hidden with `hidden` so the
          aria-controls relationship stays valid. */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-line bg-bg border-t lg:hidden"
      >
        <nav aria-label="Primary, mobile">
          <ul className="max-w-content mx-auto w-full px-5 py-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "border-line flex items-center justify-between border-b py-3 text-base last:border-0",
                      active ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span aria-hidden className="rounded-pill bg-normal size-1.5" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
