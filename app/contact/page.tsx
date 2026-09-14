import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { profile } from "@/content/profile";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name} — ${profile.location}, open to remote roles and relocation.`,
};

export default function ContactPage() {
  return (
    <Section
      divided={false}
      eyebrow="Contact"
      title="Get in touch"
      description="Open to remote roles and relocation. If you would rather not use the form, every direct route is listed beside it."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-line border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <Overline>Direct</Overline>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="interactive text-ink-muted hover:text-ink inline-flex items-center gap-2.5 text-sm"
                >
                  <Icon name="Mail" className="size-4" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="interactive text-ink-muted hover:text-ink inline-flex items-center gap-2.5 text-sm"
                >
                  <Icon name="Phone" className="size-4" />
                  {profile.phone}
                </a>
              </li>
              {profile.links
                .filter((link) => link.href.startsWith("http"))
                .map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive text-ink-muted hover:text-ink inline-flex items-center gap-2.5 text-sm"
                    >
                      <Icon name={link.icon} className="size-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>

            {profile.resumeUrl && (
              <div className="border-line mt-8 border-t pt-6">
                <Overline>CV</Overline>
                <ButtonLink
                  href={profile.resumeUrl}
                  variant="outline"
                  size="sm"
                  download
                  className="mt-3"
                >
                  <Icon name="Download" className="size-4" />
                  Download CV (PDF)
                </ButtonLink>
              </div>
            )}

            <div className="border-line mt-8 border-t pt-6">
              <Overline>Location</Overline>
              <p className="text-ink-muted mt-2 flex items-center gap-2.5 text-sm">
                <Icon name="MapPin" className="size-4" />
                {profile.location}
              </p>
              <p className="text-ink-subtle mt-2 text-sm">{profile.availability}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
