import { KWC, LIVE, SITE_URL, SOCIAL } from "@/lib/site";

/** Delade byggstenar för KWC-eventen — Search Console vill ha fälten på varje eventnod. */
const KWC_PLACE = {
  "@type": "Place",
  name: "Vandel Kart",
  address: { "@type": "PostalAddress", addressLocality: "Vandel", addressCountry: "DK" },
};

const KWC_ORGANIZER = {
  "@type": "Organization",
  name: "Kart World Championship",
  url: "https://kartworldchampionship.com",
};

/** Fullt Person-objekt (inte bara @id) så att Googles parser hittar namnet i varje block. */
const KWC_PERFORMER = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Rickard Javanainen",
};

/**
 * Fält som Google kräver (location) eller rekommenderar (eventStatus, organizer,
 * image, offers, eventAttendanceMode) på varje Event — subEvents räknas som egna
 * eventnoder i Search Console. Eventet går att följa på plats eller via arrangörens
 * gratis livesändning, därav MixedEventAttendanceMode och ett 0-priserbjudande.
 */
function kwcEventFields(lang: "sv" | "en") {
  return {
    location: [KWC_PLACE, { "@type": "VirtualLocation", url: LIVE.broadcast }],
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: KWC_ORGANIZER,
    image: [`${SITE_URL}/images/hero-poster.jpg`, `${SITE_URL}/images/portrait.jpg`],
    offers: {
      "@type": "Offer",
      name: lang === "sv" ? "Gratis livesändning på YouTube" : "Free live stream on YouTube",
      url: LIVE.broadcast,
      price: "0",
      priceCurrency: "DKK",
      availability: "https://schema.org/InStock",
      validFrom: "2026-07-22",
    },
  };
}

/** Globalt schema.org Person (athlete). Meriter hämtas ur kanoniska fakta. */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Rickard Javanainen",
    url: SITE_URL,
    image: `${SITE_URL}/images/portrait.jpg`,
    nationality: { "@type": "Country", name: "Sverige" },
    jobTitle: "Racingförare — hyrkart",
    description:
      `Svensk hyrkartförare. Brons i Kart World Championship 2016. Tävlade för Sverige i KWC 2026 i Vandel, Danmark — ${KWC.result2026.sv}.`,
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
    knowsAbout: ["Rental karting", "Kart World Championship", "Motorsport"],
    knowsLanguage: ["sv", "en"],
    award: [
      "Brons, Kart World Championship 2016 (3:e av 102, vinst i finalen)",
      "VM-finalist 2015, 2016, 2017 och 2018",
      "Vinnare SRKC Linköping 2015",
      "Vinnare SRKC Göteborg 2018",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Globalt schema.org WebSite — kopplar sajten till personen. */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Rickard Javanainen",
    url: SITE_URL,
    inLanguage: ["sv-SE", "en"],
    publisher: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** SportsEvent för /vm-2026, med Nations Cup och Individual som subEvents. */
export function SportsEventJsonLd({ lang = "sv" }: { lang?: "sv" | "en" }) {
  const shared = kwcEventFields(lang);
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Kart World Championship 2026",
    alternateName: "Hyrkart-VM 2026",
    sport: "Rental karting",
    startDate: "2026-07-22",
    endDate: "2026-08-01",
    ...shared,
    competitor: KWC_PERFORMER,
    performer: KWC_PERFORMER,
    subEvent: [
      {
        "@type": "SportsEvent",
        name: "KWC Training 2026",
        startDate: "2026-07-22",
        endDate: "2026-07-24",
        ...shared,
        performer: KWC_PERFORMER,
      },
      {
        "@type": "SportsEvent",
        name: "KWC Nations Cup 2026",
        startDate: "2026-07-25",
        endDate: "2026-07-26",
        ...shared,
        performer: KWC_PERFORMER,
      },
      {
        "@type": "SportsEvent",
        name: "KWC Individual 2026",
        startDate: "2026-07-28",
        endDate: "2026-08-01",
        ...shared,
        performer: KWC_PERFORMER,
      },
    ],
    inLanguage: lang === "sv" ? "sv-SE" : "en",
    description:
      lang === "sv"
        ? "20:e upplagan av hyrkart-VM. 180 förare. Träning 22–24 juli, Nations Cup 25–26 juli, KWC Individual 28 juli–1 augusti."
        : "The 20th edition of the rental kart World Championship. 180 drivers. Training 22–24 July, Nations Cup 25–26 July, KWC Individual 28 July–1 August.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** SportsEvent för /vm-2026/nations-cup, med semifinaler och finaler som subEvents. */
export function NationsCupJsonLd() {
  const shared = kwcEventFields("sv");
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "KWC Nations Cup 2026",
    alternateName: "Nations Cup — lagtävlingen i hyrkart-VM 2026",
    sport: "Rental karting",
    startDate: "2026-07-25",
    endDate: "2026-07-26",
    ...shared,
    competitor: KWC_PERFORMER,
    performer: KWC_PERFORMER,
    superEvent: {
      "@type": "SportsEvent",
      name: "Kart World Championship 2026",
      startDate: "2026-07-22",
      endDate: "2026-08-01",
      ...shared,
      performer: KWC_PERFORMER,
    },
    // Sverige körde semifinal B och gick vidare till final A — performer sätts
    // bara på de delmoment där laget faktiskt ställde upp.
    subEvent: [
      {
        "@type": "SportsEvent",
        name: "Nations Cup semifinal A",
        startDate: "2026-07-25T15:45:00+02:00",
        endDate: "2026-07-25T17:45:00+02:00",
        ...shared,
      },
      {
        "@type": "SportsEvent",
        name: "Nations Cup semifinal B",
        startDate: "2026-07-25T18:10:00+02:00",
        endDate: "2026-07-25T20:10:00+02:00",
        ...shared,
        performer: KWC_PERFORMER,
      },
      {
        "@type": "SportsEvent",
        name: "Nations Cup final B",
        startDate: "2026-07-26T11:45:00+02:00",
        endDate: "2026-07-26T15:45:00+02:00",
        ...shared,
      },
      {
        "@type": "SportsEvent",
        name: "Nations Cup final A",
        startDate: "2026-07-26T16:10:00+02:00",
        endDate: "2026-07-26T20:10:00+02:00",
        ...shared,
        performer: KWC_PERFORMER,
      },
    ],
    inLanguage: "sv-SE",
    description:
      `Lagtävlingen i hyrkart-VM 2026. Semifinaler 25 juli, finaler 26 juli på Vandel Kart i Danmark. Sverige körde med fyra förare, gick till semifinal B och slutade ${KWC.nationsCupResult2026.sv}.`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** NewsArticle per artikel. */
export function NewsArticleJsonLd({
  title,
  description,
  date,
  url,
  image,
  lang,
}: {
  title: string;
  description: string;
  date: string;
  url: string;
  image: string;
  lang: "sv" | "en";
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: lang === "sv" ? "sv-SE" : "en",
    url,
    image: [image],
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: url,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQPage-schema — frågorna måste vara samma text som syns på sidan. */
export function FaqJsonLd({ items }: { items: Array<{ q: string; a: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
