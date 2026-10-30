"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Lang } from "@/lib/dictionary";

const COPY = {
  sv: {
    tagline: "Hyrkartförare från Dalarna. VM-brons 2016.",
    hint2: "SCROLLA FÖR ATT AVSLÖJA",
    alt: "Rickard Javanainen — i kartstolen med svenska flaggan på hjälmen. Scrolla för att se ansiktet",
  },
  en: {
    tagline: "Rental kart racer from Dalarna. Worlds bronze 2016.",
    hint2: "SCROLL TO REVEAL",
    alt: "Rickard Javanainen — in the kart with a Swedish flag on his helmet. Scroll to see his face",
  },
} as const;

const SRC = {
  wide: "/images/hero-rain.jpg",
  portrait: "/images/hero-poster.jpg",
  alt: "/images/portrait.jpg",
};

export function BenHero({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    // Scroll: --p 0..1 över hjältens extra scrolldjup (rAF-throttlat).
    const update = () => {
      raf = 0;
      if (mq.matches) {
        el.style.setProperty("--p", "0");
        return;
      }
      const r = el.getBoundingClientRect();
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <section ref={root} className="bh">
      <div className="bh-stage">
        {/* Pressfoto: bakgrund (dämpad) + hjälmbild som tonas över till ansiktet via --p */}
        <div className="bh-wide">
          <div className="bh-zoom">
            <Image src={SRC.wide} alt="" aria-hidden="true" fill priority sizes="178vh" className="bh-img bh-img--wide" />
            <div className="bh-portrait">
              <Image src={SRC.portrait} alt={t.alt} fill priority sizes="75vh" className="bh-img bh-img--helmet" />
              <Image
                src={SRC.alt}
                alt=""
                aria-hidden="true"
                fill
                sizes="75vh"
                className="bh-img bh-img--alt"
              />
            </div>
          </div>
        </div>

        <div className="bh-copy">
          {/* BenHome har redan sidans h1 (sr-only) — den visuella rubriken är därför en p */}
          <p className="bh-title" aria-hidden="true">
            <span>RICKARD</span>
            <span>JAVANAINEN</span>
          </p>
          <p className="bh-tagline">{t.tagline}</p>
        </div>
        <p className="bh-hint" aria-hidden="true">
          {t.hint2} <span className="bh-hint-arrow">↓</span>
        </p>
      </div>
    </section>
  );
}
