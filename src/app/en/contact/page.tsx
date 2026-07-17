import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Rickard Javanainen about partnerships, press or questions about the 2026 rental kart World Championship. Email: rickard@rickardjavanainen.se",
  alternates: {
    canonical: "/en/contact",
    languages: { "sv-SE": "/kontakt", en: "/en/contact", "x-default": "/kontakt" },
  },
  openGraph: { locale: "en_US" },
};

export default function EnglishContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Contact</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Partnerships, press or anything else? Get in touch — I answer personally.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
        <ContactForm lang="en" />
        <aside>
          <p className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Email</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-lg text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-6 text-sm leading-relaxed text-mist">
            Press material (original images, bio and fact sheet) is available on the{" "}
            <a href="/en/press" className="text-flagblue-bright underline underline-offset-4">
              press page
            </a>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
