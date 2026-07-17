import type { Metadata } from "next";
import Image from "next/image";
import { BIO_LONG_EN, BIO_LONG_SV, BIO_SHORT_EN, BIO_SHORT_SV, PRESS_IMAGES } from "@/lib/press";
import { CONTACT_EMAIL, KWC, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Press — images, bio and fact sheet",
  description:
    "Press material for Rickard Javanainen: downloadable high-resolution images, short and long bios in English and Swedish, and a fact sheet for the 2026 Kart World Championship.",
  alternates: {
    canonical: "/en/press",
    languages: { "sv-SE": "/press", en: "/en/press", "x-default": "/press" },
  },
  openGraph: { locale: "en_US" },
};

const FACTS = [
  ["Name", "Rickard Javanainen"],
  ["Nationality", "Swedish (SWE)"],
  ["Grew up in", "Dalarna"],
  ["Best Worlds result", "3rd of 102 (Italy 2016, won the final)"],
  ["Worlds starts", "5 (2015, 2016, 2017, 2018, 2026)"],
  ["SRKC titles", "2 (Linköping 2015, Gothenburg 2018)"],
  ["Next event", `Kart World Championship 2026 · ${KWC.venue}, Denmark · ${KWC.datesLabel.en}`],
  ["Competing in", "KWC Individual + Nations Cup (Sweden)"],
  ["Partners", "Primab (since the start of the campaign), Labatus (new for 2026)"],
  ["Contact", CONTACT_EMAIL],
  ["Web", SITE_URL.replace("https://", "")],
];

export default function EnglishPressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Press</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Original images, bios in English and Swedish, and a fact sheet. The material may be used
          freely in editorial contexts, with photo credit where stated. Questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-flagblue-bright underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      </header>

      {/* Press images */}
      <section className="mb-16" aria-labelledby="images-heading">
        <h2 id="images-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Press images
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRESS_IMAGES.map((image) => (
            <figure key={image.src} className="border border-line bg-midnight-800">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.label.en}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-xs text-mist">{image.label.en}</span>
                <a
                  href={image.src}
                  download={image.filename}
                  className="heading-caps shrink-0 text-[0.65rem] tracking-[0.12em] text-flagblue-bright transition-colors duration-200 hover:text-snow"
                >
                  Download ↓
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
            Bio — English
          </h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Short</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_EN}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Long</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_EN}</p>
        </div>
        <div>
          <h2 className="heading-caps mb-4 text-2xl font-bold text-snow">Bio — Swedish</h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Short</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_SV}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Long</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_SV}</p>
        </div>
      </section>

      {/* Fact sheet */}
      <section aria-labelledby="facts-heading">
        <h2 id="facts-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Fact sheet
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
