import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { ChapterSection } from "./ChapterSection";
import { ClimbCounter } from "./ClimbCounter";
import { FieldCounter } from "./FieldCounter";
import { GalleryStripe, type StripeItem } from "./GalleryStripe";

const chapter = CHAPTERS.find((c) => c.id === "jakten")!;

/** Bildtexter "Plats, År" — samma verifierade uppgifter som i lib/media.ts. */
const STRIPE_ITEMS: Record<Lang, StripeItem[]> = {
  sv: [
    {
      kind: "image",
      src: "/images/gallery-1.jpg",
      alt: "Action på banan i VM 2017",
      caption: "Spanien, 2017",
    },
    {
      kind: "image",
      src: "/images/gallery-2.jpg",
      alt: "Fokus före start i VM 2018",
      caption: "Polen, 2018",
    },
    {
      kind: "stat",
      years: "SRKC · 2021",
      value: "6:a",
      label: "totalt i finalen, näst bäst av svenskarna.",
    },
  ],
  en: [
    {
      kind: "image",
      src: "/images/gallery-1.jpg",
      alt: "On-track action at the 2017 Worlds",
      caption: "Spain, 2017",
    },
    {
      kind: "image",
      src: "/images/gallery-2.jpg",
      alt: "Focus before the start at the 2018 Worlds",
      caption: "Poland, 2018",
    },
    {
      kind: "stat",
      years: "SRKC · 2021",
      value: "6th",
      label: "overall in the final — second-best Swede.",
    },
  ],
};

const COPY = {
  sv: {
    lede: "Spanien, Göteborg, Polen. Jämnheten byggdes race för race.",
    srkcPre: "2018 kom den andra SRKC-titeln: ",
    srkcHighlight: "vinst i SRKC Göteborg.",
    srkcPost: " Och i VM i Polen samma år, ett finalrace att minnas:",
    galleryHint: "Scrolla för att utforska",
  },
  en: {
    lede: "Spain, Gothenburg, Poland. The consistency was built race by race.",
    srkcPre: "2018 brought the second SRKC title: ",
    srkcHighlight: "a win in SRKC Gothenburg.",
    srkcPost: " And at the Worlds in Poland that year, a final race to remember:",
    galleryHint: "Scroll to explore",
  },
} as const;

/** Kapitel 05 — Jakten (2017–2021): största startfältet, andra SRKC-titeln, klättringen i Polen. */
export function ChapterJakten({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      {/* Spanien 2017 — det bärande talet */}
      <div className="mt-12 sm:mt-16">
        <FieldCounter lang={lang} />
      </div>

      {/* SRKC Göteborg 2018 — andra titeln */}
      <p className="mt-14 max-w-2xl text-base leading-relaxed text-mist sm:mt-20 sm:text-lg">
        {t.srkcPre}
        <span className="text-snow">{t.srkcHighlight}</span>
        {t.srkcPost}
      </p>

      <div className="mt-8">
        <ClimbCounter lang={lang} />
      </div>

      <GalleryStripe items={STRIPE_ITEMS[lang]} hint={t.galleryHint} />
    </ChapterSection>
  );
}
