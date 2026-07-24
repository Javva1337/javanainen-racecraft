import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import type { SiteMode } from "@/lib/mode";
import { drawState, NC_DRAW, SEMIFINAL_START } from "@/lib/nations-cup";
import { KWC } from "@/lib/site";
import { LiveLinks } from "./LiveLinks";

/**
 * "Just nu"-teasern på startsidan: aktuell tävling direkt under hjälten.
 * Statusraden följer samma trelägeslogik som Nations Cup-sidans
 * lottningsruta — NC_DRAW.result uppdaterar båda samtidigt.
 */
export function CurrentCompetition({ lang, mode }: { lang: Lang; mode: SiteMode }) {
  const t = DICT[lang].home;
  const href = lang === "sv" ? "/vm-2026/nations-cup" : "/en/vm-2026";
  const now = Date.now();
  const result = NC_DRAW.result;

  let status: string;
  if (mode === "after" || now > KWC.nationsCupEnd) {
    status = t.nowAfter;
  } else {
    const state = drawState(now);
    status =
      state === "before"
        ? t.nowDrawBefore
        : state === "pending" || result === null
          ? t.nowDrawPending
          : t.nowDrawDone(result, SEMIFINAL_START[result]);
  }

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-10 sm:px-6"
      aria-label={lang === "sv" ? "Aktuell tävling" : "Current competition"}
    >
      <div className="border border-line bg-midnight-800 p-6 sm:p-8">
        <p className="heading-caps mb-3 text-xs tracking-[0.16em] text-flagyellow">
          {t.nowKicker}
        </p>
        <h2 className="heading-caps text-2xl font-bold text-snow">{t.nowTitle}</h2>
        <p className="mt-1 text-sm text-mist-dim">
          {KWC.venue}, {KWC.place[lang]} ·{" "}
          <span className="tabular">{KWC.nationsCupLabel[lang]}</span>
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-mist">{status}</p>
        <LiveLinks lang={lang} className="mt-6 max-w-3xl" />
        <div className="mt-6">
          <Link href={href} className="btn btn-secondary">
            {t.nowCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
