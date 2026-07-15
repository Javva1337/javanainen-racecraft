import { SITE_URL, SOCIAL } from "@/lib/site";

/** Globalt schema.org Person (athlete). */
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
      "Svensk hyrkartförare. Brons i Kart World Championship 2016. Tävlar för Sverige i KWC 2026 i Vandel, Danmark.",
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
    knowsAbout: ["Rental karting", "Kart World Championship", "Motorsport"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** SportsEvent för /vm-2026. */
export function SportsEventJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Kart World Championship 2026",
    alternateName: "Hyrkart-VM 2026",
    startDate: "2026-07-22",
    endDate: "2026-08-01",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Vandel Kart",
      address: { "@type": "PostalAddress", addressLocality: "Vandel", addressCountry: "DK" },
    },
    competitor: { "@id": `${SITE_URL}/#person` },
    description:
      "20:e upplagan av hyrkart-VM. 180 förare. Nations Cup 25–26 juli, KWC Individual 28 juli–1 augusti.",
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
}: {
  title: string;
  description: string;
  date: string;
  url: string;
  image: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    datePublished: date,
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
