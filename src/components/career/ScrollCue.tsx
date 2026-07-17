import type { Lang } from "@/lib/dictionary";

const COPY = { sv: "Scrolla", en: "Scroll" } as const;

/**
 * Scrollindikator i prologen — ren CSS-animation (motion-reduce döljer pulsen,
 * etiketten står kvar). Server-renderad.
 */
export function ScrollCue({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col items-center gap-3" aria-hidden="true">
      <span className="heading-caps text-[0.6rem] tracking-[0.22em] text-mist-dim">
        {COPY[lang]}
      </span>
      <span className="relative block h-10 w-px overflow-hidden bg-line">
        <span className="absolute left-0 top-0 h-4 w-px animate-scroll-cue bg-flagyellow motion-reduce:hidden" />
      </span>
    </div>
  );
}
