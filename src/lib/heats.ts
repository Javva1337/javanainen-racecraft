/**
 * Rickards kvalheat i KWC Individual 2026 — enda sanningskällan för
 * "När kör Rickard?"-sektionen på /vm-2026.
 *
 * Heatbokstäver och starttider kommer från arrangörens förarlista
 * (Races: R.Javanainen på brasilkart.com.br), senast uppdaterad kvällen
 * före första tävlingsdagen (27 juli 22:53) — hela schemat flyttades då
 * +30 minuter mot det först publicerade. Vid ny ändring: uppdatera tiderna
 * här (och bara här), visningstid och tidsstämpel testas mot varandra.
 * Alla tider i dansk lokal tid (CEST = UTC+2).
 */

import type { Lang } from "./dictionary";

export type HeatLayoutId = "classic" | "new23";

export const HEAT_LAYOUT_NAMES: Record<HeatLayoutId, string> = {
  classic: "VG Classic",
  new23: "VG New 23",
};

export type Heat = {
  /** Löpnummer 1–8 i mästerskapet */
  no: number;
  /** Arrangörens heatbeteckning, t.ex. "4G" */
  round: string;
  /** Starttid som "HH:MM", dansk lokal tid */
  time: string;
  /** Starttid i ms UTC — för nedräkning och körd/kommande-läge */
  start: number;
};

export type HeatDay = {
  /** VM-dag 1–4 i det individuella mästerskapet */
  day: number;
  date: { sv: string; en: string };
  layout: HeatLayoutId;
  heats: Heat[];
};

/** Heaten går var 25:e minut — efter det räknas ett heat som kört. */
export const HEAT_SLOT_MS = 25 * 60_000;

export const HEAT_DAYS: HeatDay[] = [
  {
    day: 1,
    date: { sv: "Tisdag 28 juli", en: "Tuesday 28 July" },
    layout: "classic",
    heats: [
      { no: 1, round: "1I", time: "13:20", start: Date.UTC(2026, 6, 28, 11, 20) },
      { no: 2, round: "2F", time: "16:55", start: Date.UTC(2026, 6, 28, 14, 55) },
    ],
  },
  {
    day: 2,
    date: { sv: "Onsdag 29 juli", en: "Wednesday 29 July" },
    layout: "new23",
    heats: [
      { no: 3, round: "3C", time: "10:45", start: Date.UTC(2026, 6, 29, 8, 45) },
      { no: 4, round: "4G", time: "17:20", start: Date.UTC(2026, 6, 29, 15, 20) },
    ],
  },
  {
    day: 3,
    date: { sv: "Torsdag 30 juli", en: "Thursday 30 July" },
    layout: "classic",
    heats: [
      { no: 5, round: "5H", time: "12:55", start: Date.UTC(2026, 6, 30, 10, 55) },
      { no: 6, round: "6E", time: "16:25", start: Date.UTC(2026, 6, 30, 14, 25) },
    ],
  },
  {
    day: 4,
    date: { sv: "Fredag 31 juli", en: "Friday 31 July" },
    layout: "new23",
    heats: [
      { no: 7, round: "7A", time: "09:55", start: Date.UTC(2026, 6, 31, 7, 55) },
      { no: 8, round: "8E", time: "16:25", start: Date.UTC(2026, 6, 31, 14, 25) },
    ],
  },
];

/** Finaldagen — semifinal och final, banlayouten lottas på tävlingsdagen. */
export const FINALE_DAY = {
  date: { sv: "Lördag 1 augusti", en: "Saturday 1 August" },
} as const;

export const ALL_HEATS: Heat[] = HEAT_DAYS.flatMap((d) => d.heats);

export type HeatState = "done" | "live" | "next" | "upcoming";

/** Körd/pågår/näst på tur/kommande — givet en tidpunkt. */
export function heatState(heat: Heat, now: number): HeatState {
  if (now >= heat.start + HEAT_SLOT_MS) return "done";
  if (now >= heat.start) return "live";
  const next = getNextHeat(now);
  return next && next.no === heat.no ? "next" : "upcoming";
}

/** Nästa heat som inte startat ännu, eller null när alla åtta är körda. */
export function getNextHeat(now: number): Heat | null {
  return ALL_HEATS.find((heat) => now < heat.start) ?? null;
}

/** Dagen ett heat tillhör — för "Nästa heat"-kortets datum och layout. */
export function heatDayOf(heat: Heat): HeatDay {
  const day = HEAT_DAYS.find((d) => d.heats.some((h) => h.no === heat.no));
  if (!day) throw new Error(`Heat ${heat.no} saknar dag`);
  return day;
}

/** FAQ-posten byggs från HEAT_DAYS så synlig text och schema aldrig glider isär. */
function faqTimes(lang: Lang): string {
  const joiner = lang === "sv" ? " och " : " and ";
  return HEAT_DAYS.map((d) => {
    /* Svenska veckodagar skrivs med liten bokstav mitt i en mening */
    const date = lang === "sv" ? d.date.sv.toLowerCase() : d.date.en;
    return `${date} ${d.heats.map((h) => h.time).join(joiner)}`;
  }).join(", ");
}

export const HEAT_FAQ: Record<Lang, { q: string; a: string }> = {
  sv: {
    q: "När kör Rickard sina heat i VM 2026?",
    a: `Rickard kör två kvalheat per dag i det individuella mästerskapet, alla tider i dansk lokal tid: ${faqTimes(
      "sv",
    )}. Banlayouten växlar dag för dag: VG Classic tisdag och torsdag, VG New 23 onsdag och fredag. Semifinal och final körs lördag 1 augusti, och där lottas layouten på tävlingsdagen.`,
  },
  en: {
    q: "When does Rickard race his heats at the 2026 Worlds?",
    a: `Rickard races two qualifying heats per day in the individual championship, all times Danish local time: ${faqTimes(
      "en",
    )}. The track layout alternates day by day: VG Classic on Tuesday and Thursday, VG New 23 on Wednesday and Friday. The semifinal and final are held on Saturday 1 August, where the layout is drawn on race day.`,
  },
};

/** UI-copy för sektionen — samma struktur för båda språken. */
export const HEAT_COPY: Record<
  Lang,
  {
    heading: string;
    intro: string;
    heatLabel: (no: number) => string;
    heatRow: (no: number) => string;
    dayLabel: (day: number) => string;
    nextHeat: string;
    liveNow: string;
    done: string;
    allDone: string;
    finale: string;
    finaleDetail: string;
    footnote: string;
    timingLink: string;
  }
> = {
  sv: {
    heading: "När kör Rickard?",
    intro:
      "Åtta kvalheat på fyra dagar, två per dag. Kartarna lottas inför varje heat och startordningen sätts av ett tidskval på ett varv strax före start.",
    heatLabel: (no) => `Heat ${no} av 8`,
    heatRow: (no) => `Heat ${no}`,
    dayLabel: (day) => `Dag ${day}`,
    nextHeat: "Nästa heat",
    liveNow: "Pågår nu",
    done: "Kört",
    allDone: "Alla åtta kvalheaten är körda — nu väntar semifinal och final.",
    finale: "Semifinal & final",
    finaleDetail:
      "Semifinalen avgör vilka 18 förare som gör upp i finalen. Banlayouten lottas på tävlingsdagen.",
    footnote:
      "Tider enligt arrangörens körschema, i dansk lokal tid. Schemat kan justeras under dagen — säkraste källan i realtid är banans",
    timingLink: "livetiming",
  },
  en: {
    heading: "When does Rickard race?",
    intro:
      "Eight qualifying heats across four days, two per day. Karts are drawn by lot before every heat and the starting order is set by a one-lap time qualifying just before the start.",
    heatLabel: (no) => `Heat ${no} of 8`,
    heatRow: (no) => `Heat ${no}`,
    dayLabel: (day) => `Day ${day}`,
    nextHeat: "Next heat",
    liveNow: "On track now",
    done: "Raced",
    allDone: "All eight qualifying heats are done — next up: semifinal and final.",
    finale: "Semifinal & final",
    finaleDetail:
      "The semifinal decides which 18 drivers contest the final. The track layout is drawn on race day.",
    footnote:
      "Times from the organiser's schedule, Danish local time. The schedule can shift during the day — the most reliable real-time source is the track's",
    timingLink: "live timing",
  },
};
