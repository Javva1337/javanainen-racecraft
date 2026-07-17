import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import type { SiteMode } from "@/lib/mode";
import { KWC } from "@/lib/site";
import { ChapterSection } from "./ChapterSection";
import { ImageReveal } from "./ImageReveal";

const chapter = CHAPTERS.find((c) => c.id === "vandel")!;

const COPY = {
  sv: {
    lede: "Berättelsen slutar inte i historiken. Den fortsätter i Vandel.",
    p1Highlight: "3:e bästa svensk i SRKC 2026.",
    p1Rest: (venue: string, dates: string) =>
      ` Klar för hyrkart-VM på ${venue}, ${dates}: KWC Individual och Nations Cup för Sverige.`,
    p2Pre: "Samma år kom också beskedet om en plats i ",
    p2Link: "SRKC:s Hall of Fame",
    p2Post: ", seriens hedersgalleri, hittills som ende invalde förare.",
    figcaption: "Sverige, 2026",
    during: (title: string | null) =>
      `VM pågår just nu${title ? `. Senaste rapporten: ${title}` : ""}.`,
    after: "VM 2026 är avgjort. Resultaten finns i Facit nedan.",
    cont: (label: string) => `Fortsättning följer. Nations Cup ${label}.`,
    followVm: "Följ VM här",
    latestNews: "Senaste nyheten",
    allNews: "Alla nyheter",
    vmHref: "/vm-2026",
    imgAlt: "Rickard Javanainens hjälm i närbild",
  },
  en: {
    lede: "The story doesn't end in the archive. It continues in Vandel.",
    p1Highlight: "3rd-best Swede in the 2026 SRKC.",
    p1Rest: (venue: string, dates: string) =>
      ` Set for the rental kart Worlds at ${venue}, ${dates}: KWC Individual and the Nations Cup for Sweden.`,
    p2Pre: "The same year also brought a place in the ",
    p2Link: "SRKC Hall of Fame",
    p2Post: " — so far as the only driver inducted.",
    figcaption: "Sweden, 2026",
    during: (title: string | null) =>
      `The Worlds are on right now${title ? ` — latest report: ${title}` : ""}.`,
    after: "Worlds 2026 is decided — the results are in The tally below.",
    cont: (label: string) => `To be continued. Nations Cup ${label}.`,
    followVm: "Follow the Worlds",
    latestNews: "Latest news",
    allNews: "All news",
    vmHref: "/en/vm-2026",
    imgAlt: "Rickard Javanainen's helmet in close-up",
  },
} as const;

/**
 * Kapitel 06 — Vandel (2026). Berättelsen slutar i nuet: SRKC, Hall of Fame
 * och lägesraden mot VM (före/under/efter — samma logik som startsidan).
 */
export function ChapterVandel({
  mode,
  latestHref,
  latestTitle,
  lang,
}: {
  mode: SiteMode;
  /** Länk till senaste nyheten (eller nyhetslistan om ingen finns ännu) */
  latestHref: string;
  latestTitle: string | null;
  lang: Lang;
}) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-[3fr_2fr] sm:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
          <p>
            <span className="text-snow">{t.p1Highlight}</span>
            {t.p1Rest(KWC.venue, KWC.datesLabel[lang])}
          </p>
          <p>
            {t.p2Pre}
            <a
              href="https://srkc.nu/results/hall-of-fame/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flagblue-bright underline underline-offset-2 hover:text-snow"
            >
              {t.p2Link}
            </a>
            {t.p2Post}
          </p>
        </div>

        <figure>
          <ImageReveal className="aspect-square border border-line">
            <Image
              src="/images/gallery-5.png"
              alt={t.imgAlt}
              width={800}
              height={800}
              sizes="(max-width: 640px) 92vw, 32vw"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
          <figcaption className="heading-caps mt-3 text-[0.65rem] tracking-[0.18em] text-mist-dim">
            {t.figcaption}
          </figcaption>
        </figure>
      </div>

      {/* Lägesraden mot VM — före/under/efter, samma logik som startsidan */}
      <div className="mt-16 border border-line bg-midnight-800 p-8 sm:mt-20 sm:p-12">
        {mode === "before" && (
          <>
            <p className="heading-caps mb-4 text-xs tracking-[0.16em] text-mist-dim">
              Nations Cup <span aria-hidden="true">·</span> {KWC.place[lang]}
            </p>
            <Countdown target={KWC.nationsCupStart} lang={lang} />
          </>
        )}
        {mode === "during" && (
          <p className="heading-caps text-lg text-snow sm:text-2xl">{t.during(latestTitle)}</p>
        )}
        {mode === "after" && (
          <p className="heading-caps text-lg text-snow sm:text-2xl">{t.after}</p>
        )}

        <p className="mt-8 text-base text-mist sm:text-lg">
          {t.cont(KWC.nationsCupLabel[lang])}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={t.vmHref} className="btn btn-primary">
            {t.followVm}
          </Link>
          <Link href={latestHref} className="btn btn-secondary">
            {latestTitle ? t.latestNews : t.allNews}
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
