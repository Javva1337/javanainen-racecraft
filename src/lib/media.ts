/**
 * Galleri med bildtexter i formatet "Beskrivning · Plats, År".
 * Plats/år verifierade av Rickard 2026-07-16.
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
    caption: { sv: "Action på banan · Spanien, 2017", en: "On-track action · Spain, 2017" },
    span: "col-span-2 row-span-2",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/gallery-2.jpg",
    alt: { sv: "Fokus före start", en: "Focus before the start" },
    caption: { sv: "Fokus före start · Polen, 2018", en: "Focus before the start · Poland, 2018" },
    width: 800,
    height: 800,
  },
  {
    src: "/images/gallery-3.jpg",
    alt: { sv: "Prispallen", en: "Podium" },
    caption: { sv: "Prispallen · Italien, 2016", en: "Podium · Italy, 2016" },
    width: 800,
    height: 800,
  },
  {
    src: "/images/gallery-4.jpg",
    alt: { sv: "Prispallen efter sprintvinst", en: "Podium after a sprint win" },
    caption: { sv: "Prispallen efter sprintvinst · Italien, 2016", en: "Podium after a sprint win · Italy, 2016" },
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
    alt: { sv: "Fokus på banan", en: "Focus on track" },
    caption: { sv: "Fokus på banan · Italien, 2016", en: "Focus on track · Italy, 2016" },
    span: "col-span-2",
    width: 1200,
    height: 600,
  },
];
