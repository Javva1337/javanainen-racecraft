export type Lang = "sv" | "en";

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
    },
    footer: {
      builtIn: "Byggd i Sverige. Tävlar för Sverige.",
      rights: "Alla rättigheter förbehållna.",
      partnersHeading: "Partners",
      navHeading: "Sajten",
      press: "Press",
      newsletterHeading: "Följ resan till VM",
      newsletterText:
        "En rapport per dag under VM-veckan, direkt i inkorgen.",
    },
    newsletter: {
      placeholder: "din@epost.se",
      namePlaceholder: "Ditt namn",
      button: "Prenumerera",
      pending: "Skickar …",
      success:
        "Tack, du är anmäld! Race-rapporten kommer direkt i inkorgen under VM-veckan.",
      error: "Något gick fel. Prova igen, eller mejla",
      ariaLabel: "E-postadress för nyhetsbrevet",
      nameAriaLabel: "Ditt namn",
      consent:
        "Genom att anmäla dig sparar vi ditt namn och din e-post för att skicka rapporten. Avanmäl när som helst genom att mejla",
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
        "Race-rapporter, satsningen och vägen till hyrkart-VM 2026, skrivna av föraren själv.",
      all: "Alla",
      empty: "Inga artiklar i den här kategorin ännu.",
    },
    home: {
      countdownTo: "Nations Cup · Vandel, Danmark",
      days: "dagar",
      hours: "tim",
      minutes: "min",
      seconds: "sek",
      liveBanner: "VM pågår, läs dagens rapport →",
      afterBanner: "VM 2026 — så gick det →",
      latestNews: "Senaste nytt",
      allNews: "Alla nyheter →",
      followVm: "Följ VM här",
      becomePartner: "Bli partner",
      seeCareer: "Se karriären",
    },
    common: {
      readMore: "Läs mer",
      contact: "Kontakt",
      partnersLine: "VM-satsningen möjliggörs av Primab och Labatus",
      soundOn: "Slå på ljud",
      soundOff: "Stäng av ljud",
    },
  },
  en: {
    nav: {
      items: [
        { href: "/en", label: "Home" },
        { href: "/en/vm-2026", label: "Worlds 2026" },
        { href: "/en/news", label: "News" },
      ],
      openMenu: "Open menu",
      closeMenu: "Close menu",
      switchTo: "Svenska",
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
    },
    common: {
      readMore: "Read more",
      contact: "Contact",
      partnersLine: "The Worlds campaign is made possible by Primab and Labatus",
      soundOn: "Turn sound on",
      soundOff: "Turn sound off",
    },
  },
} as const;

export type Dictionary = (typeof DICT)["sv"] | (typeof DICT)["en"];

/** Motsvarande sida på det andra språket (för språkväxlaren + hreflang). */
export function altLangPath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (target === "en") {
    if (clean === "/") return "/en";
    if (clean === "/vm-2026") return "/en/vm-2026";
    if (clean === "/nyheter") return "/en/news";
    const article = clean.match(/^\/nyheter\/([^/]+)$/);
    if (article) return `/en/news/${article[1]}`;
    return "/en";
  }
  if (clean === "/en") return "/";
  if (clean === "/en/vm-2026") return "/vm-2026";
  if (clean === "/en/news") return "/nyheter";
  const article = clean.match(/^\/en\/news\/([^/]+)$/);
  if (article) return `/nyheter/${article[1]}`;
  return "/";
}
