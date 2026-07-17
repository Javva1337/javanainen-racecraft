import type { Metadata } from "next";
import Image from "next/image";
import { BIO_LONG_EN, BIO_LONG_SV, BIO_SHORT_EN, BIO_SHORT_SV, PRESS_IMAGES } from "@/lib/press";
import { CONTACT_EMAIL, KWC, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Press — bilder, biografi och faktablad",
  description:
    "Pressmaterial om Rickard Javanainen: nedladdningsbara högupplösta bilder, kort och lång biografi på svenska och engelska samt faktablad inför hyrkart-VM 2026.",
  alternates: {
    canonical: "/press",
    languages: { "sv-SE": "/press", en: "/en/press", "x-default": "/press" },
  },
};

const FACTS = [
  ["Namn", "Rickard Javanainen"],
  ["Nationalitet", "Svensk (SWE)"],
  ["Uppvuxen i", "Dalarna"],
  ["Bästa VM-resultat", "3:e av 102 (Italien 2016, vinst i finalen)"],
  ["VM-starter", "4 genomförda (2015, 2016, 2017, 2018) · uttagen till VM 2026"],
  ["SRKC-titlar", "2 (Linköping 2015, Göteborg 2018)"],
  ["Nästa tävling", `Kart World Championship 2026 · ${KWC.venue}, Danmark · ${KWC.datesLabel.sv}`],
  ["Tävlar i", "KWC Individual + Nations Cup (Sverige)"],
  ["Partners", "Primab (sedan starten av satsningen), Labatus (ny 2026)"],
  ["Kontakt", CONTACT_EMAIL],
  ["Webb", SITE_URL.replace("https://", "")],
];

export default function PressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Press</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Här finns pressbilder i originalformat, biografi på svenska och engelska samt
          faktablad. Materialet får användas fritt i redaktionella sammanhang. Ange fotograf
          när fotobyline finns. Vid frågor, mejla{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-flagblue-bright underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      </header>

      {/* Pressbilder */}
      <section className="mb-16" aria-labelledby="bilder-heading">
        <h2 id="bilder-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Pressbilder
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRESS_IMAGES.map((image) => (
            <figure key={image.src} className="border border-line bg-midnight-800">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.label.sv}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-xs text-mist">{image.label.sv}</span>
                <a
                  href={image.src}
                  download={image.filename}
                  className="heading-caps shrink-0 text-[0.65rem] tracking-[0.12em] text-flagblue-bright transition-colors duration-200 hover:text-snow"
                >
                  Ladda ner ↓
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Bio */}
      <section className="mb-16 grid gap-10 lg:grid-cols-2" aria-labelledby="bio-heading">
        <div>
          <h2 id="bio-heading" className="heading-caps mb-4 text-2xl font-bold text-snow">
            Biografi — svenska
          </h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Kort</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_SV}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Lång</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_SV}</p>
        </div>
        <div>
          <h2 className="heading-caps mb-4 text-2xl font-bold text-snow">Biografi — engelska</h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Short</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_EN}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Long</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_EN}</p>
        </div>
      </section>

      {/* Faktablad */}
      <section aria-labelledby="fakta-heading">
        <h2 id="fakta-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Faktablad
        </h2>
        <dl className="divide-y divide-line border border-line">
          {FACTS.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 bg-midnight-800 px-5 py-3 sm:flex-row sm:gap-8">
              <dt className="heading-caps w-44 shrink-0 text-xs tracking-[0.12em] text-mist-dim sm:pt-0.5">
                {label}
              </dt>
              <dd className="tabular text-sm text-snow">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
