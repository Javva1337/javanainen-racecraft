import type { Metadata } from "next";
import { CountUp } from "@/components/CountUp";
import { KurbitsDivider } from "@/components/Kurbits";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { VideoBackdrop } from "@/components/VideoBackdrop";
import { DICT } from "@/lib/dictionary";
import { RESULTS, STATS, TIMELINE } from "@/lib/results";

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

export default function EnglishCareerPage() {
  return (
    <>
      {/* Hero: prispallsceremonin som video-loop, samma mönster som svenska sidan */}
      <section className="relative flex min-h-[64svh] items-end overflow-hidden">
        <VideoBackdrop
          video="/videos/karriar-podium.mp4"
          poster="/images/karriar-poster.jpg"
          imageAlt="Podium ceremony — Rickard Javanainen in the middle of the podium"
          soundOnLabel={DICT.en.common.soundOn}
          soundOffLabel={DICT.en.common.soundOff}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-36 sm:px-6">
          <NationBadge className="mb-4" />
          <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl lg:text-6xl">
            Career
          </h1>
          <p className="mt-3 max-w-2xl text-mist sm:text-lg">
            From karting in Dalarna in 2002 to the rental kart Worlds in Vandel 2026. The whole
            road, with the numbers to back it up.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Javanainen in numbers */}
      <section className="mb-20" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Javanainen in numbers
        </h2>
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
      </section>

      {/* Results table — canonical values from lib/results.ts */}
      <section className="mb-20" aria-labelledby="results-heading">
        <h2 id="results-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Results
        </h2>
        <div className="overflow-x-auto border border-line">
          <table className="tabular w-full min-w-[640px] text-sm">
            <caption className="sr-only">
              Race results for R. Javanainen (SWE), 2015–2026
            </caption>
            <thead>
              <tr className="bg-midnight-800 text-left">
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Event
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Location
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Year
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
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
                      {row.note && <span className="text-xs text-mist-dim">— {row.note.en}</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-mist-dim">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-flagyellow" aria-hidden="true" />
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
      </section>

      <KurbitsDivider className="mb-20" />

      {/* Timeline — same numbers as the table (lib/results.ts) */}
      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="heading-caps mb-10 text-2xl font-bold text-snow">
          The timeline 2002–2026
        </h2>
        <Reveal>
          <Timeline entries={TIMELINE} lang="en" />
        </Reveal>
      </section>
      </div>
    </>
  );
}
