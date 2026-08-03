import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import { KWC } from "@/lib/site";
import { chartPoints, getVmRecap } from "@/lib/vm-recap";
import { RecapChart } from "./RecapChart";
import { RecapStats, type RecapStatItem } from "./RecapStats";

/**
 * Full "efter VM"-recap på /vm-2026: nyckeltal + veckokurvan.
 * Serverkomponent — äger data och text; klientbarnen äger bara rörelsen.
 */
export function VmRecap({ lang }: { lang: Lang }) {
  const recap = getVmRecap(lang);
  if (recap === null) return null;

  const t = DICT[lang].recap;
  const newsBase = lang === "sv" ? "/nyheter" : "/en/news";

  const stats: RecapStatItem[] = [
    {
      value: recap.stats.finalStanding,
      suffix: lang === "sv" ? ":a" : "st",
      detail: lang === "sv" ? `av ${recap.stats.fieldSize}` : `of ${recap.stats.fieldSize}`,
      label: t.statFinal,
    },
    { value: recap.stats.heatsRaced, label: t.statHeats },
    { value: recap.stats.podiums, label: t.statPodiums },
    { value: t.statSemiValue, label: t.statSemi },
  ];

  return (
    <section className="mb-16" aria-labelledby="recap-heading">
      <h2 id="recap-heading" className="heading-caps mb-3 text-2xl font-bold text-snow">
        {t.heading}
      </h2>
      <p className="mb-8 max-w-2xl text-mist">{t.intro(KWC.result2026[lang])}</p>

      <RecapStats items={stats} />

      <div className="mt-10 border border-line bg-midnight-800 p-5 sm:p-8">
        <h3 className="heading-caps text-lg font-bold text-snow">{t.journeyHeading}</h3>
        <p className="mb-8 mt-1 text-sm text-mist-dim">{t.journeyIntro}</p>
        <RecapChart
          points={chartPoints(recap.days)}
          nationsCup={recap.nationsCup}
          lang={lang}
          labels={{
            ncLabel: t.ncLabel(recap.nationsCup.position),
            chartAria: t.chartAria,
            // Förberäknad per dag — funktioner går inte över RSC-gränsen
            // till klientkomponenten RecapChart.
            dayAria: Object.fromEntries(
              recap.days.map((d) => [d.day, t.dayAria(d.day, d.standing)]),
            ),
          }}
        />
      </div>

      <p className="mt-6">
        <Link
          href={`${newsBase}/${KWC.finalReportSlug}`}
          className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
        >
          {t.finalReportCta}
        </Link>
      </p>
    </section>
  );
}
