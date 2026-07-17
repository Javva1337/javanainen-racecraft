import type { Metadata } from "next";
import { CountUp } from "@/components/CountUp";
import { NationBadge } from "@/components/NationBadge";
import { VideoBackdrop } from "@/components/VideoBackdrop";
import { CareerStoryProvider } from "@/components/career/CareerStoryProvider";
import { ChapterBanracing } from "@/components/career/ChapterBanracing";
import { ChapterBronset } from "@/components/career/ChapterBronset";
import { ChapterDalarna } from "@/components/career/ChapterDalarna";
import { ChapterGenombrottet } from "@/components/career/ChapterGenombrottet";
import { ChapterJakten } from "@/components/career/ChapterJakten";
import { ChapterNav } from "@/components/career/ChapterNav";
import { ChapterVandel } from "@/components/career/ChapterVandel";
import { QuoteInterlude } from "@/components/career/QuoteInterlude";
import { RaceLine } from "@/components/career/RaceLine";
import { ScrollCue } from "@/components/career/ScrollCue";
import { StoryEffects } from "@/components/career/StoryEffects";
import { CHAPTERS } from "@/lib/career-story";
import { getAllArticles } from "@/lib/content";
import { DICT } from "@/lib/dictionary";
import { getSiteMode } from "@/lib/mode";
import { RESULTS, STATS } from "@/lib/results";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Karriär — resultat och tidslinje 2002–2026",
  description:
    "Rickard Javanainens karriär i siffror: VM-brons 2016 (3:e av 102), två SRKC-titlar och vägen från gokart i Dalarna till hyrkart-VM i Vandel 2026.",
  alternates: {
    canonical: "/karriar",
    languages: { "sv-SE": "/karriar", en: "/en/career", "x-default": "/karriar" },
  },
};

/**
 * /karriar som scrolldriven berättelse i sex kapitel + prolog och epilog.
 * Allt innehåll server-renderas; GSAP/Lenis-lagret i career-komponenterna är
 * enbart progressiv förbättring ovanpå.
 */
export default function CareerPage() {
  const mode = getSiteMode();
  const articles = getAllArticles("sv");
  const latest = articles[0] ?? null;
  const latestHref = latest ? `/nyheter/${latest.slug}` : "/nyheter";

  return (
    <CareerStoryProvider>
      <ChapterNav chapters={CHAPTERS} lang="sv" />

      {/* Prolog: prispallsceremonin som video-loop, samma mönster som startsidan */}
      <section
        id="prolog"
        tabIndex={-1}
        aria-labelledby="prolog-heading"
        data-chapter="prolog"
        className="relative flex min-h-[76svh] items-end overflow-hidden outline-none"
      >
        <VideoBackdrop
          video="/videos/karriar-podium.mp4"
          poster="/images/karriar-poster.jpg"
          imageAlt="Prispallsceremoni — Rickard Javanainen i mitten på pallen"
          soundOnLabel={DICT.sv.common.soundOn}
          soundOffLabel={DICT.sv.common.soundOff}
          deferVideoOnMobile
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-36 sm:px-6">
          <NationBadge className="mb-4" />
          <h1
            id="prolog-heading"
            className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl lg:text-6xl"
          >
            Karriär
          </h1>
          <p className="mt-3 max-w-2xl text-mist sm:text-lg">
            Från gokart i Dalarna 2002 till hyrkart-VM i Vandel 2026. Hela vägen, med siffrorna
            som bevisar den, berättad i sex kapitel.
          </p>
          <div className="mt-10 flex justify-center">
            <ScrollCue lang="sv" />
          </div>
        </div>
      </section>

      {/* Berättelsen — kapitel 01–06 längs racinglinjen */}
      <div
        data-story
        className="relative mx-auto max-w-6xl overflow-x-clip [--rail-x:1.25rem] sm:[--rail-x:3rem]"
      >
        {/* Statisk guidelinje — finns alltid, även utan JS */}
        <div
          className="absolute inset-y-0 left-[var(--rail-x)] w-px -translate-x-1/2 bg-line/60"
          aria-hidden="true"
        />
        <RaceLine />
        <StoryEffects />
        <ChapterDalarna lang="sv" />
        <ChapterBanracing lang="sv" />
        <ChapterGenombrottet lang="sv" />
        <ChapterBronset lang="sv" />
        <QuoteInterlude quote="Med samma material för alla finns inget att gömma sig bakom." lang="sv" />
        <ChapterJakten lang="sv" />
        <ChapterVandel
          mode={mode}
          latestHref={latestHref}
          latestTitle={latest?.frontmatter.title ?? null}
          lang="sv"
        />
      </div>

      {/* Epilog — Facit: statistiken och samtliga resultat, trovärdighetsankaret */}
      <section
        id="facit"
        tabIndex={-1}
        aria-labelledby="facit-heading"
        data-chapter="facit"
        className="scroll-mt-20 border-t border-line outline-none"
      >
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <header>
            <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
              Epilog <span aria-hidden="true">·</span> 2015–2026
            </p>
            <h2
              id="facit-heading"
              className="heading-caps mt-3 text-4xl font-extrabold leading-[0.95] text-snow sm:text-6xl"
            >
              Facit
            </h2>
            <p className="mt-5 max-w-2xl text-base text-mist sm:text-lg">
              Siffrorna bakom berättelsen: tidslinjen 2002–2026 som statistik och samtliga
              resultat.
            </p>
          </header>

          {/* Javanainen i siffror */}
          <div className="mt-16" aria-labelledby="stats-heading" role="group">
            <h3 id="stats-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
              Javanainen i siffror
            </h3>
            <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
              {STATS.map((stat) => (
                <div key={stat.label.sv} className="flex flex-col gap-2 bg-midnight-800 p-6">
                  <CountUp
                    value={stat.value}
                    suffix={"suffix" in stat ? stat.suffix.sv : ""}
                    className="heading-caps text-4xl font-bold text-flagyellow sm:text-5xl"
                  />
                  <span className="text-xs leading-snug text-mist-dim">{stat.label.sv}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-mist-dim">
              Invald i{" "}
              <a
                href="https://srkc.nu/results/hall-of-fame/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flagblue-bright underline underline-offset-2"
              >
                SRKC:s Hall of Fame
              </a>
              , hittills som ende förare.
            </p>
          </div>

          {/* Resultattabell — kanoniska värden ur lib/results.ts */}
          <div className="mt-16" aria-labelledby="results-heading" role="group">
            <h3 id="results-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
              Resultat
            </h3>
            <div className="overflow-x-auto border border-line">
              <table className="tabular w-full min-w-[640px] text-sm">
                <caption className="sr-only">
                  Tävlingsresultat för R. Javanainen (SWE), 2015–2026
                </caption>
                <thead>
                  <tr className="bg-midnight-800 text-left">
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Tävling
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Plats
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      År
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Resultat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((row) => (
                    <tr
                      key={`${row.competition}-${row.year}`}
                      className="border-t border-line transition-colors duration-150 hover:bg-midnight-800"
                    >
                      <td className="px-4 py-3 text-snow">{row.competition}</td>
                      <td className="px-4 py-3 text-mist">{row.place.sv}</td>
                      <td className="px-4 py-3 text-mist">{row.year}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          {row.podium && (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full bg-flagyellow"
                              title="Pallplats"
                              aria-label="Pallplats"
                            />
                          )}
                          <span className={row.podium ? "font-semibold text-snow" : "text-mist"}>
                            {row.result.sv}
                          </span>
                          {row.note && (
                            <span className="text-xs text-mist-dim">· {row.note.sv}</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-mist-dim">
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full bg-flagyellow"
                aria-hidden="true"
              />
              Pallplats · Officiella KWC-resultat finns hos{" "}
              <a
                href="https://kartworldchampionship.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flagblue-bright underline underline-offset-2"
              >
                arrangören
              </a>
            </p>
          </div>
        </div>
      </section>
    </CareerStoryProvider>
  );
}
