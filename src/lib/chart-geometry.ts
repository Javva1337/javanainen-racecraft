import type { RecapDay } from "./vm-recap-types";

/**
 * Grafgeometri. Koordinater i procent (0–100) av en viewBox med
 * preserveAspectRatio="none" — samma tal används för SVG-pathen och för
 * HTML-punkternas left/top, så linje och punkter aldrig glider isär.
 * Marginalerna lämnar plats för badges ovanför och etiketter under.
 *
 * Egen fil (utan node:fs-beroenden) så att RecapChart — en klientkomponent
 * — kan importera geometrin utan att dra in vm-recap.ts:s serverdataläsning
 * (getAllArticles/getVmStatus) i klientbundeln.
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
