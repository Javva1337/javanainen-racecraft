"use client";

import { useEffect, useRef } from "react";
import type { TimelineEntry } from "@/lib/results";
import type { Lang } from "@/lib/dictionary";
import { Reveal } from "./Reveal";

/**
 * Karriärtidslinje som ritas ut vid scroll: linjen växer (scaleY) i takt med
 * att sektionen scrollas in. Endast transform animeras; reduced motion får
 * hela linjen direkt.
 */
export function Timeline({ entries, lang }: { entries: TimelineEntry[]; lang: Lang }) {
  const containerRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "scaleY(1)";
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewportH * 0.85 - rect.top) / rect.height));
      line.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol ref={containerRef} className="relative space-y-10 pl-8">
      {/* Bakgrundslinje + linje som ritas ut */}
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-line" aria-hidden="true" />
      <div
        ref={lineRef}
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-flagblue-bright"
        style={{ transform: "scaleY(0)" }}
        aria-hidden="true"
      />
      {entries.map((entry, index) => (
        <li key={entry.years} className="relative">
          <span
            className={`absolute -left-8 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
              entry.highlight
                ? "border-flagyellow bg-flagyellow"
                : "border-flagblue bg-midnight"
            }`}
            aria-hidden="true"
          />
          <Reveal delayMs={Math.min(index * 40, 200)}>
            <p className="heading-caps tabular text-sm font-bold tracking-[0.12em] text-mist-dim">
              {entry.years}
            </p>
            <h3
              className={`heading-caps mt-1 text-lg ${
                entry.highlight ? "text-flagyellow" : "text-snow"
              }`}
            >
              {entry.title[lang]}
            </h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-mist">
              {entry.description[lang]}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
