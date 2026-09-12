import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-line/60 bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container-content flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="text-ink font-mono text-sm font-medium tracking-tight"
        >
          {profile.shortName}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-muted hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
