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
  /** 22 juli 2026 00:00 CEST */
  vmStart: Date.UTC(2026, 6, 21, 22, 0, 0),
  /** 25 juli 2026 00:00 CEST — countdown-mål (Nations Cup) */
  nationsCupStart: Date.UTC(2026, 6, 24, 22, 0, 0),
  /** 1 augusti 2026 24:00 CEST — VM slut */
  vmEnd: Date.UTC(2026, 7, 1, 22, 0, 0),
} as const;

export const TAGLINE = {
  sv: "För Sverige i hyrkart-VM · Vandel, Danmark · 22 juli–1 augusti 2026",
  en: "Racing for Sweden at the Kart World Championship · Vandel, Denmark · 22 July–1 August 2026",
} as const;

export const DEFAULT_TITLE = {
  sv: "Rickard Javanainen — Sveriges VM-förare i hyrkart | KWC 2026",
  en: "Rickard Javanainen — Sweden's Rental Kart World Championship Driver | KWC 2026",
} as const;

export const DEFAULT_DESCRIPTION = {
  sv: "Rickard Javanainen, VM-brons 2016, tävlar för Sverige i hyrkart-VM (KWC) på Vandel Kart i Danmark 22 juli–1 augusti 2026. Dagliga race-rapporter direkt från banan.",
  en: "Rickard Javanainen, 2016 World Championship bronze medalist, races for Sweden at the Kart World Championship at Vandel Kart, Denmark, 22 July–1 August 2026. Daily race reports straight from the track.",
} as const;
