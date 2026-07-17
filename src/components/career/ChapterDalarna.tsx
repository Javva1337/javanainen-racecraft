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

        {/* Inga arkivbilder från åren finns bevarade — grafisk platta med kurbitslinje,
            komponerad som en bokplatta: speglade kurbitsar ramar in plats och år */}
        <figure
          className="flex aspect-square flex-col items-center justify-center gap-8 border border-line bg-midnight-800 p-8"
          data-chapter-plate
        >
          <Kurbits className="w-44 max-w-full text-flagblue" />
          <figcaption className="flex flex-col items-center gap-2 text-center">
            <span className="heading-caps text-[0.65rem] tracking-[0.22em] text-mist-dim">
              Där det började
            </span>
            <span className="heading-caps tabular text-2xl font-bold text-snow">
              Dalarna <span aria-hidden="true">·</span> 2002
            </span>
          </figcaption>
          <Kurbits className="w-44 max-w-full rotate-180 text-flagblue" />
        </figure>
      </div>
    </ChapterSection>
  );
}
