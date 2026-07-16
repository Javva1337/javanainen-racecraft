import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KurbitsDivider } from "@/components/Kurbits";
import { Reveal } from "@/components/Reveal";
import { PARTNERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners — var med på vägen mot VM-titeln",
  description:
    "Primab och Labatus möjliggör VM-satsningen. Exponering på overall, digitala kanaler, takbox och hjälmlackering.",
  alternates: { canonical: "/partners" },
};

const PARTNER_INTROS: Record<string, string> = {
  Primab:
    "Primab har varit partner genom alla år av den här satsningen, från de första VM-åren till comebacken. Ett stöd vi är väldigt tacksamma för.",
  Labatus:
    "Labatus är ny partner för i år och med hela vägen mot VM 2026. Stort tack för förtroendet.",
};

const PACKAGES = [
  {
    title: "Racingoverall",
    text: "Logotyp på overallen, synlig i varje foto och varje TV-bild från depå till prispall.",
  },
  {
    title: "Digitala kanaler",
    text: "Exponering på sajten, i nyhetsbrevet och i sociala kanaler under hela satsningen.",
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
          Bli en del av satsningen tillsammans med Primab och Labatus. Din logotyp, ditt
          varumärke, synligt vid varje tävling och i alla kanaler.
        </p>
        <Link href="/kontakt" className="btn btn-primary">
          Bli partner
        </Link>
      </section>
    </div>
  );
}
