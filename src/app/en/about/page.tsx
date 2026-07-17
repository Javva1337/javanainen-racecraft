import type { Metadata } from "next";
import Image from "next/image";
import { KurbitsDivider } from "@/components/Kurbits";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Rickard — from Dalarna to the world stage",
  description:
    "The story in chapters: karting in Dalarna at the age of ten, racing school in Mjölby, circuit racing in Ginetta, a Worlds bronze in rental karting and the comeback aiming for Vandel 2026.",
  alternates: {
    canonical: "/en/about",
    languages: { "sv-SE": "/om", en: "/en/about", "x-default": "/om" },
  },
  openGraph: { locale: "en_US" },
};

/** Samma kapitelstruktur som svenska /om — copy fritt formulerad på engelska. */
const CHAPTERS = [
  {
    label: "Dalarna",
    title: "The ten-year-old and the go-kart",
    text: [
      "I grew up in Dalarna. In 2002, ten years old, I took my first step into motorsport: karting. The years that followed went through several karting classes, with a number of wins and podiums along the way.",
    ],
  },
  {
    label: "Mjölby",
    title: "Racing school",
    text: [
      "The racing school in Mjölby came next. In 2007 I finished 2nd overall in the Renault Junior Cup, and from 2008 to 2010 I raced in the JTCC (Junior Touring Car Championship) with several podiums.",
      "It was also during these years that rental karting took over for real. What started as practice between race weekends turned out to be racing in its purest form.",
    ],
  },
  {
    label: "Circuit racing",
    title: "Ginetta — the stand-in who won",
    text: [
      "In 2011 I got a mid-season drive in the Ginetta G20 Cup. The result: wins in 2 of 6 races and 8th overall of 22 drivers, having raced only half the season.",
    ],
  },
  {
    label: "Rental karting",
    title: "The purest form of racing",
    text: [
      "In rental karting the equipment is equalised and the karts are drawn by lot. No budget in the world makes you faster — only the driver counts. In 2015 I won the inaugural SRKC in Linköping, and the same year came my Worlds debut in Italy: 11th of 127 individually, a semifinal podium, and a place in the final. In the Nations Cup I drove a stint from last to first before the team finished fifth overall.",
      "2016 in Italy: a win in the final and 3rd place overall — a Worlds bronze. 2017 in Spain: 12th of 172, the biggest field to date. In 2018 I won the SRKC in Gothenburg after a close final against Max Sjölander, and at the Worlds in Poland that year I went from 16th to 9th in the final race, 14th of 131 overall.",
    ],
  },
  {
    label: "The comeback",
    title: "Back for real",
    text: [
      "After the Worlds in Poland 2018, life took over in the best possible way: our first son was born in 2020, and his little brother arrived in 2024. In between, the pandemic put a stop to most of the racing, so it took a few years before I was properly back. But the itch never went away.",
      "In 2021 I finished 6th overall in the SRKC final, second-best Swede, and in 2026 I was the 3rd-best Swede. The SRKC, the qualifier for the rental kart Worlds, has inducted me into its Hall of Fame, so far as the only driver. A fine receipt for the years gone by. Now I feel ready to pick up the dream of the world title again, and what counts is the form in Denmark.",
    ],
  },
  {
    label: "Vandel",
    title: "Worlds 2026",
    text: [
      "Next up is the rental kart World Championship at Vandel Kart in Denmark, 22 July–1 August 2026. I race both the KWC Individual championship and the Nations Cup for Sweden, and I report here on the site every evening.",
    ],
  },
];

export default function EnglishAboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">
          About Rickard
        </h1>
        <p className="mt-3 max-w-2xl text-mist">
          From Dalarna to the world stage. The story in six chapters.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr]">
        {/* Pokalbilden */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              <Image
                src="/images/portrait.jpg"
                alt="Rickard Javanainen with a trophy"
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
              <section aria-labelledby={`chapter-${index + 1}`}>
                <p className="heading-caps tabular mb-1 text-xs tracking-[0.16em] text-flagblue-bright">
                  Chapter {String(index + 1).padStart(2, "0")} — {chapter.label}
                </p>
                <h2 id={`chapter-${index + 1}`} className="heading-caps mb-3 text-2xl text-snow">
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
                "With the same equipment for everyone, there is nowhere to hide. It's the driver
                that counts — every heat, all week."
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
