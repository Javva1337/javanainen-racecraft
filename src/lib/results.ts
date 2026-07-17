/**
 * Kanoniska resultat. Resultattabellen på /karriar och /en/career läser
 * härifrån — siffrorna kan aldrig glida isär.
 */

export type ResultRow = {
  competition: string;
  place: { sv: string; en: string };
  year: number;
  result: { sv: string; en: string };
  /** Pallplats (topp 3 totalt) → gul punkt */
  podium: boolean;
  note?: { sv: string; en: string };
};

export const RESULTS: ResultRow[] = [
  {
    competition: "SRKC Linköping",
    place: { sv: "Linköping", en: "Linköping" },
    year: 2015,
    result: { sv: "1:a", en: "1st" },
    podium: true,
    note: { sv: "Vinst, första upplagan", en: "Win, inaugural edition" },
  },
  {
    competition: "KWC — VM",
    place: { sv: "Italien", en: "Italy" },
    year: 2015,
    result: { sv: "11:e av 127", en: "11th of 127" },
    podium: false,
  },
  {
    competition: "KWC — VM",
    place: { sv: "Italien", en: "Italy" },
    year: 2016,
    result: { sv: "3:e av 102", en: "3rd of 102" },
    podium: true,
    note: {
      sv: "Vann finalracet, brons totalt på veckans poäng",
      en: "Won the final, bronze overall",
    },
  },
  {
    competition: "KWC — VM",
    place: { sv: "Spanien", en: "Spain" },
    year: 2017,
    result: { sv: "12:e av 172", en: "12th of 172" },
    podium: false,
  },
  {
    competition: "SRKC Göteborg",
    place: { sv: "Göteborg", en: "Gothenburg" },
    year: 2018,
    result: { sv: "1:a", en: "1st" },
    podium: true,
  },
  {
    competition: "KWC — VM",
    place: { sv: "Polen", en: "Poland" },
    year: 2018,
    result: { sv: "14:e av 131", en: "14th of 131" },
    podium: false,
    note: {
      sv: "Från 16:e till 9:e i finalracet",
      en: "From 16th to 9th in the final race",
    },
  },
  {
    competition: "SRKC",
    place: { sv: "Sverige", en: "Sweden" },
    year: 2021,
    result: { sv: "6:a totalt", en: "6th overall" },
    podium: false,
    note: { sv: "Näst bästa svensk", en: "Second-best Swede" },
  },
  {
    competition: "SRKC",
    place: { sv: "Sverige", en: "Sweden" },
    year: 2026,
    result: { sv: "3:e bästa svensk", en: "3rd-best Swede" },
    podium: false,
  },
];

/**
 * Berättelsens nyckeltal på /karriar — de animerade räknarnas värden.
 * Samma sanningskälla som RESULTS/TIMELINE ovan: ändras ett tal där måste
 * det ändras här (och tvärtom), aldrig i komponenterna.
 */
export const STORY_FACTS = {
  /** VM Spanien 2017 — största startfältet (RESULTS: "12:e av 172") */
  field2017: 172,
  /** VM Italien 2016 — startfältets storlek (RESULTS: "3:e av 102") */
  field2016: 102,
  /** VM Polen 2018 — finalracet (RESULTS-not: "Från 16:e till 9:e") */
  climb2018: { from: 16, to: 9 },
  /** Ginetta G20 Cup 2011 (TIMELINE: "vann 2 av 6 race. 8:a av 22 förare") */
  ginetta2011: { wins: 2, races: 6, place: 8, drivers: 22 },
} as const;

/** "Javanainen i siffror" */
export const STATS = [
  {
    value: 5,
    label: { sv: "VM-starter (inkl. 2026)", en: "World Championship starts (incl. 2026)" },
  },
  {
    value: 4,
    label: { sv: "VM-finaler", en: "World Championship finals" },
  },
  {
    value: 3,
    prefix: { sv: "", en: "" },
    label: { sv: "Bästa VM-placering (2016)", en: "Best Worlds finish (2016)" },
    suffix: { sv: ":a", en: "rd" },
  },
  {
    value: 2,
    label: { sv: "SRKC-titlar", en: "SRKC titles" },
  },
  {
    value: 172,
    label: { sv: "Största startfält jag kört i", en: "Largest field raced" },
  },
] as const;
