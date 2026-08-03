export type Lang = "sv" | "en";

import type { Category } from "./content";
import { KWC } from "./site";

/** Kategorinycklarna i frontmatter är svenska — bara visningen översätts. */
const CATEGORY_LABELS_EN: Record<Category, string> = {
  "VM 2026": "Worlds 2026",
  SRKC: "SRKC",
  Satsningen: "The campaign",
  Partners: "Partners",
};

export function categoryLabel(category: string, lang: Lang): string {
  if (lang === "sv") return category;
  return CATEGORY_LABELS_EN[category as Category] ?? category;
}

/** All UI-copy för båda språken. Sidinnehåll ligger i respektive sida/MDX. */
export const DICT = {
  sv: {
    nav: {
      items: [
        { href: "/", label: "Hem" },
        { href: "/vm-2026", label: "VM 2026" },
        { href: "/nyheter", label: "Nyheter" },
        { href: "/karriar", label: "Karriär" },
        { href: "/om", label: "Om" },
        { href: "/partners", label: "Partners" },
        { href: "/media", label: "Media" },
        { href: "/kontakt", label: "Kontakt" },
      ],
      openMenu: "Öppna menyn",
      closeMenu: "Stäng menyn",
      switchTo: "English",
      /** Headerns tävlings-chip — etiketten följer sajtläget. Kort, en rad. */
      cta: {
        before: "Nations Cup",
        during: "Live",
        after: "Så gick VM",
        ariaLabel: "Aktuell tävling: Nations Cup",
      },
    },
    footer: {
      builtIn: "Byggd i Sverige. Tävlar för Sverige.",
      rights: "Alla rättigheter förbehållna.",
      partnersHeading: "Partners",
      navHeading: "Sajten",
      press: "Press",
      newsletterHeading: "Nyhetsbrevet",
      newsletterText:
        "Nya racerapporter och nyheter om satsningen, direkt i inkorgen.",
    },
    newsletter: {
      placeholder: "din@epost.se",
      namePlaceholder: "Ditt namn",
      button: "Få rapporterna direkt i mejlen",
      pending: "Skickar …",
      success:
        "Tack, du är anmäld! Nya racerapporter kommer direkt i inkorgen.",
      error: "Något gick fel. Prova igen, eller mejla",
      ariaLabel: "E-postadress för nyhetsbrevet",
      nameAriaLabel: "Ditt namn",
      consent:
        "Genom att anmäla dig sparar vi ditt namn och din e-post för att skicka rapporten. Avanmäl när som helst genom att mejla",
    },
    contactForm: {
      name: "Namn",
      namePlaceholder: "Ditt namn",
      email: "E-post",
      emailPlaceholder: "din@epost.se",
      message: "Meddelande",
      messagePlaceholder: "Ditt meddelande...",
      send: "Skicka förfrågan",
      pending: "Skickar …",
      success: "Tack för ditt meddelande! Jag återkommer så snart jag kan.",
      error: "Något gick fel. Prova igen, eller mejla",
      mailtoSubject: (name: string) => `Kontakt från ${name}`,
    },
    article: {
      readingTime: (min: number) => `${min} min läsning`,
      published: "Publicerad",
      day: (day: number) => `VM · Dag ${day}`,
      factBox: {
        heading: "Dagens siffror",
        heatsRaced: "Heat körda",
        bestFinish: "Bästa placering",
        bestFinishToday: "Bästa placering idag",
        standing: "Totalställning",
        nationsCup: "Nations Cup — Sverige",
      },
      share: {
        heading: "Dela",
        copy: "Kopiera länk",
        copied: "Kopierad!",
      },
      fallbackNotice: null as string | null,
      backToList: "Alla nyheter",
      tomorrowHeading: "Imorgon",
    },
    news: {
      title: "Nyheter",
      description:
        "Racerapporter och berättelser från vägen till hyrkart-VM 2026, skrivna av föraren själv. Under VM publicerades en ny rapport varje tävlingskväll.",
      all: "Alla nyheter",
      empty: "Inga artiklar i den här kategorin ännu.",
    },
    home: {
      countdownTo: "Nations Cup, lagtävlingen · Vandel, Danmark",
      days: "dagar",
      hours: "tim",
      minutes: "min",
      seconds: "sek",
      liveBanner: "VM pågår, läs dagens rapport →",
      afterBanner: "VM 2026 — så gick det →",
      latestNews: "Senaste nytt",
      allNews: "Alla nyheter →",
      followVm: "Följ VM-rapporterna",
      becomePartner: "Se möjligheter som partner",
      seeCareer: "Se karriären",
      /** "Just nu"-teasern för aktuell tävling, direkt under hjälten */
      nowKicker: "Just nu",
      nowTitle: "Nations Cup — lagtävlingen i VM",
      nowDrawBefore:
        "Lottningen av grupp A och B sker lördag 25 juli kl 09:30 — den avgör om Sverige kör sin semifinal 15:45 eller 18:10.",
      nowDrawPending:
        "Lottningen är genomförd — resultatet uppdateras här inom kort.",
      nowDrawDone: (result: string, start: string) =>
        `Lottningen är klar: Sverige kör semifinal ${result} med start ${start} på lördagen.`,
      nowAfter:
        "VM 2026 är avslutat. Rickard tog sig till semifinal och slutade 41:a av 180 förare. Tack till alla som följt rapporterna under veckan — alla finns kvar att läsa.",
      nowCta: "Tidsschema, format och Sveriges lag →",
      heroNc: "Nations Cup · 25–26 juli",
      /** Efter Nations Cup flyttas teaserns fokus till individuella VM */
      nowTitleInd: "KWC Individual — individuella VM",
      nowAfterInd:
        `Nations Cup är avgjord — Sverige slutade ${KWC.nationsCupResult2026.sv}. Från tisdag 28 juli väntar det individuella mästerskapet, där Rickard kör åtta kvalheat innan semifinal och final.`,
      nowCtaInd: "Följ det individuella VM:t →",
      nowReport: "Läs finalrapporten från Nations Cup →",
      nowReportFinal: "Läs slutrapporten från VM →",
      heroInd: "Individuella VM · 28 juli–1 augusti",
      /** Banteasern på startsidan — layouterna med onboard-varven */
      tracksHeading: "Så ser årets VM-banor ut",
      tracksIntro:
        "Vandel Gokart körs i två layouter under VM-veckan. Hela Nations Cup körs på VG Classic, medan det individuella mästerskapet alternerar mellan båda — Classic dag 1 och 3, New 23 dag 2 och 4, och inför semifinal och final lottas layouten samma dag. Följ med på ett träningspass på vardera, inklusive layouternas specialare: depåstoppet på Classic och genvägen på New 23.",
      tracksOnboard: "Följ med på ett träningspass →",
      tracksMore: "Mer om banan och layouterna →",
    },
    /** "Efter VM"-recapen — teaser på startsidan + full sektion på /vm-2026 */
    recap: {
      kicker: "VM 2026 · Vandel, Danmark",
      teaserHeading: "Så gick VM",
      teaserCta: "Se hela VM-resan →",
      heading: "VM 2026 — så gick det",
      intro: (result: string) =>
        `Rickard gick till semifinal och slutade ${result} förare. Här är veckan i siffror — varje punkt i kurvan länkar till den dagens rapport.`,
      statFinal: "Slutplacering",
      statHeats: "Körda heat",
      statPodiums: "Pallplatser i kvalheaten",
      statSemi: "Så långt räckte det",
      statSemiValue: "Semifinal",
      journeyHeading: "Resan genom veckan",
      journeyIntro:
        "Placering i totalen efter varje tävlingsdag i det individuella mästerskapet.",
      ncLabel: (position: string) => `Nations Cup · ${position}`,
      chartAria: "Kurva över totalplaceringen dag för dag under VM-veckan",
      dayAria: (day: number, standing: number) =>
        `Dag ${day}: plats ${standing} i totalen — läs dagsrapporten`,
      finalReportCta: "Läs slutrapporten från VM →",
    },
    common: {
      readMore: "Läs mer",
      contact: "Kontakt",
      partnersLine: "VM-satsningen möjliggjordes av Primab och Labatus",
      soundOn: "Slå på ljud",
      soundOff: "Stäng av ljud",
    },
    /** Livelänkarna — det läsarna letar efter under tävlingsdagarna */
    live: {
      heading: "Följ racen live",
      timingLabel: "Live-timing",
      timingDesc: "Varvtider och positioner i realtid, direkt från banans tidtagning",
      broadcastLabel: "Livesändning",
      broadcastDesc: "Racen direkt på arrangörens YouTube-kanal",
    },
  },
  en: {
    nav: {
      items: [
        { href: "/en", label: "Home" },
        { href: "/en/vm-2026", label: "Worlds 2026" },
        { href: "/en/news", label: "News" },
        { href: "/en/career", label: "Career" },
        { href: "/en/about", label: "About" },
        { href: "/en/partners", label: "Partners" },
        { href: "/en/media", label: "Media" },
        { href: "/en/contact", label: "Contact" },
      ],
      openMenu: "Open menu",
      closeMenu: "Close menu",
      switchTo: "Svenska",
      cta: {
        before: "Nations Cup",
        during: "Live",
        after: "How it went",
        ariaLabel: "Current competition: Nations Cup",
      },
    },
    footer: {
      builtIn: "Built in Sweden. Racing for Sweden.",
      rights: "All rights reserved.",
      partnersHeading: "Partners",
      navHeading: "Site",
      press: "Press",
      newsletterHeading: "The newsletter",
      newsletterText: "New race reports and campaign news, straight to your inbox.",
    },
    newsletter: {
      placeholder: "you@email.com",
      namePlaceholder: "Your name",
      button: "Subscribe",
      pending: "Sending …",
      success:
        "Thanks, you're signed up! New race reports will land in your inbox.",
      error: "Something went wrong. Try again, or email",
      ariaLabel: "Email address for the newsletter",
      nameAriaLabel: "Your name",
      consent:
        "By signing up you let us store your name and email to send the report. Unsubscribe anytime by emailing",
    },
    contactForm: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      message: "Message",
      messagePlaceholder: "Your message...",
      send: "Send",
      pending: "Sending …",
      success: "Thanks for your message! I'll get back to you as soon as I can.",
      error: "Something went wrong. Try again, or email",
      mailtoSubject: (name: string) => `Contact from ${name}`,
    },
    article: {
      readingTime: (min: number) => `${min} min read`,
      published: "Published",
      day: (day: number) => `Worlds · Day ${day}`,
      factBox: {
        heading: "Today's numbers",
        heatsRaced: "Heats raced",
        bestFinish: "Best finish",
        bestFinishToday: "Best finish today",
        standing: "Overall standing",
        nationsCup: "Nations Cup — Sweden",
      },
      share: {
        heading: "Share",
        copy: "Copy link",
        copied: "Copied!",
      },
      fallbackNotice:
        "This article has not been translated yet, so the Swedish original is shown." as string | null,
      backToList: "All news",
      tomorrowHeading: "Tomorrow",
    },
    news: {
      title: "News",
      description:
        "Race reports, the campaign and the road to the 2026 Kart World Championship, written by the driver himself.",
      all: "All",
      empty: "No articles in this category yet.",
    },
    home: {
      countdownTo: "Nations Cup · Vandel, Denmark",
      days: "days",
      hours: "hrs",
      minutes: "min",
      seconds: "sec",
      liveBanner: "The Worlds are live, read today's report →",
      afterBanner: "Worlds 2026 — how it went →",
      latestNews: "Latest news",
      allNews: "All news →",
      followVm: "Follow the Worlds",
      becomePartner: "Become a partner",
      seeCareer: "See the career",
      nowKicker: "Right now",
      nowTitle: "Nations Cup — the Worlds team event",
      nowDrawBefore:
        "The group A/B draw takes place Saturday 25 July at 09:30 — it decides whether Sweden races its semifinal at 15:45 or 18:10.",
      nowDrawPending: "The draw is done — the result will be posted here shortly.",
      nowDrawDone: (result: string, start: string) =>
        `The draw is done: Sweden races semifinal ${result}, starting ${start} on Saturday.`,
      nowAfter:
        "The 2026 Worlds are over. Rickard reached the semifinal and finished 41st of 180 drivers. Thank you to everyone who followed the reports during the week — they are all still here to read.",
      nowCta: "Follow the Nations Cup →",
      heroNc: "Nations Cup · 25–26 July",
      nowTitleInd: "KWC Individual — the individual Worlds",
      nowAfterInd:
        `The Nations Cup is decided — Sweden finished ${KWC.nationsCupResult2026.en}. From Tuesday 28 July the individual championship takes over, with Rickard racing eight qualifying heats before the semifinal and final.`,
      nowCtaInd: "Follow the individual Worlds →",
      nowReport: "Read the Nations Cup final report →",
      nowReportFinal: "Read the final report from the Worlds →",
      heroInd: "Individual Worlds · 28 July–1 August",
      tracksHeading: "This year's Worlds track layouts",
      tracksIntro:
        "Vandel Gokart runs two layouts during the Worlds week. The entire Nations Cup is raced on VG Classic, while the individual championship alternates between the two — Classic on days 1 and 3, New 23 on days 2 and 4, with the semifinal and final layout drawn on the day. Ride along for a training session on each, including each layout's special feature: the pit stop on Classic and the shortcut on New 23.",
      tracksOnboard: "Ride along for a training session →",
      tracksMore: "More about the track and layouts →",
    },
    /** Post-Worlds recap — home teaser + full section on /en/vm-2026 */
    recap: {
      kicker: "Worlds 2026 · Vandel, Denmark",
      teaserHeading: "How the Worlds went",
      teaserCta: "See the full Worlds journey →",
      heading: "Worlds 2026 — how it went",
      intro: (result: string) =>
        `Rickard reached the semifinal and finished ${result} drivers. Here is the week in numbers — every point on the curve links to that day's report.`,
      statFinal: "Final standing",
      statHeats: "Heats raced",
      statPodiums: "Podiums in the qualifying heats",
      statSemi: "How far it went",
      statSemiValue: "Semifinal",
      journeyHeading: "The journey through the week",
      journeyIntro:
        "Overall standing after each race day of the individual championship.",
      // Fungerar för svenska ordningstal på formen "-:e" (t.ex. "14:e av 32" → "14th of 32").
      // Bryts formatet fångas det av dictionary-testet.
      ncLabel: (position: string) =>
        `Nations Cup · ${position.replace(":e av", "th of")}`,
      chartAria: "Chart of the overall standing day by day during the Worlds week",
      dayAria: (day: number, standing: number) =>
        `Day ${day}: ${standing} overall — read the daily report`,
      finalReportCta: "Read the final report from the Worlds →",
    },
    common: {
      readMore: "Read more",
      contact: "Contact",
      partnersLine: "The Worlds campaign was made possible by Primab and Labatus",
      soundOn: "Turn sound on",
      soundOff: "Turn sound off",
    },
    live: {
      heading: "Follow the racing live",
      timingLabel: "Live timing",
      timingDesc: "Lap times and positions in real time, straight from the track",
      broadcastLabel: "Live stream",
      broadcastDesc: "The races live on the organiser's YouTube channel",
    },
  },
} as const;

export type Dictionary = (typeof DICT)["sv"] | (typeof DICT)["en"];

/** Statiska sidpar (sv ↔ en). Artikelsidor hanteras med regex nedan. */
const PATH_MAP: ReadonlyArray<readonly [string, string]> = [
  ["/", "/en"],
  ["/vm-2026", "/en/vm-2026"],
  /** SV-only-sida — språkväxlaren landar på närmaste engelska motsvarighet.
      Måste ligga EFTER /vm-2026-paret: en→sv-uppslaget tar första träffen. */
  ["/vm-2026/nations-cup", "/en/vm-2026"],
  ["/nyheter", "/en/news"],
  ["/karriar", "/en/career"],
  ["/om", "/en/about"],
  ["/partners", "/en/partners"],
  ["/media", "/en/media"],
  ["/kontakt", "/en/contact"],
  ["/press", "/en/press"],
];

/** Motsvarande sida på det andra språket (för språkväxlaren + hreflang). */
export function altLangPath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (target === "en") {
    const pair = PATH_MAP.find(([sv]) => sv === clean);
    if (pair) return pair[1];
    const article = clean.match(/^\/nyheter\/([^/]+)$/);
    if (article) return `/en/news/${article[1]}`;
    return "/en";
  }
  const pair = PATH_MAP.find(([, en]) => en === clean);
  if (pair) return pair[0];
  const article = clean.match(/^\/en\/news\/([^/]+)$/);
  if (article) return `/nyheter/${article[1]}`;
  return "/";
}
