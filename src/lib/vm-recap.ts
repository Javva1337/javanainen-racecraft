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

/**
 * Grafgeometri. Koordinater i procent (0–100) av en viewBox med
 * preserveAspectRatio="none" — samma tal används för SVG-pathen och för
 * HTML-punkternas left/top, så linje och punkter aldrig glider isär.
 * Marginalerna lämnar plats för badges ovanför och etiketter under.
 */
const CHART = { left: 8, right: 96, top: 14, bottom: 86 } as const;

export type ChartPoint = { x: number; y: number; day: RecapDay };

export function chartPoints(days: RecapDay[]): ChartPoint[] {
  if (days.length === 0) return [];
  const standings = days.map((d) => d.standing);
  const best = Math.min(...standings);
  const worst = Math.max(...standings);
  const span = worst - best;
  const xStep = days.length === 1 ? 0 : (CHART.right - CHART.left) / (days.length - 1);
  return days.map((day, i) => ({
    x: CHART.left + xStep * i,
    y:
      span === 0
        ? (CHART.top + CHART.bottom) / 2
        : CHART.top + ((day.standing - best) / span) * (CHART.bottom - CHART.top),
    day,
  }));
}

export function chartPathD(points: ChartPoint[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");
}
