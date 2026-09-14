import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The style guide is an internal reference, not content. The admin
      // panel is gated, but a login page in a search index still advertises
      // that there is something here worth attacking.
      disallow: ["/design", "/admin", "/api/admin"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
