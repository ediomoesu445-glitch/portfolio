import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-line/60 border-t py-12">
      <div className="container-content text-ink-muted flex flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-ink">{profile.name}</p>
          <p className="mt-1">
            {profile.location} · {profile.availability}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-5">
          {profile.links
            .filter((link) => link.primary)
            .map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="hover:text-ink inline-flex items-center gap-2 transition-colors"
                >
                  <Icon name={link.icon} className="size-4" />
                  {link.label}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </footer>
  );
}
