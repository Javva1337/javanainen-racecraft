import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { DICT, type Lang } from "@/lib/dictionary";
import type { SiteMode } from "@/lib/mode";
import { KWC, TAGLINE } from "@/lib/site";
import { Countdown } from "./Countdown";
import { NationBadge } from "./NationBadge";

/**
 * Hero med lägeslogik:
 *  - före VM: countdown till Nations Cup 25 juli
 *  - under VM: "VM pågår — läs dagens rapport →"
 *  - efter VM: "VM 2026 — så gick det →"
 * Video-loop förberedd: lägg hero-loop.mp4 i /public/videos och sätt
 * HERO_VIDEO nedan — regnbilden är fallback/poster.
 */
const HERO_VIDEO: string | null = null;

export function Hero({
  lang,
  mode,
  latestArticle,
}: {
  lang: Lang;
  mode: SiteMode;
  latestArticle: Article | null;
}) {
  const t = DICT[lang].home;
  const vmHref = lang === "sv" ? "/vm-2026" : "/en/vm-2026";
  const latestHref =
    latestArticle === null
      ? vmHref
      : lang === "sv"
        ? `/nyheter/${latestArticle.slug}`
        : `/en/news/${latestArticle.slug}`;

  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden">
      {/* Bakgrund: video-loop när den finns, annars regnbilden */}
      {HERO_VIDEO ? (
        <video
          src={HERO_VIDEO}
          poster="/images/hero-rain.jpg"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src="/images/hero-rain.jpg"
          alt="Rickard Javanainen i regnrace"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-40 sm:px-6">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold leading-[0.95] text-snow sm:text-6xl lg:text-7xl">
          Rickard
          <br />
          Javanainen
        </h1>
        <p className="mt-4 max-w-xl text-base text-mist sm:text-lg">{TAGLINE[lang]}</p>

        <div className="mt-10">
          {mode === "before" && (
            <div className="flex flex-col gap-8">
              <div>
                <p className="heading-caps mb-3 text-xs tracking-[0.16em] text-mist-dim">
                  {t.countdownTo}
                </p>
                <Countdown target={KWC.nationsCupStart} lang={lang} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={vmHref} className="btn btn-primary">
                  {t.followVm}
                </Link>
                <Link
                  href={lang === "sv" ? "/partners" : "/en"}
                  className="btn btn-secondary"
                >
                  {t.becomePartner}
                </Link>
              </div>
            </div>
          )}

          {mode === "during" && (
            <Link
              href={latestHref}
              className="btn btn-primary text-base"
            >
              {t.liveBanner}
            </Link>
          )}

          {mode === "after" && (
            <Link href={vmHref} className="btn btn-primary text-base">
              {t.afterBanner}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
