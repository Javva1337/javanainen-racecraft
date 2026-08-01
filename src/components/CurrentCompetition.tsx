import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import type { SiteMode } from "@/lib/mode";
import { drawState, NC_DRAW, SEMIFINAL_START } from "@/lib/nations-cup";
import { KWC } from "@/lib/site";
import { LiveLinks } from "./LiveLinks";

/**
 * "Just nu"-teasern på startsidan: aktuell tävling direkt under hjälten.
 * Fram till att final A gått i mål handlar den om Nations Cup (med samma
 * trelägeslogik som lottningsrutan på Nations Cup-sidan). Därefter flyttas
 * fokus automatiskt till det individuella mästerskapet.
 */
export function CurrentCompetition({ lang, mode }: { lang: Lang; mode: SiteMode }) {
  const t = DICT[lang].home;
  const now = Date.now();
  const ncOver = mode === "after" || now > KWC.nationsCupEnd;

  const href = lang === "sv" ? (ncOver ? "/vm-2026" : "/vm-2026/nations-cup") : "/en/vm-2026";
  /* Efter VM pekar rapportlänken på slutrapporten, dessförinnan på Nations Cup-finalen */
  const reportHref =
    mode === "after"
      ? lang === "sv"
        ? `/nyheter/${KWC.finalReportSlug}`
        : `/en/news/${KWC.finalReportSlug}`
      : lang === "sv"
        ? "/nyheter/nations-cup-finalen"
        : "/en/news/nations-cup-finalen";
  const title = ncOver ? t.nowTitleInd : t.nowTitle;
  const dates = ncOver ? KWC.individualLabel[lang] : KWC.nationsCupLabel[lang];

  let status: string;
  if (mode === "after") {
    status = t.nowAfter;
  } else if (ncOver) {
    status = t.nowAfterInd;
  } else {
    const state = drawState(now);
    const result = NC_DRAW.result;
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
        <h2 className="heading-caps text-2xl font-bold text-snow">{title}</h2>
        <p className="mt-1 text-sm text-mist-dim">
          {KWC.venue}, {KWC.place[lang]} · <span className="tabular">{dates}</span>
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-mist">{status}</p>
        <LiveLinks lang={lang} className="mt-6 max-w-3xl" />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={href} className="btn btn-secondary">
            {ncOver ? t.nowCtaInd : t.nowCta}
          </Link>
          {ncOver && (
            <Link
              href={reportHref}
              className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
            >
              {mode === "after" ? t.nowReportFinal : t.nowReport}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
