import { getAllArticles, type Article } from "./content";
import type { Lang } from "./dictionary";
import { KWC } from "./site";
import { getVmStatus, type VmStatus } from "./vm-status";

/**
 * Härleder "efter VM"-recapens data ur dagsrapporternas frontmatter,
 * vm-status.json och KWC — recapen har ingen egen sanningskälla.
 * Dag 1–6 är träning + Nations Cup; individuella mästerskapet (kurvan)
 * börjar VM-dag 7 (28 juli). Dag 4-rapportens standing är ett NC-heat
 * och hör inte hemma i totalkurvan.
 */
const INDIVIDUAL_FIRST_DAY = 7;

/** Slutrapporten från Nations Cup — grafens startpunkt länkar hit. */
const NC_REPORT_SLUG = "nations-cup-finalen";

export type RecapDay = {
  day: number;
  slug: string;
  title: string;
  bestFinish: string | null;
  standing: number;
  podium: boolean;
};

export type VmRecapData = {
  nationsCup: { position: string; slug: string };
  days: RecapDay[];
  stats: {
    finalStanding: number;
    fieldSize: number;
    heatsRaced: number;
    podiums: number;
  };
};

/** "P67" → 67, "41" → 41. Allt annat (t.ex. "semifinal") → null. */
export function parsePlacement(p: string): number | null {
  const match = /^P?(\d+)$/.exec(p.trim());
  return match ? Number(match[1]) : null;
}

export function buildVmRecap(
  articles: Article[],
  status: VmStatus | null,
): VmRecapData | null {
  if (status === null) return null;

  const days: RecapDay[] = articles
    .flatMap((a) => {
      const { day, bestFinish, standing, title } = a.frontmatter;
      if (typeof day !== "number" || day < INDIVIDUAL_FIRST_DAY) return [];
      const parsedStanding = standing === undefined ? null : parsePlacement(standing);
      if (parsedStanding === null) return [];
      const finish = bestFinish === undefined ? null : bestFinish;
      const finishPlace = finish === null ? null : parsePlacement(finish);
      return [
        {
          day,
          slug: a.slug,
          title,
          bestFinish: finish,
          standing: parsedStanding,
          podium: finishPlace !== null && finishPlace <= 3,
        },
      ];
    })
    .sort((a, b) => a.day - b.day);

  if (days.length === 0) return null;

  return {
    nationsCup: { position: status.nationsCupPosition, slug: NC_REPORT_SLUG },
    days,
    stats: {
      finalStanding: days[days.length - 1].standing,
      fieldSize: KWC.driverCount,
      heatsRaced: status.heatsRaced,
      podiums: days.filter((d) => d.podium).length,
    },
  };
}

/** Serverkomponenternas ingång: läser rapporter + status från disk. */
export function getVmRecap(lang: Lang): VmRecapData | null {
  return buildVmRecap(getAllArticles(lang), getVmStatus());
}
