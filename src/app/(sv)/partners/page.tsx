import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KurbitsDivider } from "@/components/Kurbits";
import { Reveal } from "@/components/Reveal";
import { PARTNERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners — var med på vägen mot VM-titeln",
  description:
    "Labatus och Primab möjliggör VM-satsningen. Exponering på overall, digitala kanaler, takbox och hjälmlackering, plus dagliga VM-rapporter som mätbar sponsorleverans.",
  alternates: { canonical: "/partners" },
};

const PARTNER_INTROS: Record<string, string> = {
  Labatus: "Labatus är med sedan starten av satsningen, synliga i varje rapport, varje delningsbild och varje utskick.",
  Primab: "Primab stöttar vägen mot VM-titeln. Associering med dokumenterade resultat på VM-nivå.",
};

const PACKAGES = [
  {
    title: "Racingoverall",
    text: "Logotyp på overallen, synlig i varje foto och varje TV-bild från depå till prispall.",
  },
  {
    title: "Digitala kanaler",
    text: "Exponering på sajten, i nyhetsbrevet och i sociala kanaler. Varje race-rapport bär partnerlogotyperna.",
  },
  {
    title: "Takbox",
    text: "Takboxen på bilen som tar oss till och från tävlingarna. Rullande exponering genom hela Europa.",
  },
  {
    title: "Hjälmlackering",
    text: "Vill man slå på stort finns möjligheten att lacka om hjälmen, den mest personliga ytan inom motorsport.",
  },
];

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Partners</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Samarbeten byggda på synlighet, trovärdighet och gemensamt värde.
        </p>
      </header>

      {/* Nuvarande partners */}
      <section className="mb-20" aria-labelledby="partners-heading">
        <h2 id="partners-heading" className="sr-only">
          Nuvarande partners
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PARTNERS.map((partner, index) => (
            <Reveal key={partner.name} delayMs={index * 60}>
              <div className="flex h-full flex-col border border-line bg-midnight-800 p-8">
                <div
                  className={`mb-6 inline-flex w-fit items-center rounded-sm px-5 py-3 ${
                    partner.chip === "light" ? "bg-snow" : "border border-line"
                  }`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={150}
                    height={44}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <p className="mb-6 text-sm leading-relaxed text-mist">
                  {PARTNER_INTROS[partner.name]}
                </p>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="heading-caps mt-auto text-xs tracking-[0.14em] text-flagblue-bright transition-colors duration-200 hover:text-snow"
                >
                  {partner.url.replace("https://", "")} →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VM-rapporterna som sponsorleverans */}
      <section className="mb-20 border border-flagblue/40 bg-midnight-800 p-8" aria-labelledby="leverans-heading">
        <h2 id="leverans-heading" className="heading-caps mb-4 text-2xl font-bold text-snow">
          Dagliga VM-rapporter — mätbar exponering
        </h2>
        <div className="max-w-3xl space-y-4 leading-relaxed text-mist">
          <p>
            Under VM-veckan <strong className="text-snow">22 juli–1 augusti</strong> publiceras en
            race-rapport per dag här på sajten, med egen delningsbild där partnerlogotyperna
            ingår, distribuerad via nyhetsbrev, Instagram, Facebook och LinkedIn samma kväll.
          </p>
          <p>
            Partners syns i <strong className="text-snow">varje rapport, varje delningsbild och
            varje utskick</strong>, samma placering varje dag. Efter VM får varje partner en
            exponeringsrapport med faktiska siffror: visningar, klick och räckvidd per kanal.
          </p>
        </div>
      </section>

      <KurbitsDivider className="mb-20" />

      {/* Exponeringspaket */}
      <section className="mb-20" aria-labelledby="paket-heading">
        <h2 id="paket-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Exponering
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PACKAGES.map((pkg, index) => (
            <Reveal key={pkg.title} delayMs={index * 50}>
              <div className="h-full border border-line bg-midnight-800 p-6">
                <h3 className="heading-caps mb-2 text-lg text-snow">{pkg.title}</h3>
                <p className="text-sm leading-relaxed text-mist">{pkg.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border border-line bg-midnight-800 p-10 text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="heading-caps mb-3 text-2xl font-bold text-snow">
          Vill du synas här?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-mist">
          Bli en del av satsningen tillsammans med Labatus och Primab. Din logotyp, ditt
          varumärke, synligt vid varje tävling och i alla kanaler.
        </p>
        <Link href="/kontakt" className="btn btn-primary">
          Bli partner
        </Link>
      </section>
    </div>
  );
}
