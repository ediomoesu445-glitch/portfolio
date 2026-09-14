import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The style guide is an internal reference, not content.
      disallow: ["/design"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
