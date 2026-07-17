/**
 * Kapitelstrukturen för karriärberättelsen på /karriar.
 * Rail, kapitelmeny, racinglinje och sektioner läser ALLA härifrån.
 * Siffrorna i kapitlen kommer från lib/results.ts — aldrig härifrån.
 */

export type ChapterDef = {
  /** DOM-id och ankare (#id) */
  id: string;
  /** "01"–"06" för kapitlen, null för prolog/epilog */
  num: string | null;
  years: string;
  title: { sv: string; en: string };
  /** Kapitel som rymmer pallplatsår (2015, 2016, 2018) → kurbitsdetalj vid noden */
  podium?: boolean;
};

export const CHAPTERS: ChapterDef[] = [
  { id: "prolog", num: null, years: "", title: { sv: "Prolog", en: "Prologue" } },
  { id: "dalarna", num: "01", years: "2002–2006", title: { sv: "Dalarna", en: "Dalarna" } },
  { id: "banracing", num: "02", years: "2007–2011", title: { sv: "Banracing", en: "Circuit racing" } },
  {
    id: "genombrottet",
    num: "03",
    years: "2015",
    title: { sv: "Genombrottet", en: "The breakthrough" },
    podium: true,
  },
  { id: "bronset", num: "04", years: "2016", title: { sv: "Bronset", en: "The bronze" }, podium: true },
  { id: "jakten", num: "05", years: "2017–2021", title: { sv: "Jakten", en: "The chase" }, podium: true },
  { id: "vandel", num: "06", years: "2026", title: { sv: "Vandel", en: "Vandel" } },
  { id: "facit", num: null, years: "2015–2026", title: { sv: "Facit", en: "The tally" } },
];
