export type Lang = "sv" | "en";

import type { Category } from "./content";

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
      newsletterHeading: "Få rapporterna från VM",
      newsletterText:
        "En rapport per dag under VM-veckan, direkt i inkorgen.",
    },
    newsletter: {
      placeholder: "din@epost.se",
      namePlaceholder: "Ditt namn",
      button: "Få rapporterna direkt i mejlen",
      pending: "Skickar …",
      success:
        "Tack, du är anmäld! Racerapporten kommer direkt i inkorgen under VM-veckan.",
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
        "Racerapporter och berättelser från vägen till hyrkart-VM 2026, skrivna av föraren själv. Under VM publiceras en ny rapport varje tävlingskväll.",
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
      nowAfter: "Nations Cup är avgjord — så gick det för Sverige.",
      nowCta: "Tidsschema, format och Sveriges lag →",
      heroNc: "Nations Cup · 25–26 juli",
      /** Banteasern på startsidan — layouterna med onboard-varven */
      tracksHeading: "Så ser årets VM-banor ut",
      tracksIntro:
        "Vandel Gokart körs i två layouter under VM-veckan — hela Nations Cup körs på VG Classic, medan VG New 23 används i det individuella mästerskapet. Följ med runt ett varv på vardera.",
      tracksOnboard: "Se ett varv onboard →",
      tracksMore: "Mer om banan och layouterna →",
    },
    common: {
      readMore: "Läs mer",
      contact: "Kontakt",
      partnersLine: "VM-satsningen möjliggörs av Primab och Labatus",
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
      newsletterHeading: "Follow the road to the Worlds",
      newsletterText: "One report per day during championship week, straight to your inbox.",
    },
    newsletter: {
      placeholder: "you@email.com",
      namePlaceholder: "Your name",
      button: "Subscribe",
      pending: "Sending …",
      success:
        "Thanks, you're signed up! The race report lands in your inbox during championship week.",
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
      nowAfter: "The Nations Cup is decided — here's how it went for Sweden.",
      nowCta: "Follow the Nations Cup →",
      heroNc: "Nations Cup · 25–26 July",
      tracksHeading: "This year's Worlds track layouts",
      tracksIntro:
        "Vandel Gokart runs two layouts during the Worlds week — the entire Nations Cup is raced on VG Classic, while VG New 23 is used in the individual championship. Ride along for a lap of each.",
      tracksOnboard: "Watch an onboard lap →",
      tracksMore: "More about the track and layouts →",
    },
    common: {
      readMore: "Read more",
      contact: "Contact",
      partnersLine: "The Worlds campaign is made possible by Primab and Labatus",
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
