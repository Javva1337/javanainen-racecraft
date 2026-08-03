/**
 * Enda sanningskällan för sajtens fakta.
 * Alla datum, siffror och meriter hämtas härifrån — aldrig hårdkodade i sidor.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rickardjavanainen.se";

export const SITE_NAME = "Rickard Javanainen";
export const CONTACT_EMAIL = "rickard@rickardjavanainen.se";

export const SOCIAL = {
  instagram: "https://www.instagram.com/javva13/",
  facebook: "https://www.facebook.com/rickardjavanainen",
} as const;

/** Officiella livelänkar under VM-veckan — banans tidtagning och arrangörens sändning. */
export const LIVE = {
  timing:
    "https://modules.sms-timing.com/livetiming/?key=dmFuZGVsZ29rYXJ0OjM4M2ZiYzQ4LTdhNzMtNDJmZi1hN2FjLTBkODIzMTBiNDI1Ng%3d%3d",
  broadcast: "https://www.youtube.com/playlist?list=PLK9DNQIa52qg&si=64iWrII4nxaZ7x2s",
} as const;

/** Primab först — partner genom alla år av satsningen. Labatus ny för 2026. */
export const PARTNERS = [
  {
    name: "Primab",
    url: "https://primab.se",
    logo: "/images/partners/primab.png",
    /** Primab-loggan är mörkblå — behöver ljus chip */
    chip: "light",
  },
  {
    name: "Labatus",
    url: "https://labatus.se",
    logo: "/images/partners/labatus.svg",
    /** Labatus ordmärke är vitt — ska ligga direkt på mörk botten */
    chip: "dark",
  },
] as const;

/**
 * KWC 2026 — Vandel Kart, Danmark (Billund-området).
 * Tidsstämplar anges i CEST (UTC+2), dansk lokal tid.
 */
export const KWC = {
  edition: 20,
  driverCount: 180,
  venue: "Vandel Kart",
  place: { sv: "Vandel, Danmark", en: "Vandel, Denmark" },
  area: { sv: "Billund-området", en: "Billund area" },
  datesLabel: { sv: "22 juli–1 augusti 2026", en: "22 July–1 August 2026" },
  nationsCupLabel: { sv: "25–26 juli", en: "25–26 July" },
  individualLabel: { sv: "28 juli–1 augusti", en: "28 July–1 August" },
  trainingLabel: { sv: "22–24 juli", en: "22–24 July" },
  restDayLabel: { sv: "27 juli", en: "27 July" },
  /** 22 juli 2026 00:00 CEST */
  vmStart: Date.UTC(2026, 6, 21, 22, 0, 0),
  /** 25 juli 2026 00:00 CEST — countdown-mål (Nations Cup) */
  nationsCupStart: Date.UTC(2026, 6, 24, 22, 0, 0),
  /** 25 juli 2026 09:30 CEST — lottning av grupp A/B i Nations Cup */
  nationsCupDraw: Date.UTC(2026, 6, 25, 7, 30, 0),
  /** 26 juli 2026 20:10 CEST — final A i mål, Nations Cup avgjord */
  nationsCupEnd: Date.UTC(2026, 6, 26, 18, 10, 0),
  /** 1 augusti 2026 24:00 CEST — VM slut */
  vmEnd: Date.UTC(2026, 7, 1, 22, 0, 0),
  /** Slutresultat KWC Individual 2026 — semifinal, missade finalen */
  result2026: { sv: "41:a av 180", en: "41st of 180" },
  /** Nations Cup 2026 — Sveriges slutresultat i lagtävlingen (semifinal B, 14:e av 32) */
  nationsCupResult2026: { sv: "14:e av 32 nationer", en: "14th of 32 nations" },
  /** Slug för slutrapporten — länkas från after-lägets ytor */
  finalReportSlug: "vm-dag-11-vm-over-41a-av-180",
} as const;

export const TAGLINE = {
  sv: "Körde hyrkart-VM 2026 för Sverige — 41:a av 180 · Vandel, Danmark",
  en: "Raced for Sweden at the 2026 Kart World Championship — 41st of 180 · Vandel, Denmark",
} as const;

export const DEFAULT_TITLE = {
  sv: "Rickard Javanainen — svensk förare i hyrkart-VM | KWC 2026",
  en: "Rickard Javanainen — Sweden's Rental Kart World Championship Driver | KWC 2026",
} as const;

export const DEFAULT_DESCRIPTION = {
  sv: "Rickard Javanainen tog VM-brons 2016 och slutade 41:a av 180 förare i hyrkart-VM (KWC) 2026 på Vandel Kart i Danmark. Alla racerapporter från VM-veckan finns här.",
  en: "Rickard Javanainen, 2016 World Championship bronze medalist, finished 41st of 180 at the 2026 Kart World Championship at Vandel Kart, Denmark. All daily race reports from the week are here.",
} as const;
