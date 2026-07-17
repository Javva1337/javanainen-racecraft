import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { ChapterSection } from "./ChapterSection";
import { StintSequence } from "./StintSequence";

const chapter = CHAPTERS.find((c) => c.id === "genombrottet")!;

const COPY = {
  sv: {
    lede: "Tillbaka i karten — och allt föll på plats.",
    p1Highlight: "Vinnare av första upplagan av SRKC Linköping.",
    p1Rest: " Samma år: VM-debut i Italien, 11:e av 127 individuellt.",
    p2: "Men det var i Nations Cup som stinten kom att definiera året.",
  },
  en: {
    lede: "Back in the kart — and everything fell into place.",
    p1Highlight: "Winner of the inaugural SRKC in Linköping.",
    p1Rest: " The same year: a Worlds debut in Italy, 11th of 127 individually.",
    p2: "But it was in the Nations Cup that one stint came to define the year.",
  },
} as const;

/** Kapitel 03 — Genombrottet (2015): SRKC-vinst, VM-debut och Nations Cup-stinten. */
export function ChapterGenombrottet({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <div className="mt-12 space-y-5 text-base leading-relaxed text-mist sm:mt-16 sm:text-lg" data-chapter-copy>
        <p>
          <span className="text-snow">{t.p1Highlight}</span>
          {t.p1Rest}
        </p>
        <p>{t.p2}</p>
      </div>

      <StintSequence lang={lang} />
    </ChapterSection>
  );
}
