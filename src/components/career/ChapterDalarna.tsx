import { Kurbits } from "@/components/Kurbits";
import { CHAPTERS } from "@/lib/career-story";
import { BackdropYear } from "./BackdropYear";
import { ChapterSection } from "./ChapterSection";

const chapter = CHAPTERS.find((c) => c.id === "dalarna")!;

/** Kapitel 01 — Dalarna (2002–2006). Där det började: första gokarten, tio år gammal. */
export function ChapterDalarna() {
  return (
    <ChapterSection chapter={chapter} lede="Tio år gammal. Första gokarten.">
      <BackdropYear year="2002" className="-right-8 top-4 sm:-right-16" />

      <div className="relative mt-12 grid gap-10 sm:mt-16 sm:grid-cols-[3fr_2fr] sm:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
          <p>
            Första steget in i motorsport togs 2002, i en gokart i Dalarna. Tio år gammal, och
            direkt fast.
          </p>
          <p>
            Åren som följde, 2002–2006, blev flera år av utveckling genom olika gokartklasser —
            med flertalet vinster och pallplatser längs vägen.
          </p>
        </div>

        {/* Inga arkivbilder från åren finns bevarade — grafisk platta med kurbitslinje */}
        <figure
          className="flex aspect-[4/5] flex-col items-center justify-center gap-6 border border-line bg-midnight-800 p-8"
          data-chapter-plate
        >
          <Kurbits className="w-40 text-flagblue" />
          <figcaption className="heading-caps text-center text-[0.65rem] tracking-[0.18em] text-mist-dim">
            Där det började <span aria-hidden="true">·</span> Dalarna, 2002
          </figcaption>
        </figure>
      </div>
    </ChapterSection>
  );
}
