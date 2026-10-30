/**
 * Innehåll till startsidan (Ben 1:1-layout). Fakta hämtas från site.ts,
 * results.ts och career-story.ts — inga egna siffror här.
 */
import { CHAPTERS } from "./career-story";
import { KWC, SOCIAL, STUDIO } from "./site";
import { RESULTS, STORY_FACTS } from "./results";
import type { Lang } from "./dictionary";
import { cap, ordinalEn } from "./text-utils";

type L = Record<Lang, string>;

export type JourneyCard = {
  id: string;
  year: string;
  tag: L;
  title: L;
  text: L;
  image?: { src: string; alt: L };
};

const res = (year: number, competition: string) =>
  RESULTS.find((r) => r.year === year && r.competition === competition)!;

const chapter = (id: string) => CHAPTERS.find((c) => c.id === id)!;
/** Första året i kapitlets spann ("2007–2011" → "2007") */
const firstYear = (id: string) => chapter(id).years.split("–")[0];

const WORDS: Record<number, L> = {
  2: { sv: "två", en: "two" },
  3: { sv: "tre", en: "three" },
  10: { sv: "tio", en: "ten" },
};
const word = (n: number, lang: Lang) => WORDS[n]?.[lang] ?? String(n);

const r2015 = res(2015, "KWC — VM");
const srkc2015 = res(2015, "SRKC Linköping");
const r2016 = res(2016, "KWC — VM");
const r2018 = res(2018, "KWC — VM");
const r2021 = res(2021, "SRKC");
const r2026 = res(2026, "KWC — VM");
const f = STORY_FACTS;

export const JOURNEY: JourneyCard[] = [
  {
    id: "dalarna",
    year: String(f.kartStart.year),
    tag: { sv: "DALARNA", en: "DALARNA" },
    title: chapter("dalarna").title,
    text: {
      sv: `Första gokarten i Dalarna ${f.kartStart.year}, ${word(f.kartStart.age, "sv")} år gammal. Jag blev fast direkt.`,
      en: `My first go-kart in Dalarna in ${f.kartStart.year}, aged ${word(f.kartStart.age, "en")}. I was hooked straight away.`,
    },
  },
  {
    id: "banracing",
    year: firstYear("banracing"),
    tag: { sv: "BANRACING", en: "CIRCUIT RACING" },
    title: chapter("banracing").title,
    text: {
      sv: `${f.renault2007.place}:a totalt i Renault Junior Cup ${f.renault2007.year}. I Ginetta G20 Cup 2011 vann jag ${f.ginetta2011.wins} av ${f.ginetta2011.races} race.`,
      en: `${ordinalEn(f.renault2007.place)} overall in the ${f.renault2007.year} Renault Junior Cup. In the 2011 Ginetta G20 Cup I won ${f.ginetta2011.wins} of ${f.ginetta2011.races} races.`,
    },
  },
  {
    id: "genombrottet",
    year: String(srkc2015.year),
    tag: { sv: "HYRKART", en: "RENTAL KART" },
    title: chapter("genombrottet").title,
    text: {
      sv: `Jag vann första SRKC i Linköping och debuterade i VM i Italien: ${r2015.result.sv}.`,
      en: `I won the first SRKC in Linköping and made my Worlds debut in Italy: ${r2015.result.en}.`,
    },
  },
  {
    id: "bronset",
    year: String(r2016.year),
    tag: { sv: "VM-BRONS", en: "WORLDS BRONZE" },
    title: chapter("bronset").title,
    text: {
      sv: `Jag vann finalracet i Italien. ${r2016.result.sv} förare totalt, och VM-brons.`,
      en: `I won the final race in Italy. ${r2016.result.en} drivers overall, and a bronze medal.`,
    },
    image: {
      src: "/images/gallery-3.jpg",
      alt: { sv: "Prispallen i Italien 2016", en: "Podium in Italy, 2016" },
    },
  },
  {
    id: "jakten",
    year: String(r2018.year),
    tag: { sv: "JAKTEN", en: "THE CHASE" },
    title: { sv: "Polen", en: "Poland" },
    text: {
      sv: `${r2018.result.sv} i VM, med en klättring från ${f.climb2018.from}:e till ${f.climb2018.to}:e i finalracet. Samma år tog jag min andra SRKC-titel, i Göteborg.`,
      en: `${r2018.result.en} at the Worlds, climbing from ${ordinalEn(f.climb2018.from)} to ${ordinalEn(f.climb2018.to)} in the final race. That year I also took a second SRKC title, in Gothenburg.`,
    },
    image: {
      src: "/images/gallery-2.jpg",
      alt: { sv: "Fokus före start, Polen 2018", en: "Focus before the start, Poland 2018" },
    },
  },
  {
    id: "comeback",
    year: String(r2021.year),
    tag: { sv: "SRKC", en: "SRKC" },
    title: { sv: "Comebacken", en: "The comeback" },
    text: {
      sv: `${r2021.result.sv} i SRKC, ${r2021.note!.sv.toLowerCase()}.`,
      en: `${r2021.result.en} in the SRKC, ${r2021.note!.en.toLowerCase()}.`,
    },
    image: {
      src: "/images/gallery-1.jpg",
      alt: { sv: "Action på banan", en: "On-track action" },
    },
  },
  {
    id: "vandel",
    year: String(r2026.year),
    tag: { sv: "VANDEL", en: "VANDEL" },
    title: { sv: "KWC i Danmark", en: "KWC in Denmark" },
    text: {
      sv: `${KWC.venue}, ${KWC.driverCount} förare. ${cap(word(f.qualiPodiums2026, "sv"))} pallplatser i kvalheaten och semifinal. Jag slutade ${KWC.result2026.sv}.`,
      en: `${KWC.venue}, ${KWC.driverCount} drivers. ${cap(word(f.qualiPodiums2026, "en"))} podiums in the qualifying heats and a semifinal. I finished ${KWC.result2026.en}.`,
    },
    image: {
      src: "/images/gallery-5.jpg",
      alt: { sv: "Rickard i kartstolen med svenska flaggan på hjälmen", en: "Rickard in the kart, Swedish flag on his helmet" },
    },
  },
];

export type Channel = {
  name: string;
  handle: string;
  href: string;
  hrefEn?: string;
  external: boolean;
  icon: "instagram" | "facebook" | "flag" | "news" | "studio";
  text: L;
};

export const CHANNELS: Channel[] = [
  {
    name: "INSTAGRAM",
    handle: "@javva13",
    href: SOCIAL.instagram,
    external: true,
    icon: "instagram",
    text: { sv: "Bilder och korta uppdateringar från banan.", en: "Photos and short updates from the track." },
  },
  {
    name: "FACEBOOK",
    handle: "/rickardjavanainen",
    href: SOCIAL.facebook,
    external: true,
    icon: "facebook",
    text: { sv: "Längre inlägg om säsongen.", en: "Longer posts about the season." },
  },
  {
    name: "VM 2026",
    handle: "rickardjavanainen.se/vm-2026",
    href: "/vm-2026",
    hrefEn: "/en/vm-2026",
    external: false,
    icon: "flag",
    text: {
      sv: "Resultat, heat och banorna i Vandel.",
      en: "Results, heats and the Vandel track.",
    },
  },
  {
    name: "NYHETER",
    handle: "rickardjavanainen.se/nyheter",
    href: "/nyheter",
    hrefEn: "/en/news",
    external: false,
    icon: "news",
    text: { sv: "Racerapporter dag för dag från VM-veckan.", en: "Daily race reports from the Worlds week." },
  },
  {
    name: "STUDIO",
    handle: "studiojavanainen.se",
    href: STUDIO.url,
    external: true,
    icon: "studio",
    text: { sv: "Webbyrån jag driver. Den har byggt den här sajten.", en: "The web studio I run. It built this site." },
  },
];
