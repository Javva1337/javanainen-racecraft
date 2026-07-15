/**
 * Kanoniska resultat. Tidslinjen på /karriar och resultattabellen läser BÅDA
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
      sv: "Vinst i finalen, brons totalt",
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

export type TimelineEntry = {
  years: string;
  title: { sv: string; en: string };
  description: { sv: string; en: string };
  highlight: boolean;
};

/** Tidslinje 2002–2026 — VM-/SRKC-siffrorna är identiska med RESULTS ovan. */
export const TIMELINE: TimelineEntry[] = [
  {
    years: "2002",
    title: { sv: "Gokart", en: "Karting" },
    description: {
      sv: "Första steget in i motorsport. 10 år gammal.",
      en: "First step into motorsport. 10 years old.",
    },
    highlight: false,
  },
  {
    years: "2002–2006",
    title: { sv: "Gokart — olika klasser", en: "Karting — multiple classes" },
    description: {
      sv: "Flera år av utveckling genom olika gokartklasser, med flertalet vinster och pallplatser.",
      en: "Years of development through karting classes, with multiple wins and podiums.",
    },
    highlight: false,
  },
  {
    years: "2007",
    title: { sv: "Renault Junior Cup", en: "Renault Junior Cup" },
    description: {
      sv: "2:a plats totalt i Renault Junior Cup.",
      en: "2nd overall in the Renault Junior Cup.",
    },
    highlight: false,
  },
  {
    years: "2008–2010",
    title: { sv: "JTCC", en: "JTCC" },
    description: {
      sv: "Junior Touring Car Championship. Flertalet pallplatser.",
      en: "Junior Touring Car Championship. Multiple podiums.",
    },
    highlight: false,
  },
  {
    years: "2011",
    title: { sv: "Ginetta G20 Cup", en: "Ginetta G20 Cup" },
    description: {
      sv: "Inhopp mitt i säsongen — vann 2 av 6 race. 8:a av 22 förare totalt med bara hälften av racen körda.",
      en: "Mid-season stand-in — won 2 of 6 races. 8th of 22 drivers overall despite racing only half the season.",
    },
    highlight: false,
  },
  {
    years: "2015",
    title: { sv: "SRKC-vinst & VM Italien", en: "SRKC win & Worlds in Italy" },
    description: {
      sv: "Vinnare av första upplagan av SRKC Linköping. 11:e av 127 individuellt i VM — och körde Sveriges lag från sist till först i Nations Cup.",
      en: "Won the inaugural SRKC Linköping. 11th of 127 individually at the Worlds — and drove Sweden's team from last to first in the Nations Cup.",
    },
    highlight: true,
  },
  {
    years: "2016",
    title: { sv: "VM Italien — brons", en: "Worlds in Italy — bronze" },
    description: {
      sv: "Vinst i finalen. 3:e av 102 totalt i världsmästerskapet.",
      en: "Won the final. 3rd of 102 overall in the World Championship.",
    },
    highlight: true,
  },
  {
    years: "2017",
    title: { sv: "VM Spanien", en: "Worlds in Spain" },
    description: {
      sv: "12:e av 172 i världsmästerskapet — största startfältet hittills.",
      en: "12th of 172 in the World Championship — the largest field to date.",
    },
    highlight: false,
  },
  {
    years: "2018",
    title: { sv: "SRKC-vinst & VM Polen", en: "SRKC win & Worlds in Poland" },
    description: {
      sv: "Vann SRKC Göteborg. 14:e av 131 i VM — från 16:e till 9:e i finalracet.",
      en: "Won SRKC Gothenburg. 14th of 131 at the Worlds — from 16th to 9th in the final race.",
    },
    highlight: true,
  },
  {
    years: "2021",
    title: { sv: "SRKC-final", en: "SRKC final" },
    description: {
      sv: "6:a totalt. Näst bästa svensk.",
      en: "6th overall. Second-best Swede.",
    },
    highlight: false,
  },
  {
    years: "2026",
    title: { sv: "VM Vandel, Danmark", en: "Worlds at Vandel, Denmark" },
    description: {
      sv: "3:e bästa svensk i SRKC. Klar för hyrkart-VM på Vandel Kart 22 juli–1 augusti — KWC Individual och Nations Cup för Sverige.",
      en: "3rd-best Swede in the SRKC. Set for the Kart World Championship at Vandel Kart, 22 July–1 August — KWC Individual and Nations Cup for Sweden.",
    },
    highlight: true,
  },
];

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
    label: { sv: "Störst slagna startfält", en: "Largest field raced" },
  },
] as const;
