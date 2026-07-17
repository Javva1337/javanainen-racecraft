import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { ChapterSection } from "./ChapterSection";
import { GinettaStats } from "./GinettaStats";

const chapter = CHAPTERS.find((c) => c.id === "banracing")!;

const COPY = {
  sv: {
    lede: "Ur gokarten, in i bilarna.",
    renault: "2:a plats totalt.",
    jtcc: "Junior Touring Car Championship. Flertalet pallplatser.",
  },
  en: {
    lede: "Out of the kart, into the cars.",
    renault: "2nd overall.",
    jtcc: "Junior Touring Car Championship. Multiple podiums.",
  },
} as const;

/** Kapitel 02 — Banracing (2007–2011): Renault Junior Cup, JTCC, Ginetta G20 Cup. */
export function ChapterBanracing({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <div className="mt-12 space-y-10 sm:mt-16">
        <ol className="space-y-6" data-chapter-copy>
          <li className="flex flex-col gap-1 border-b border-line/60 pb-6 sm:flex-row sm:items-baseline sm:gap-8">
            <span className="heading-caps tabular w-28 shrink-0 text-sm font-bold text-mist-dim">
              2007
            </span>
            <div>
              <h3 className="heading-caps text-lg text-snow">Renault Junior Cup</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">{t.renault}</p>
            </div>
          </li>
          <li className="flex flex-col gap-1 border-b border-line/60 pb-6 sm:flex-row sm:items-baseline sm:gap-8">
            <span className="heading-caps tabular w-28 shrink-0 text-sm font-bold text-mist-dim">
              2008–2010
            </span>
            <div>
              <h3 className="heading-caps text-lg text-snow">JTCC</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">{t.jtcc}</p>
            </div>
          </li>
        </ol>

        <GinettaStats lang={lang} />
      </div>
    </ChapterSection>
  );
}
