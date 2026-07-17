import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { BronzeSequence } from "./BronzeSequence";
import { ChapterSection } from "./ChapterSection";

const chapter = CHAPTERS.find((c) => c.id === "bronset")!;

const COPY = {
  sv: { lede: "VM i Italien. Året då det bar hela vägen till pallen." },
  en: { lede: "The Worlds in Italy. The year it went all the way to the podium." },
} as const;

/** Kapitel 04 — Bronset (2016). Berättelsens klimax: vinst i finalen, 3:e av 102. */
export function ChapterBronset({ lang }: { lang: Lang }) {
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={COPY[lang].lede}>
      <BronzeSequence lang={lang} />
    </ChapterSection>
  );
}
