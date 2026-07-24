import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CurrentCompetition } from "@/components/CurrentCompetition";
import { Hero } from "@/components/Hero";
import { KurbitsDivider } from "@/components/Kurbits";
import { Reveal } from "@/components/Reveal";
import { TrackLayoutsTeaser } from "@/components/TrackLayoutsTeaser";
import { getAllArticles } from "@/lib/content";
import { getSiteMode } from "@/lib/mode";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, PARTNERS } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE.sv },
  description: DEFAULT_DESCRIPTION.sv,
  alternates: {
    canonical: "/",
    languages: { "sv-SE": "/", en: "/en", "x-default": "/" },
  },
};

const MERITS = [
  {
    title: "VM-brons 2016",
    text: "I hyrkart-VM kör alla med likvärdiga kartar. Det gör att förarens beslut, tempo och precision avgör. 2016 vann jag finalracet, och eftersom titeln avgörs på hela veckans poäng räckte det till en tredjeplats av 102 förare totalt: VM-brons. Jag nådde även final 2015, 2017 och 2018.",
    highlight: true,
  },
  {
    title: "Läser racet",
    text: "Racet avgörs lika mycket i huvudet som med gaspedalen. Rätt beslut i rätt läge, race efter race. När alla kör likvärdiga kartar är det ofta det som skiljer.",
    highlight: false,
  },
  {
    title: "VM i Vandel 2026",
    text: "Kart World Championship (KWC) körs på Vandel Kart i Danmark 22 juli–1 augusti 2026. Nations Cup avgörs 25–26 juli, och startfältet omfattar 180 förare.",
    highlight: false,
  },
];

export default function HomePage() {
  const mode = getSiteMode();
  const articles = getAllArticles("sv");
  const latest = articles[0] ?? null;

  return (
    <>
      <Hero lang="sv" mode={mode} latestArticle={latest} />

      {/* Aktuell tävling — direkt under hjälten */}
      <CurrentCompetition lang="sv" mode={mode} />

      {/* Senaste nytt */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Senaste nytt">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="heading-caps text-2xl font-bold text-snow">Senaste nytt</h2>
          <Link
            href="/nyheter"
            className="heading-caps text-xs tracking-[0.14em] text-mist transition-colors duration-200 hover:text-snow"
          >
            Alla nyheter →
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {articles.slice(0, 3).map((article, index) => (
              <Reveal key={article.slug} delayMs={index * 60}>
                <ArticleCard article={article} lang="sv" />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-mist">Första rapporten publiceras inom kort.</p>
        )}
      </section>

      {/* Årets banlayouter med onboard-varv */}
      <TrackLayoutsTeaser lang="sv" />

      <KurbitsDivider className="mx-auto max-w-6xl px-4 sm:px-6" />

      {/* Meritkort */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Meriter">
        <div className="grid gap-4 md:grid-cols-3">
          {MERITS.map((merit, index) => (
            <Reveal key={merit.title} delayMs={index * 60}>
              <div
                className={`h-full border bg-midnight-800 p-6 transition-colors duration-200 hover:border-flagblue ${
                  merit.highlight ? "border-flagyellow/40" : "border-line"
                }`}
              >
                <h2
                  className={`heading-caps mb-3 text-lg ${
                    merit.highlight ? "text-flagyellow" : "text-snow"
                  }`}
                >
                  {merit.title}
                </h2>
                <p className="text-sm leading-relaxed text-mist">{merit.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <KurbitsDivider className="mx-auto max-w-6xl px-4 sm:px-6" />

      {/* Partners */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Partners">
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="heading-caps text-xs tracking-[0.16em] text-mist-dim">
            VM-satsningen möjliggörs av
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-sm px-6 py-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                  partner.chip === "light" ? "bg-snow" : "border border-line"
                }`}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </a>
            ))}
          </div>
          <Link href="/partners" className="btn btn-secondary">
            Se möjligheter som partner
          </Link>
        </div>
      </section>
    </>
  );
}
