import type { Metadata } from "next";
import Image from "next/image";
import { KurbitsDivider } from "@/components/Kurbits";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Om Rickard — från Dalarna till världstoppen",
  description:
    "Berättelsen i kapitel: gokart i Dalarna vid 10 års ålder, Racinggymnasiet i Mjölby, banracing i Ginetta, och vägen till VM-brons i hyrkart och comebacken mot Vandel 2026.",
  alternates: {
    canonical: "/om",
    languages: { "sv-SE": "/om", en: "/en/about", "x-default": "/om" },
  },
};

/** Storyn i kapitelform (à la Leclerc). Text baserad på legacy-copy + kanoniska fakta. */
const CHAPTERS = [
  {
    label: "Dalarna",
    title: "10-åringen och gokarten",
    text: [
      "Uppvuxen i Dalarna. 2002, tio år gammal, tog jag det första steget in i motorsporten: gokart. De följande åren gick genom flera gokartklasser, med flera segrar och pallplatser på vägen.",
    ],
  },
  {
    label: "Mjölby",
    title: "Racinggymnasiet",
    text: [
      "Racinggymnasiet i Mjölby blev nästa steg. 2007 slutade jag 2:a totalt i Renault Junior Cup, och 2008–2010 körde jag JTCC (Junior Touring Car Championship) med flera pallplatser.",
      "Det var också under de här åren som hyrkarten tog över på allvar. Hyrkart är racing där alla kör likvärdiga kartar som arrangören ställer upp med, så bara föraren avgör. Det som började som träning mellan racehelgerna visade sig vara racing i sin renaste form.",
    ],
  },
  {
    label: "Banracing",
    title: "Ginetta — inhopparen som vann",
    text: [
      "2011 fick jag ett inhopp mitt i säsongen i Ginetta G20 Cup. Resultatet: vinst i 2 av 6 race och 8:e plats totalt av 22 förare, med bara hälften av racen körda.",
    ],
  },
  {
    label: "Hyrkart",
    title: "Den renaste formen av racing",
    text: [
      "I hyrkart är materialet utjämnat och kartarna lottas. Ingen budget i världen gör dig snabbare. Det är föraren som räknas. 2015 vann jag första upplagan av SRKC i Linköping, den svenska serien som också är uttagning till VM, och samma år kom VM-debuten i Italien: 11:e plats av 127 individuellt, en pallplats i semifinalen och en plats i finalen. I Nations Cup, lagtävlingen där man kör för sitt land i stafett, körde jag min del av racet från sist till först innan laget gick i mål som femma totalt.",
      "2016 i Italien vann jag finalracet. VM avgörs på sammanlagda poäng från hela veckan, så det räckte till 3:e plats totalt: VM-brons. 2017 i Spanien blev det 12:e av 172, det största startfältet hittills. 2018 vann jag SRKC i Göteborg efter en jämn final mot Max Sjölander, och i VM i Polen samma år gick jag från 16:e till 9:e i finalracet, 14:e av 131 totalt.",
    ],
  },
  {
    label: "Comebacken",
    title: "Tillbaka på allvar",
    text: [
      "Efter VM i Polen 2018 tog livet över på det finaste sättet: 2020 föddes vår första son, och 2024 kom hans lillebror. Däremellan satte pandemin stopp för det mesta av tävlandet, så det dröjde några år innan jag var tillbaka på riktigt. Men suget försvann aldrig.",
      "2021 tog jag 6:e platsen totalt i SRKC-finalen, näst bäst av svenskarna, och 2026 blev jag 3:e bästa svensk. SRKC, kvalet till hyrkart-VM, har tagit in mig i sin Hall of Fame, seriens hedersgalleri, hittills som den enda förare som valts in. Ett fint kvitto på åren som gått. Nu känner jag mig redo att ta upp jakten på VM-titeln igen. I Danmark är det formen här och nu som avgör.",
    ],
  },
  {
    label: "Vandel",
    title: "VM 2026",
    text: [
      "Nu väntar hyrkart-VM på Vandel Kart i Danmark, 22 juli–1 augusti 2026. Jag kör både KWC Individual och Nations Cup för Sverige, och rapporterar varje kväll här på sajten.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Om Rickard</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Från första gokarten i Dalarna till jakten på VM-titeln. Berättelsen i sex kapitel.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr]">
        {/* Pokalbilden */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              <Image
                src="/images/portrait.jpg"
                alt="Rickard Javanainen med pokal"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </Reveal>
        </div>

        {/* Kapitlen */}
        <div className="space-y-12">
          {CHAPTERS.map((chapter, index) => (
            <Reveal key={chapter.label}>
              <section aria-labelledby={`kapitel-${index + 1}`}>
                <p className="heading-caps tabular mb-1 text-xs tracking-[0.16em] text-flagblue-bright">
                  Kapitel {String(index + 1).padStart(2, "0")} — {chapter.label}
                </p>
                <h2 id={`kapitel-${index + 1}`} className="heading-caps mb-3 text-2xl text-snow">
                  {chapter.title}
                </h2>
                {chapter.text.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mb-3 leading-relaxed text-mist">
                    {paragraph}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}

          <KurbitsDivider />

          {/* Citat som avslutning */}
          <Reveal>
            <blockquote className="border-l-2 border-flagyellow pl-6">
              <p className="heading-caps text-xl leading-relaxed text-snow sm:text-2xl">
                "Med samma material för alla finns ingenstans att gömma sig. Det är föraren som
                räknas, varje heat, hela veckan."
              </p>
              <cite className="mt-3 block text-sm not-italic text-mist-dim">
                Rickard Javanainen
              </cite>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
