"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Lang } from "@/lib/dictionary";
import { JOURNEY } from "@/lib/ben-home";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COPY = {
  sv: { head: ["RACING", "RESAN."], label: "Racingresan i kapitel" },
  en: { head: ["RACING", "JOURNEY."], label: "Racing journey in chapters" },
} as const;

export function BenJourney({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const wrap = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const ghost = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const vp = viewport.current!;
        const tr = track.current!;
        const items = rail.current ? Array.from(rail.current.children) : [];
        vp.style.overflowX = "hidden";
        const dist = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
        const st = ScrollTrigger.create({
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          animation: gsap.to(tr, { x: () => -dist(), ease: "none" }),
          onUpdate: (self) => {
            const p = self.progress;
            if (bar.current) bar.current.style.transform = `scaleX(${p})`;
            const idx = Math.min(JOURNEY.length - 1, Math.round(p * (JOURNEY.length - 1)));
            items.forEach((n, i) => n.classList.toggle("is-on", i === idx));
            if (ghost.current) ghost.current.textContent = JOURNEY[idx].year;
          },
        });
        return () => {
          st.kill();
          vp.style.overflowX = "";
          gsap.set(tr, { clearProps: "transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <section id="story" className="bj" aria-labelledby="bj-h">
      <h2 id="bj-h" className="bj-head">
        {t.head[0]}
        <br />
        {t.head[1]}
      </h2>
      <div ref={wrap} className="bj-pin">
        <div ref={ghost} className="bj-ghost" aria-hidden="true">
          {JOURNEY[0].year}
        </div>
        <div ref={viewport} className="bj-viewport" tabIndex={0} role="region" aria-label={t.label}>
          <ul ref={track} className="bj-track">
            {JOURNEY.map((c) => (
              <li key={c.id} className="bj-card">
                <span className="bj-ghostyear" aria-hidden="true">{c.year}</span>
                {c.image ? (
                  <div className="bj-media">
                    <Image src={c.image.src} alt={c.image.alt[lang]} fill sizes="(max-width: 768px) 80vw, 30vw" />
                  </div>
                ) : (
                  <div className="bj-media bj-media--bin" aria-hidden="true">
                    <span>{c.year}</span>
                  </div>
                )}
                <p className="bj-tag">{c.tag[lang]}</p>
                <p className="bj-year">{c.year}</p>
                <h3 className="bj-title">{c.title[lang]}</h3>
                <p className="bj-text">{c.text[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bj-railwrap" aria-hidden="true">
          <span ref={bar} className="bj-bar" />
          <ol ref={rail} className="bj-rail">
            {JOURNEY.map((c, i) => (
              <li key={c.id} className={i === 0 ? "is-on" : ""}>
                <b>{c.year}</b>
                <span>{c.tag[lang]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
