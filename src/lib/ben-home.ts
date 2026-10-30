/**
 * Innehåll till startsidan (Ben 1:1-layout). Fakta hämtas från site.ts,
 * results.ts och career-story.ts — inga egna siffror här.
 */
import { CHAPTERS } from "./career-story";
import { KWC, SOCIAL, STUDIO } from "./site";
import { RESULTS, STORY_FACTS } from "./results";
import type { Lang } from "./dictionary";

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

const r2015 = res(2015, "KWC — VM");
const r2016 = res(2016, "KWC — VM");
const r2018 = res(2018, "KWC — VM");
const r2021 = res(2021, "SRKC");
const f = STORY_FACTS;

export const JOURNEY: JourneyCard[] = [
  {
    id: "dalarna",
    year: "2002",
    tag: { sv: "DALARNA", en: "DALARNA" },
    title: { sv: chapter("dalarna").title.sv, en: chapter("dalarna").title.en },
    text: {
      sv: "Första gokarten i Dalarna, tio år gammal. Direkt fast.",
      en: "First go-kart in Dalarna, aged ten. Hooked straight away.",
    },
  },
  {
    id: "banracing",
    year: "2007",
    tag: { sv: "BANRACING", en: "CIRCUIT RACING" },
    title: { sv: "Banracing", en: "Circuit racing" },
    text: {
      sv: `Tvåa totalt i Renault Junior Cup. 2011 vann jag ${f.ginetta2011.wins} av ${f.ginetta2011.races} race i Ginetta G20 Cup.`,
      en: `Runner-up in the Renault Junior Cup. In 2011 I won ${f.ginetta2011.wins} of ${f.ginetta2011.races} races in the Ginetta G20 Cup.`,
    },
  },
  {
    id: "genombrottet",
    year: "2015",
    tag: { sv: "HYRKART", en: "RENTAL KART" },
    title: { sv: "Genombrottet", en: "The breakthrough" },
    text: {
      sv: `Vann första SRKC i Linköping. VM-debut i Italien: ${r2015.result.sv}.`,
      en: `Won the first SRKC in Linköping. Worlds debut in Italy: ${r2015.result.en}.`,
    },
  },
  {
    id: "bronset",
    year: "2016",
    tag: { sv: "VM-BRONS", en: "WORLDS BRONZE" },
    title: { sv: "Bronset", en: "The bronze" },
    text: {
      sv: `Vann finalracet i Italien. ${r2016.result.sv} förare, VM-brons.`,
      en: `Won the final in Italy. ${r2016.result.en} drivers, bronze.`,
    },
    image: {
      src: "/images/gallery-3.jpg",
      alt: { sv: "Prispallen i Italien 2016", en: "Podium in Italy, 2016" },
    },
  },
  {
    id: "jakten",
    year: "2018",
    tag: { sv: "JAKTEN", en: "THE CHASE" },
    title: { sv: "Polen", en: "Poland" },
    text: {
      sv: `${r2018.result.sv} i VM. Från ${f.climb2018.from}:e till ${f.climb2018.to}:e i finalracet. Andra SRKC-titeln i Göteborg.`,
      en: `${r2018.result.en} at the Worlds. From ${f.climb2018.from}th to ${f.climb2018.to}th in the final race. Second SRKC title in Gothenburg.`,
    },
    image: {
      src: "/images/gallery-2.jpg",
      alt: { sv: "Fokus före start, Polen 2018", en: "Focus before the start, Poland 2018" },
    },
  },
  {
    id: "comeback",
    year: "2021",
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
    year: "2026",
    tag: { sv: "VANDEL", en: "VANDEL" },
    title: { sv: "KWC i Danmark", en: "KWC in Denmark" },
    text: {
      sv: `${KWC.venue}, ${KWC.driverCount} förare. Tre pallplatser i kvalheaten, semifinal, ${KWC.result2026.sv} totalt.`,
      en: `${KWC.venue}, ${KWC.driverCount} drivers. Three podiums in the qualifying heats, semifinal, ${KWC.result2026.en} overall.`,
    },
    image: {
      src: "/images/gallery-5.png",
      alt: { sv: "Hjälmen i närbild", en: "Helmet close-up" },
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
    text: { sv: "Längre inlägg och nyheter om säsongen.", en: "Longer posts and season news." },
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
    text: { sv: "Webbyrån jag driver, och som byggt den här sajten.", en: "The web studio I run, which built this site." },
  },
];
