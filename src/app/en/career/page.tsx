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
  title: "Career — results and timeline 2002–2026",
  description:
    "Rickard Javanainen's career in numbers: Worlds bronze in 2016 (3rd of 102), two SRKC titles, and the road from karting in Dalarna to the rental kart World Championship in Vandel 2026.",
  alternates: {
    canonical: "/en/career",
    languages: { "sv-SE": "/karriar", en: "/en/career", "x-default": "/karriar" },
  },
  openGraph: { locale: "en_US" },
};

/**
 * /en/career som scrolldriven berättelse — spegel av /karriar med lang="en".
 * Allt innehåll server-renderas; GSAP/Lenis-lagret är progressiv förbättring.
 */
export default function EnglishCareerPage() {
  const mode = getSiteMode();
  const articles = getAllArticles("en");
  const latest = articles[0] ?? null;
  const latestHref = latest ? `/en/news/${latest.slug}` : "/en/news";

  return (
    <CareerStoryProvider>
      <ChapterNav chapters={CHAPTERS} lang="en" />

      {/* Prologue: prispallsceremonin som video-loop, samma mönster som svenska sidan */}
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
          imageAlt="Podium ceremony — Rickard Javanainen in the middle of the podium"
          soundOnLabel={DICT.en.common.soundOn}
          soundOffLabel={DICT.en.common.soundOff}
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
            Career
          </h1>
          <p className="mt-3 max-w-2xl text-mist sm:text-lg">
            From karting in Dalarna in 2002 to the rental kart Worlds in Vandel 2026. The whole
            road, with the numbers to back it up — told in six chapters.
          </p>
          <div className="mt-10 flex justify-center">
            <ScrollCue lang="en" />
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
        <ChapterDalarna lang="en" />
        <ChapterBanracing lang="en" />
        <ChapterGenombrottet lang="en" />
        <ChapterBronset lang="en" />
        <QuoteInterlude
          quote="With the same equipment for everyone, there is nothing to hide behind."
          lang="en"
        />
        <ChapterJakten lang="en" />
        <ChapterVandel
          mode={mode}
          latestHref={latestHref}
          latestTitle={latest?.frontmatter.title ?? null}
          lang="en"
        />
      </div>

      {/* Epilogue — The tally: statistiken och samtliga resultat */}
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
              Epilogue <span aria-hidden="true">·</span> 2015–2026
            </p>
            <h2
              id="facit-heading"
              className="heading-caps mt-3 text-4xl font-extrabold leading-[0.95] text-snow sm:text-6xl"
            >
              The tally
            </h2>
            <p className="mt-5 max-w-2xl text-base text-mist sm:text-lg">
              The numbers behind the story — the 2002–2026 timeline as statistics, and every
              result.
            </p>
          </header>

          {/* Javanainen in numbers */}
          <div className="mt-16" aria-labelledby="stats-heading" role="group">
            <h3 id="stats-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
              Javanainen in numbers
            </h3>
            <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
              {STATS.map((stat) => (
                <div key={stat.label.en} className="flex flex-col gap-2 bg-midnight-800 p-6">
                  <CountUp
                    value={stat.value}
                    suffix={"suffix" in stat ? stat.suffix.en : ""}
                    className="heading-caps text-4xl font-bold text-flagyellow sm:text-5xl"
                  />
                  <span className="text-xs leading-snug text-mist-dim">{stat.label.en}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-mist-dim">
              Inducted into the{" "}
              <a
                href="https://srkc.nu/results/hall-of-fame/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flagblue-bright underline underline-offset-2"
              >
                SRKC Hall of Fame
              </a>
              , so far as the only driver.
            </p>
          </div>

          {/* Results table — canonical values from lib/results.ts */}
          <div className="mt-16" aria-labelledby="results-heading" role="group">
            <h3 id="results-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
              Results
            </h3>
            <div className="overflow-x-auto border border-line">
              <table className="tabular w-full min-w-[640px] text-sm">
                <caption className="sr-only">
                  Race results for R. Javanainen (SWE), 2015–2026
                </caption>
                <thead>
                  <tr className="bg-midnight-800 text-left">
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Result
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
                      <td className="px-4 py-3 text-mist">{row.place.en}</td>
                      <td className="px-4 py-3 text-mist">{row.year}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          {row.podium && (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full bg-flagyellow"
                              title="Podium"
                              aria-label="Podium"
                            />
                          )}
                          <span className={row.podium ? "font-semibold text-snow" : "text-mist"}>
                            {row.result.en}
                          </span>
                          {row.note && (
                            <span className="text-xs text-mist-dim">— {row.note.en}</span>
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
              Podium · Official KWC results are available from the{" "}
              <a
                href="https://kartworldchampionship.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flagblue-bright underline underline-offset-2"
              >
                organiser
              </a>
            </p>
          </div>
        </div>
      </section>
    </CareerStoryProvider>
  );
}
