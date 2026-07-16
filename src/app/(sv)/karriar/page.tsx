import type { Metadata } from "next";
import { CountUp } from "@/components/CountUp";
import { KurbitsDivider } from "@/components/Kurbits";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { RESULTS, STATS, TIMELINE } from "@/lib/results";

export const metadata: Metadata = {
  title: "Karriär — resultat och tidslinje 2002–2026",
  description:
    "Rickard Javanainens karriär i siffror: VM-brons 2016 (3:e av 102), två SRKC-titlar och vägen från gokart i Dalarna till hyrkart-VM i Vandel 2026.",
  alternates: { canonical: "/karriar" },
};

export default function CareerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Karriär</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Från gokart i Dalarna 2002 till hyrkart-VM i Vandel 2026. Hela vägen, med siffrorna
          som bevisar den.
        </p>
      </header>

      {/* Javanainen i siffror */}
      <section className="mb-20" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Javanainen i siffror
        </h2>
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
      </section>

      {/* Resultattabell — kanoniska värden ur lib/results.ts */}
      <section className="mb-20" aria-labelledby="results-heading">
        <h2 id="results-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Resultat
        </h2>
        <div className="overflow-x-auto border border-line">
          <table className="tabular w-full min-w-[640px] text-sm">
            <caption className="sr-only">
              Tävlingsresultat för R. Javanainen (SWE), 2015–2026
            </caption>
            <thead>
              <tr className="bg-midnight-800 text-left">
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Tävling
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Plats
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  År
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
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
                      {row.note && <span className="text-xs text-mist-dim">— {row.note.sv}</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-mist-dim">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-flagyellow" aria-hidden="true" />
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
      </section>

      <KurbitsDivider className="mb-20" />

      {/* Tidslinje — samma siffror som tabellen (lib/results.ts) */}
      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="heading-caps mb-10 text-2xl font-bold text-snow">
          Tidslinjen 2002–2026
        </h2>
        <Reveal>
          <Timeline entries={TIMELINE} lang="sv" />
        </Reveal>
      </section>
    </div>
  );
}
