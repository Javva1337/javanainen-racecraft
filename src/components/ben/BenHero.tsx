"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Lang } from "@/lib/dictionary";

const COPY = {
  sv: {
    tagline: "Hyrkartförare från Dalarna. VM-brons 2016.",
    hint2: "SCROLLA",
    alt: "Rickard Javanainen i racingställ och hjälm med mörkt visir",
  },
  en: {
    tagline: "Rental kart racer from Dalarna. Worlds bronze 2016.",
    hint2: "SCROLL",
    alt: "Rickard Javanainen in race suit and helmet with a dark visor",
  },
} as const;

const SRC = {
  wide: "/hero-lando/03-wide-16x9.jpg",
  portrait: "/hero-lando/01-portrait-9x16.jpg",
  alt: "/hero-lando/02-layer-alt-9x16.jpg",
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
        {/* Gemensam zoom för wide + porträtt så att alla tre stills förblir alignade */}
        <div className="bh-wide">
          <div className="bh-zoom">
            <Image src={SRC.wide} alt="" aria-hidden="true" fill priority sizes="178vh" className="bh-img bh-img--wide" />
            <div className="bh-portrait">
              <Image src={SRC.portrait} alt={t.alt} fill priority sizes="56vh" className="bh-img" />
              <Image
                src={SRC.alt}
                alt=""
                aria-hidden="true"
                fill
                sizes="56vh"
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
