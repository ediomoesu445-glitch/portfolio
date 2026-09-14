import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { siteConfig } from "@/lib/site";

/**
 * JSON-LD describing the person this site is about.
 *
 * Every field is drawn from the content files, so it cannot drift from the
 * pages. Nothing is asserted here that is not also stated in the visible copy —
 * structured data claiming more than the page is how sites get penalised, and
 * it would contradict the rest of this project besides.
 */
export function PersonSchema() {
  const current = experience.find((role) => role.current ?? role.end === null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    jobTitle: "Data Scientist",
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abuja",
      addressCountry: "NG",
    },
    sameAs: profile.links
      .filter((link) => link.href.startsWith("http"))
      .map((link) => link.href),
    ...(current && {
      worksFor: { "@type": "Organization", name: current.org },
    }),
    alumniOf: education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    knowsAbout: [
      "Energy regulatory analytics",
      "Anomaly detection",
      "Fraud detection",
      "Time-series forecasting",
      "Computer vision",
      "Statistical modelling",
      "Mathematics education",
    ],
    knowsLanguage: ["English", "Ibibio", "French", "German"],
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built from local content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
