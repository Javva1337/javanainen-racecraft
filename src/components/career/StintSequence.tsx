"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Lang } from "@/lib/dictionary";
import { DESKTOP_MOTION, MOBILE_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Nations Cup-stinten 2015: från sist till först.
 *  Desktop: sektionen pinnas — positionsstegen fylls nedifrån i takt med
 *  scrollen och "Sist" slår om till "P1" i stor tabulär typografi.
 *  Mobil: samma förlopp som kort in-view-sekvens utan pin.
 *  Statiskt/utan JS/reduced motion: slutläget P1 ("Sist"-lagret är hidden
 *  i server-HTML:en och väcks bara av animationslagret).
 *
 * TODO(Rickard): exakt startposition (antal lag i fältet) är inte verifierad —
 * därför en abstrakt stege i stället för numerisk räknare. Kan bytas till
 * P<antal>→P1 när siffran är bekräftad.
 */
const LADDER_STEPS = 14;

const COPY = {
  sv: {
    event: "Italien 2015",
    from: "Sist",
    label: "En stint. Från sist till först.",
    note: "I en lagtävling räknas hela lagets körning ihop, så en stark stint lyfter laget men avgör inte ensam. Sverige gick i mål som femma totalt.",
  },
  en: {
    event: "Italy 2015",
    from: "Last",
    label: "One stint. From last to first.",
    note: "The team crossed the line fifth overall.",
  },
} as const;

export function StintSequence({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const fromEl = root.querySelector<HTMLElement>("[data-stint-from]");
      const toEl = root.querySelector<HTMLElement>("[data-stint-to]");
      const steps = root.querySelectorAll<HTMLElement>("[data-stint-step]");
      const label = root.querySelector<HTMLElement>("[data-stint-label]");
      const note = root.querySelector<HTMLElement>("[data-stint-note]");
      if (!fromEl || !toEl || !label || !note || steps.length === 0) return;

      const mm = gsap.matchMedia();

      const setup = () => {
        fromEl.hidden = false;
        gsap.set(fromEl, { autoAlpha: 1 });
        gsap.set(toEl, { autoAlpha: 0, scale: 0.94, transformOrigin: "left bottom" });
        gsap.set(steps, { scaleX: 0.35, opacity: 0.25, transformOrigin: "left center" });
        gsap.set(label, { autoAlpha: 0, y: 16 });
        gsap.set(note, { autoAlpha: 0 });
        return () => {
          fromEl.hidden = true;
        };
      };

      const sequence = (tl: gsap.core.Timeline) =>
        tl
          // Stegen fylls nedifrån och upp — klättringen genom fältet
          .to(steps, { scaleX: 1, opacity: 1, duration: 0.55, stagger: { each: 0.035, from: "end" } })
          // Sist → P1
          .to(fromEl, { autoAlpha: 0, y: -24, duration: 0.12 }, "-=0.1")
          .to(toEl, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power2.out" }, "<0.04")
          .to(label, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, ">-0.02")
          .to(note, { autoAlpha: 1, duration: 0.1 });

      mm.add(DESKTOP_MOTION, () => {
        const cleanup = setup();
        sequence(
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top 20%",
              end: "+=160%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              onToggle: (self) =>
                gsap.set([fromEl, toEl, label], {
                  willChange: self.isActive ? "transform, opacity" : "auto",
                }),
            },
          }),
        );
        return cleanup;
      });

      mm.add(MOBILE_MOTION, () => {
        const cleanup = setup();
        sequence(
          gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: root, start: "top 70%" },
          }).timeScale(0.65),
        );
        return cleanup;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mt-14 border border-line bg-midnight-800 p-8 sm:mt-20 sm:p-14">
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Nations Cup <span aria-hidden="true">·</span> {t.event}
      </p>

      <div className="mt-8 flex items-end gap-8 sm:gap-14">
        {/* Positionsstegen: fylls nedifrån och upp i takt med scrubben */}
        <div className="flex flex-col items-start gap-[7px] sm:gap-2" aria-hidden="true">
          {Array.from({ length: LADDER_STEPS }, (_, i) => (
            <span
              key={i}
              data-stint-step
              className={`block h-px w-8 sm:w-12 ${i === 0 ? "bg-flagyellow" : "bg-mist-dim"}`}
            />
          ))}
        </div>

        <div>
          <span className="relative block">
            <span
              data-stint-from
              hidden
              aria-hidden="true"
              className="heading-caps tabular absolute left-0 top-0 text-[clamp(5rem,16vw,11rem)] font-extrabold leading-none text-mist-dim"
            >
              {t.from}
            </span>
            <span
              data-stint-to
              className="heading-caps tabular block text-[clamp(5rem,16vw,11rem)] font-extrabold leading-none text-flagyellow"
            >
              P1
            </span>
          </span>
          <p
            data-stint-label
            className="heading-caps mt-4 text-sm tracking-[0.14em] text-snow sm:text-base"
          >
            {t.label}
          </p>
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mist" data-stint-note>
        {t.note}
      </p>
    </div>
  );
}
