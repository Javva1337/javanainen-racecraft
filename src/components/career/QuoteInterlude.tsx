import { Kurbits } from "@/components/Kurbits";
import type { Lang } from "@/lib/dictionary";

const COPY = {
  sv: { aria: "Citat", open: "”", close: "”" },
  en: { aria: "Quote", open: "“", close: "”" },
} as const;

/**
 * Citat-mellanspel: helskärmssektion mellan kapitel — andrum som ger rytm.
 * Tonar/skalar in via animationslagret (data-quote); statiskt fullt synlig.
 *
 * TODO(Rickard): platshållarcitat — byt till ett riktigt citat från Rickard.
 */
export function QuoteInterlude({ quote, lang }: { quote: string; lang: Lang }) {
  const t = COPY[lang];
  return (
    <section
      aria-label={t.aria}
      className="flex min-h-[80svh] items-center justify-center px-6 py-24"
    >
      <figure data-quote className="max-w-3xl text-center">
        <Kurbits className="mx-auto mb-8 w-24 text-flagblue" />
        <blockquote>
          <p className="font-display text-3xl font-semibold leading-tight text-snow sm:text-5xl">
            {t.open}
            {quote}
            {t.close}
          </p>
        </blockquote>
      </figure>
    </section>
  );
}
