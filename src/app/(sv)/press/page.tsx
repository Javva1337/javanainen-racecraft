import type { Metadata } from "next";
import Image from "next/image";
import { CONTACT_EMAIL, KWC, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Press — bilder, bio och faktablad",
  description:
    "Pressmaterial om Rickard Javanainen: nedladdningsbara högupplösta bilder, kort och lång bio på svenska och engelska samt faktablad inför hyrkart-VM 2026.",
  alternates: { canonical: "/press" },
};

const PRESS_IMAGES = [
  {
    src: "/press/rickard-javanainen-regnrace.jpg",
    label: "Regnrace (liggande)",
    filename: "rickard-javanainen-regnrace.jpg",
  },
  {
    src: "/press/rickard-javanainen-portratt.jpg",
    label: "Porträtt med pokal (stående)",
    filename: "rickard-javanainen-portratt.jpg",
  },
  {
    src: "/press/rickard-javanainen-podium.jpg",
    label: "Podium",
    filename: "rickard-javanainen-podium.jpg",
  },
];

const BIO_SHORT_SV =
  "Rickard Javanainen är en svensk hyrkartförare från Dalarna med VM-brons 2016 som främsta merit. Han tävlar för Sverige i Kart World Championship 2026 på Vandel Kart i Danmark, 22 juli–1 augusti, både individuellt och i Nations Cup.";

const BIO_LONG_SV =
  "Rickard Javanainen (född 1992) började köra gokart i Dalarna 2002, tio år gammal. Efter Racinggymnasiet i Mjölby, en andraplats totalt i Renault Junior Cup 2007, JTCC 2008–2010 och två segrar av sex möjliga som inhoppare i Ginetta G20 Cup 2011, tog hyrkarten över. 2015 vann han första upplagan av SRKC i Linköping och gjorde VM-debut i Italien med en 11:e plats av 127, och körde i Nations Cup en stint från sist till först innan laget gick i mål som femma totalt. 2016 vann han VM-finalen i Italien och tog brons totalt (3:e av 102). Ytterligare VM-finaler följde 2017 i Spanien (12:e av 172) och 2018 i Polen (14:e av 131, från 16:e till 9:e i finalracet), samt en andra SRKC-titel i Göteborg 2018. Efter en comeback med en 6:e plats totalt i SRKC 2021 (näst bästa svensk) och 3:e bästa svensk 2026 tävlar han nu i den 20:e upplagan av Kart World Championship på Vandel Kart i Danmark, 22 juli–1 augusti 2026, med 180 förare, i både KWC Individual och Nations Cup för Sverige. Satsningen möjliggörs av Labatus och Primab.";

const BIO_SHORT_EN =
  "Rickard Javanainen is a Swedish rental kart racer from Dalarna whose top achievement is a World Championship bronze in 2016. He races for Sweden at the 2026 Kart World Championship at Vandel Kart, Denmark, 22 July–1 August, both individually and in the Nations Cup.";

const BIO_LONG_EN =
  "Rickard Javanainen started karting in Dalarna, Sweden, in 2002 at the age of ten. After racing school in Mjölby, a runner-up season in the 2007 Renault Junior Cup, JTCC 2008–2010 and two wins from six races as a mid-season stand-in in the 2011 Ginetta G20 Cup, rental karting took over. In 2015 he won the inaugural SRKC in Linköping and made his Worlds debut in Italy, finishing 11th of 127, and in the Nations Cup drove a stint from last to first before the team finished fifth overall. In 2016 he won the World Championship final in Italy, taking bronze overall (3rd of 102). Further Worlds finals followed in Spain 2017 (12th of 172) and Poland 2018 (14th of 131, climbing from 16th to 9th in the final race), plus a second SRKC title in Gothenburg 2018. After a comeback with 6th overall in the 2021 SRKC (second-best Swede) and 3rd-best Swede in 2026, he now races the 20th edition of the Kart World Championship at Vandel Kart, Denmark, 22 July–1 August 2026, against a field of 180 drivers, in both the KWC Individual championship and the Nations Cup for Sweden. The campaign is made possible by Labatus and Primab.";

const FACTS = [
  ["Namn", "Rickard Javanainen"],
  ["Nationalitet", "Svensk (SWE)"],
  ["Uppvuxen i", "Dalarna"],
  ["Bästa VM-resultat", "3:e av 102 (Italien 2016, vinst i finalen)"],
  ["VM-starter", "5 (2015, 2016, 2017, 2018, 2026)"],
  ["SRKC-titlar", "2 (Linköping 2015, Göteborg 2018)"],
  ["Nästa tävling", `Kart World Championship 2026 · ${KWC.venue}, Danmark · ${KWC.datesLabel.sv}`],
  ["Tävlar i", "KWC Individual + Nations Cup (Sverige)"],
  ["Partners", "Labatus, Primab"],
  ["Kontakt", CONTACT_EMAIL],
  ["Webb", SITE_URL.replace("https://", "")],
];

export default function PressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Press</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Bilder i original, bio på svenska och engelska samt faktablad. Materialet får
          användas fritt i redaktionella sammanhang med fotobyline där sådan anges. Frågor:{" "}
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
                  alt={image.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-xs text-mist">{image.label}</span>
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
            Bio — svenska
          </h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Kort</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_SV}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Lång</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_SV}</p>
        </div>
        <div>
          <h2 className="heading-caps mb-4 text-2xl font-bold text-snow">Bio — English</h2>
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
