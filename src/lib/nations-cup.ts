/**
 * Nations Cup 2026 — enda sanningskällan för /vm-2026/nations-cup.
 * Tider och format enligt KWC:s officiella regler (Nations Cup v2.1 och
 * Track Specific v1.1, båda daterade 24 juli 2026). Alla tider i dansk
 * lokal tid (CEST).
 */

import { KWC } from "./site";

export type NcScheduleRow = {
  /** "09:30" eller "15:45–17:45" — renderas med .tabular */
  time: string;
  label: string;
  detail?: string;
  /** Rad som är relevant för Sverige — gulmarkeras i schemat */
  sweden?: boolean;
  /** Semifinalens grupp — används för att smalna av markeringen efter lottningen */
  group?: "A" | "B";
};

export type NcScheduleDay = { day: string; rows: NcScheduleRow[] };

export const NC_SCHEDULE: NcScheduleDay[] = [
  {
    day: "Lördag 25 juli",
    rows: [
      {
        time: "09:30",
        label: "Lottning",
        detail: "Alla lag lottas in i grupp A eller grupp B",
        sweden: true,
      },
      { time: "15:00", label: "Förarbriefing", detail: "Obligatorisk för alla lag" },
      {
        time: "15:35",
        label: "Uppställning semifinal A",
        detail: "Fem minuters kval sätter startordningen",
      },
      {
        time: "15:45–17:45",
        label: "Semifinal A",
        detail: "Två timmar, grupp A",
        sweden: true,
        group: "A",
      },
      { time: "18:00", label: "Uppställning semifinal B" },
      {
        time: "18:10–20:10",
        label: "Semifinal B",
        detail: "Två timmar, grupp B",
        sweden: true,
        group: "B",
      },
    ],
  },
  {
    day: "Söndag 26 juli",
    rows: [
      { time: "11:00", label: "Förarbriefing" },
      { time: "11:35", label: "Uppställning final B" },
      {
        time: "11:45–15:45",
        label: "Final B",
        detail: "Fyra timmar — lagen som slutade 9–16 i semifinalerna",
      },
      { time: "16:00", label: "Uppställning final A" },
      {
        time: "16:10–20:10",
        label: "Final A",
        detail: "Fyra timmar — topp 8 från varje semifinal gör upp om titeln",
        sweden: true,
      },
    ],
  },
];

export type TrackLayout = {
  id: "vg-classic" | "vg-new-23";
  name: string;
  image: string;
  /** Bildens verkliga mått (px) — behövs av next/image */
  width: number;
  height: number;
  alt: string;
  /** null visar "Varvfilm kommer"-läget i stället för YouTube-knappen */
  youtubeUrl: string | null;
  youtubeLabel: string;
  lapNote: string;
  tacticalElement: string;
  /** Var under VM-veckan layouten används */
  usage: string;
};

export const TRACK_LAYOUTS: TrackLayout[] = [
  {
    id: "vg-classic",
    name: "VG Classic",
    image: "/images/banor/vg-classic.png",
    width: 1064,
    height: 586,
    alt: "Bankarta över VG Classic-layouten på Vandel Gokart, med kurvorna numrerade 1–10",
    youtubeUrl: "https://youtu.be/VORmLu4uhAs",
    youtubeLabel: "Se Rickard köra ett varv på VG Classic",
    lapNote: "Ungefär två sekunder långsammare per varv än VG New 23.",
    tacticalElement:
      "Här används depåstoppet som taktiskt element — när på varvet stoppet tas kan avgöra positioner.",
    usage:
      "Hela Nations Cup körs på den här layouten — semifinal och final, alla sex timmar.",
  },
  {
    id: "vg-new-23",
    name: "VG New 23",
    image: "/images/banor/vg-new-23.png",
    width: 1049,
    height: 591,
    alt: "Bankarta över VG New 23-layouten på Vandel Gokart, med kurvorna numrerade 1–9",
    youtubeUrl: "https://youtu.be/GlXN--bT2xI",
    youtubeLabel: "Se Rickard köra ett varv på VG New 23",
    lapNote: "Ungefär två sekunder snabbare per varv än VG Classic.",
    tacticalElement:
      "Här används en genvägschikan som taktiskt element — den öppnar för andra linjeval än på Classic.",
    usage:
      "Används inte i Nations Cup — den här layouten körs under VM-veckans individuella mästerskap.",
  },
];

export const LAP_DELTA_NOTE =
  "Skillnaden mellan layouterna är nästan exakt två sekunder per varv, till VG New 23:s fördel.";

/**
 * Lottningen 25 juli 09:30 — sätts manuellt när resultatet är känt.
 * Detta är den enda raden som behöver ändras efter lottningen.
 */
export const NC_DRAW = {
  result: null as "A" | "B" | null,
};

export const SEMIFINAL_START: Record<"A" | "B", string> = {
  A: "15:45",
  B: "18:10",
};

/**
 * Lottningens tre lägen: före lottningen, efter utan känt resultat,
 * efter med resultat. `result` är injicerbar för testbarhet.
 */
export function drawState(
  now: number,
  result: "A" | "B" | null = NC_DRAW.result,
): "before" | "pending" | "done" {
  if (now < KWC.nationsCupDraw) return "before";
  return result === null ? "pending" : "done";
}

/** Rad som ska gulmarkeras, givet lottningsresultatet. */
export function isSwedenRow(row: NcScheduleRow, result: "A" | "B" | null): boolean {
  if (!row.sweden) return false;
  if (row.group && result) return row.group === result;
  return true;
}

export const NC_FACTS = {
  maxTeams: 32,
  driversPerTeam: "2–4",
  minWeightKg: 90,
  ballastMaxKg: 20,
  semifinalHours: 2,
  finalHours: 4,
  totalHours: 6,
  mandatoryStops: 3,
  minStopSeconds: 60,
  /** Minuter in i racet då depån är öppen för obligatoriska stopp */
  pitWindows: {
    semifinal: ["20–40", "50–70", "80–100"],
    final: ["50–70", "110–130", "170–190"],
  },
  penalties: { light: "10 s", medium: "30 s", hard: "60 s" },
  /** Påslag för att straffzonen genar banan */
  penaltyExtraSeconds: 20,
} as const;

export const SWEDEN_TEAM = [
  "Rickard Javanainen",
  "Robin Fredriksson",
  "Daniel Fredriksson",
  "Philip Karlsson",
] as const;

/** Samma text i synlig FAQ och FAQPage-schema — de får aldrig glida isär. */
export const NC_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Vad är Nations Cup i hyrkart-VM?",
    a: "Nations Cup är lagtävlingen i Kart World Championship, världsmästerskapet i hyrkart. Länder ställer upp med lag om två till fyra förare som turas om att köra samma race. 2026 körs tävlingen 25–26 juli på Vandel Gokart i Danmark, helgen före det individuella mästerskapet.",
  },
  {
    q: "När kör Sverige sitt första race?",
    a: "Det avgörs av lottningen lördag 25 juli klockan 09:30, då alla lag delas in i grupp A och grupp B. Grupp A kör sin semifinal 15:45–17:45 och grupp B kör sin 18:10–20:10, båda på lördagen. Finalerna körs söndag 26 juli: Final B 11:45–15:45 och Final A 16:10–20:10.",
  },
  {
    q: "Varför byter förarna kart under racet?",
    a: "Vid varje depåstopp byter laget både förare och kart, och den nya karten lottas fram på plats bland två alternativ. Ingen kan alltså bygga sitt race på en enskild bra kart — tanken är att körningen ska avgöra, inte materialet. Tre stopp är obligatoriska i både semifinal och final.",
  },
  {
    q: "Vilken banlayout körs i Nations Cup 2026?",
    a: "Hela Nations Cup — semifinal och final, totalt sex timmar per lag — körs på VG Classic-layouten. Vandel Gokart har också en andra variant, VG New 23, som används i det individuella mästerskapet senare under VM-veckan. VG New 23 är nästan exakt två sekunder snabbare per varv än VG Classic, så förarna behöver behärska båda under veckan.",
  },
  {
    q: "Vilka kör för Sverige i Nations Cup 2026?",
    a: "Sveriges lag 2026 är Rickard Javanainen, Robin Fredriksson, Daniel Fredriksson och Philip Karlsson. Sverige slutade femma 2015–2017 och sexa 2018 — i år är målet att nå pallen.",
  },
];
