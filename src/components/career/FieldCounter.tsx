"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { counterTween, DESKTOP_MOTION, MOBILE_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Det bärande talet i kapitel 05: 172 förare — största startfältet hittills.
 * Desktop: räknas upp i takt med scrollen (scrub). Mobil: kort count-up vid
 * in-view. Statiskt/utan JS: slutvärdet 172 (samma som lib/results.ts).
 */
const FIELD_SIZE_2017 = 172;

export function FieldCounter() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const display = root?.querySelector<HTMLElement>("[data-count-172]");
      if (!root || !display) return;

      const original = display.textContent;
      const mm = gsap.matchMedia();
      const restore = () => {
        display.textContent = original;
      };

      mm.add(DESKTOP_MOTION, () => {
        counterTween(display, {
          from: 0,
          to: FIELD_SIZE_2017,
          scrollTrigger: { trigger: root, start: "top 85%", end: "top 35%", scrub: 0.6 },
        });
        return restore;
      });

      mm.add(MOBILE_MOTION, () => {
        counterTween(display, {
          from: 0,
          to: FIELD_SIZE_2017,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%" },
        });
        return restore;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} data-field-172>
      <p className="flex flex-wrap items-baseline gap-x-5">
        <span
          data-count-172
          className="heading-caps tabular text-[clamp(5rem,18vw,12rem)] font-extrabold leading-none text-snow"
        >
          172
        </span>
        <span className="heading-caps text-sm tracking-[0.12em] text-mist sm:text-lg">
          förare — största startfältet hittills.
        </span>
      </p>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
        VM i Spanien 2017: 12:e av 172. 5:a med Sverige i Nations Cup.
      </p>
    </div>
  );
}
