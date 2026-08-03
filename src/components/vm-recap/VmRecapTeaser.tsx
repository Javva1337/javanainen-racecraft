import Link from "next/link";
import { CurrentCompetition } from "@/components/CurrentCompetition";
import { DICT, type Lang } from "@/lib/dictionary";
import { getVmRecap } from "@/lib/vm-recap";
import { RecapStats, type RecapStatItem } from "./RecapStats";

/**
 * Startsidans "efter VM"-teaser: tre nyckeltal + CTA till /vm-2026.
 * Ersätter CurrentCompetition i after-läget; saknas recap-data (status-
 * filen borta) faller vi tillbaka på CurrentCompetitions after-text.
 */
export function VmRecapTeaser({ lang }: { lang: Lang }) {
  const recap = getVmRecap(lang);
  if (recap === null) return <CurrentCompetition lang={lang} mode="after" />;

  const t = DICT[lang].recap;
  const vmHref = lang === "sv" ? "/vm-2026" : "/en/vm-2026";

  const stats: RecapStatItem[] = [
    {
      value: recap.stats.finalStanding,
      suffix: lang === "sv" ? ":a" : "st",
      detail: lang === "sv" ? `av ${recap.stats.fieldSize}` : `of ${recap.stats.fieldSize}`,
      label: t.statFinal,
    },
    { value: recap.stats.podiums, label: t.statPodiums },
    { value: t.statSemiValue, label: t.statSemi },
  ];

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-10 sm:px-6"
      aria-label={t.teaserHeading}
    >
      <div className="border border-line bg-midnight-800 p-6 sm:p-8">
        <p className="heading-caps mb-3 text-xs tracking-[0.16em] text-flagyellow">
          {t.kicker}
        </p>
        <h2 className="heading-caps mb-6 text-2xl font-bold text-snow">
          {t.teaserHeading}
        </h2>
        <RecapStats items={stats} />
        <div className="mt-6">
          <Link href={vmHref} className="btn btn-primary">
            {t.teaserCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
