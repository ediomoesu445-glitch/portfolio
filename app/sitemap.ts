import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/lib/site";

/**
 * Every indexable route. /design is left out deliberately - it is noindex and
 * exists for reviewing the design system, not for readers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/research", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/experience", priority: 0.7 },
    { path: "/leadership", priority: 0.7 },
    { path: "/teaching", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
  ];

  return [
    ...pages.map((page) => ({
      url: `${siteConfig.url}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
