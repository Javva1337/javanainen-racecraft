import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { CHAPTERS } from "@/lib/career-story";
import type { SiteMode } from "@/lib/mode";
import { KWC } from "@/lib/site";
import { ChapterSection } from "./ChapterSection";
import { ImageReveal } from "./ImageReveal";

const chapter = CHAPTERS.find((c) => c.id === "vandel")!;

/**
 * Kapitel 06 — Vandel (2026). Berättelsen slutar i nuet: SRKC, Hall of Fame
 * och lägesraden mot VM (före/under/efter — samma logik som startsidan).
 */
export function ChapterVandel({
  mode,
  latestHref,
  latestTitle,
}: {
  mode: SiteMode;
  /** Länk till senaste nyheten (eller /nyheter om ingen finns ännu) */
  latestHref: string;
  latestTitle: string | null;
}) {
  return (
    <ChapterSection chapter={chapter} lede="Berättelsen slutar inte i historiken. Den fortsätter i Vandel.">
      <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-[3fr_2fr] sm:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
          <p>
            <span className="text-snow">3:e bästa svensk i SRKC 2026.</span> Klar för hyrkart-VM
            på {KWC.venue}, {KWC.datesLabel.sv}: KWC Individual och Nations Cup för Sverige.
          </p>
          <p>
            Samma år kom också beskedet om en plats i{" "}
            <a
              href="https://srkc.nu/results/hall-of-fame/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flagblue-bright underline underline-offset-2 hover:text-snow"
            >
              SRKC:s Hall of Fame
            </a>{" "}
            — hittills som ende invalde förare.
          </p>
        </div>

        <figure>
          <ImageReveal className="aspect-square border border-line">
            <Image
              src="/images/gallery-5.png"
              alt="Rickard Javanainens hjälm i närbild"
              width={800}
              height={800}
              sizes="(max-width: 640px) 92vw, 32vw"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
          <figcaption className="heading-caps mt-3 text-[0.65rem] tracking-[0.18em] text-mist-dim">
            Sverige, 2026
          </figcaption>
        </figure>
      </div>

      {/* Lägesraden mot VM — före/under/efter, samma logik som startsidan */}
      <div className="mt-16 border border-line bg-midnight-800 p-8 sm:mt-20 sm:p-12">
        {mode === "before" && (
          <>
            <p className="heading-caps mb-4 text-xs tracking-[0.16em] text-mist-dim">
              Nations Cup <span aria-hidden="true">·</span> {KWC.place.sv}
            </p>
            <Countdown target={KWC.nationsCupStart} lang="sv" />
          </>
        )}
        {mode === "during" && (
          <p className="heading-caps text-lg text-snow sm:text-2xl">
            VM pågår just nu{latestTitle ? ` — senaste rapporten: ${latestTitle}` : ""}.
          </p>
        )}
        {mode === "after" && (
          <p className="heading-caps text-lg text-snow sm:text-2xl">
            VM 2026 är avgjort — resultaten finns i Facit nedan.
          </p>
        )}

        <p className="mt-8 text-base text-mist sm:text-lg">
          Fortsättning följer. Nations Cup {KWC.nationsCupLabel.sv}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/vm-2026" className="btn btn-primary">
            Följ VM här
          </Link>
          <Link href={latestHref} className="btn btn-secondary">
            {latestTitle ? "Senaste nyheten" : "Alla nyheter"}
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
