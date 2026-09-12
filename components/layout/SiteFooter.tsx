import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Heading";
import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-line border-t">
      <div className="max-w-content mx-auto w-full px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <p className="font-display text-subtitle text-ink font-semibold">
              {profile.name}
            </p>
            <p className="text-ink-muted mt-2 max-w-sm text-sm leading-relaxed">
              {profile.location} · {profile.availability}
            </p>

            <ul className="mt-6 flex flex-wrap items-center gap-5">
              {profile.links
                .filter((link) => link.primary)
                .map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="interactive text-ink-muted hover:text-ink inline-flex items-center gap-2 text-sm"
                    >
                      <Icon name={link.icon} className="size-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <Overline>Pages</Overline>
            <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="interactive text-ink-muted hover:text-ink text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="border-line text-ink-subtle mt-12 border-t pt-6 font-mono text-[11px]">
          Built with Next.js and a FastAPI service. Every figure on this site is
          transcribed from a committed result file.
        </p>
      </div>
    </footer>
  );
}
