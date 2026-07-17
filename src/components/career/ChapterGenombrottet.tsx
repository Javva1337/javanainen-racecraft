import { CHAPTERS } from "@/lib/career-story";
import { ChapterSection } from "./ChapterSection";
import { StintSequence } from "./StintSequence";

const chapter = CHAPTERS.find((c) => c.id === "genombrottet")!;

/** Kapitel 03 — Genombrottet (2015): SRKC-vinst, VM-debut och Nations Cup-stinten. */
export function ChapterGenombrottet() {
  return (
    <ChapterSection chapter={chapter} lang="sv" lede="Tillbaka i karten — och allt föll på plats.">
      <div className="mt-12 space-y-5 text-base leading-relaxed text-mist sm:mt-16 sm:text-lg" data-chapter-copy>
        <p>
          <span className="text-snow">Vinnare av första upplagan av SRKC Linköping.</span> Samma
          år: VM-debut i Italien, 11:e av 127 individuellt.
        </p>
        <p>Men det var i Nations Cup som stinten kom att definiera året.</p>
      </div>

      <StintSequence />
    </ChapterSection>
  );
}
