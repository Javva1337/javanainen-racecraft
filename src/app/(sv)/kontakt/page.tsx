import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakta Rickard Javanainen om partnerskap, press eller frågor om hyrkart-VM 2026. Mejl: rickard@rickardjavanainen.se",
  alternates: {
    canonical: "/kontakt",
    languages: { "sv-SE": "/kontakt", en: "/en/contact", "x-default": "/kontakt" },
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Kontakt</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Partnerskap, press eller något annat? Hör av dig, jag svarar personligen.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
        <ContactForm lang="sv" />
        <aside>
          <p className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">E-post</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-lg text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-6 text-sm leading-relaxed text-mist">
            Pressmaterial (bilder i original, bio och faktablad) finns på{" "}
            <a href="/press" className="text-flagblue-bright underline underline-offset-4">
              press-sidan
            </a>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
