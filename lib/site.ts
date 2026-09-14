import { profile } from "@/content/profile";

export const siteConfig = {
  name: profile.name,
  title: `${profile.name} - ${profile.headline}`,
  description:
    "Data scientist working on energy and regulatory analytics; AI/ML and backend engineer; educator; emerging leader; project manager. Based in Abuja, Nigeria.",
  /** Set NEXT_PUBLIC_SITE_URL in production for absolute OG/canonical URLs. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/images/og-default.png",
  locale: "en_NG",
} as const;

export const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Experience", href: "/experience" },
  { label: "Leadership", href: "/leadership" },
  { label: "Teaching", href: "/teaching" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
