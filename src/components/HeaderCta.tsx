"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import { getSiteMode, type SiteMode } from "@/lib/mode";
import { KWC } from "@/lib/site";

type Props = {
  lang: Lang;
  /** SSR-läget från layouten — korrigeras på klienten efter mount */
  initialMode: SiteMode;
  /** "bar" = chip i headerraden, "menu" = fullbreddsblock överst i mobilmenyn */
  variant: "bar" | "menu";
};

/**
 * Headerns tävlings-chip: alltid synlig väg till aktuell tävling.
 * Layouten skickar SSR-läget som fallback; efter mount räknas läget om
 * klientsidigt (KWC-tidsstämplarna är rena tal) så en långlivad flik
 * aldrig visar fel etikett. Första klientrenderingen använder prop:en,
 * så ingen hydration-avvikelse uppstår.
 */
export function HeaderCta({ lang, initialMode, variant }: Props) {
  const [mode, setMode] = useState<SiteMode>(initialMode);
  const t = DICT[lang].nav.cta;
  const href = lang === "sv" ? "/vm-2026/nations-cup" : "/en/vm-2026";

  useEffect(() => {
    const update = () => setMode(getSiteMode());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const label = t[mode];
  const marker = (
    <span
      className={`h-1.5 w-1.5 shrink-0 bg-flagyellow ${mode === "during" ? "animate-pulse" : ""}`}
      aria-hidden="true"
    />
  );

  if (variant === "menu") {
    return (
      <Link
        href={href}
        aria-label={t.ariaLabel}
        className="heading-caps mb-2 flex items-center justify-between border border-flagyellow/60 px-4 py-3 text-sm tracking-[0.12em] text-flagyellow transition-colors duration-200 hover:border-flagyellow hover:bg-flagyellow/10"
      >
        <span className="flex items-center gap-2">
          {marker}
          {label}
          {mode === "before" && <span className="tabular">· {KWC.nationsCupLabel[lang]}</span>}
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={t.ariaLabel}
      className="heading-caps hidden items-center gap-2 border border-flagyellow/60 px-3 py-1.5 text-xs tracking-[0.12em] text-flagyellow transition-colors duration-200 hover:border-flagyellow hover:bg-flagyellow/10 sm:inline-flex"
    >
      {marker}
      <span>
        {label}
        {mode === "before" && (
          <span className="tabular hidden xl:inline"> · {KWC.nationsCupLabel[lang]}</span>
        )}
      </span>
    </Link>
  );
}
