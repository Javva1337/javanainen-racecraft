import { Kurbits } from "@/components/Kurbits";
import type { ChapterDef } from "@/lib/career-story";

/**
 * Server-renderat kapitelskal: sektion med rubrik, kapiteletikett och nod
 * på racinglinjen (gul punkt + kapitelnummer, kurbits vid pallplatsår).
 * Innehållet ligger alltid komplett i DOM:en — animationslagret läggs ovanpå.
 */
export function ChapterSection({
  chapter,
  children,
  className = "",
  lede,
}: {
  chapter: ChapterDef;
  children: React.ReactNode;
  className?: string;
  /** Kort ingress under rubriken */
  lede?: string;
}) {
  return (
    <section
      id={chapter.id}
      tabIndex={-1}
      aria-labelledby={`${chapter.id}-heading`}
      data-chapter={chapter.id}
      className={`relative scroll-mt-20 py-24 outline-none sm:py-36 ${className}`}
    >
      {/* Nod på racinglinjen — gul punkt, kapitelnummer, kurbits vid pallplatsår */}
      <div
        data-chapter-node
        className="absolute left-[var(--rail-x)] top-[7.5rem] flex -translate-x-1/2 flex-col items-center gap-2 sm:top-[10.5rem]"
        aria-hidden="true"
      >
        <span
          data-chapter-dot
          className="block h-3 w-3 rounded-full bg-flagyellow shadow-[0_0_12px_rgba(254,204,2,0.45)]"
        />
        <span className="heading-caps tabular text-[0.65rem] font-bold tracking-[0.1em] text-mist-dim">
          {chapter.num}
        </span>
        {chapter.podium && <Kurbits className="w-9 text-flagblue" />}
      </div>

      <div className="pl-10 pr-4 sm:pl-24 sm:pr-6">
        <div className="mx-auto max-w-4xl">
          <header data-chapter-header>
            <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
              Kapitel {chapter.num} <span aria-hidden="true">·</span> {chapter.years}
            </p>
            <h2
              id={`${chapter.id}-heading`}
              className="heading-caps mt-3 text-[clamp(1.75rem,8vw,2.25rem)] font-extrabold leading-[0.95] text-snow sm:text-6xl"
            >
              {chapter.title}
            </h2>
            {lede && <p className="mt-5 max-w-2xl text-base text-mist sm:text-lg">{lede}</p>}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
