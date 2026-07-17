import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KurbitsDivider } from "@/components/Kurbits";
import { Reveal } from "@/components/Reveal";
import { PARTNERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners — join the road to the Worlds",
  description:
    "Primab and Labatus make the Worlds campaign possible. Exposure on the race suit, digital channels, the roof box and helmet livery.",
  alternates: {
    canonical: "/en/partners",
    languages: { "sv-SE": "/partners", en: "/en/partners", "x-default": "/partners" },
  },
  openGraph: { locale: "en_US" },
};

const PARTNER_INTROS: Record<string, string> = {
  Primab:
    "Primab has been a partner through every year of this campaign, from the first Worlds seasons to the comeback. Support we are very grateful for.",
  Labatus:
    "Labatus is a new partner this year, on board all the way to the 2026 Worlds. Thank you for the trust.",
};

const PACKAGES = [
  {
    title: "Race suit",
    text: "Your logo on the race suit, visible in every photo and every TV frame, from the paddock to the podium.",
  },
  {
    title: "Digital channels",
    text: "Exposure on the site, in the newsletter and on social channels throughout the campaign.",
  },
  {
    title: "Roof box",
    text: "The roof box on the car that takes us to and from the races. Rolling exposure across Europe.",
  },
  {
    title: "Helmet livery",
    text: "For those who want to go all in, there is the option of a custom helmet livery — the most personal surface in motorsport.",
  },
];

export default function EnglishPartnersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Partners</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Partnerships built on visibility, credibility and shared value.
        </p>
      </header>

      {/* Current partners */}
      <section className="mb-20" aria-labelledby="partners-heading">
        <h2 id="partners-heading" className="sr-only">
          Current partners
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

      {/* Exposure */}
      <section className="mb-20" aria-labelledby="packages-heading">
        <h2 id="packages-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Exposure
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
          Want to be seen here?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-mist">
          Join the campaign alongside Primab and Labatus. Your logo, your brand, visible at every
          race and in every channel.
        </p>
        <Link href="/en/contact" className="btn btn-primary">
          Become a partner
        </Link>
      </section>
    </div>
  );
}
