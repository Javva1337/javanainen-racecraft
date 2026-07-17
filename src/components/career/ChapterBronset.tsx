import { CHAPTERS } from "@/lib/career-story";
import { BronzeSequence } from "./BronzeSequence";
import { ChapterSection } from "./ChapterSection";

const chapter = CHAPTERS.find((c) => c.id === "bronset")!;

/** Kapitel 04 — Bronset (2016). Berättelsens klimax: vinst i finalen, 3:e av 102. */
export function ChapterBronset() {
  return (
    <ChapterSection chapter={chapter} lede="VM i Italien. Året då det bar hela vägen till pallen.">
      <BronzeSequence />
    </ChapterSection>
  );
}
