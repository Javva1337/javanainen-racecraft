/**
 * Galleri med bildtexter i formatet "Beskrivning · Plats, År".
 * OBS: Plats/år är utkast att verifiera mot faktiska bilder — beskrivningarna
 * kommer från gamla sajtens alt-texter.
 */
export type MediaItem = {
  src: string;
  alt: { sv: string; en: string };
  caption: { sv: string; en: string };
  span?: string;
  width: number;
  height: number;
};

export const MEDIA_ITEMS: MediaItem[] = [
  {
    src: "/images/gallery-1.jpg",
    alt: { sv: "Action på banan", en: "On-track action" },
    caption: { sv: "Action på banan · Sverige, 2021", en: "On-track action · Sweden, 2021" },
    span: "col-span-2 row-span-2",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/gallery-2.jpg",
    alt: { sv: "Fokus före start", en: "Focus before the start" },
    caption: { sv: "Fokus före start · Sverige, 2021", en: "Focus before the start · Sweden, 2021" },
    width: 800,
    height: 800,
  },
  {
    src: "/images/gallery-3.jpg",
    alt: { sv: "Podium", en: "Podium" },
    caption: { sv: "Podium · Italien, 2016", en: "Podium · Italy, 2016" },
    width: 800,
    height: 800,
  },
  {
    src: "/images/gallery-4.jpg",
    alt: { sv: "Strategi i depån", en: "Strategy in the paddock" },
    caption: { sv: "Strategi · Sverige, 2021", en: "Strategy · Sweden, 2021" },
    width: 800,
    height: 800,
  },
  {
    src: "/images/gallery-5.png",
    alt: { sv: "Hjälmen i närbild", en: "Helmet close-up" },
    caption: { sv: "Hjälmen · Sverige, 2026", en: "The helmet · Sweden, 2026" },
    width: 800,
    height: 800,
  },
  {
    src: "/images/gallery-6.jpg",
    alt: { sv: "Racing i regn", en: "Racing in the rain" },
    caption: { sv: "Racing i regn · Sverige, 2021", en: "Racing in the rain · Sweden, 2021" },
    span: "col-span-2",
    width: 1200,
    height: 600,
  },
];
