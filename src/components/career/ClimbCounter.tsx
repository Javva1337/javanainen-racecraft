"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_FACTS } from "@/lib/results";
import { counterTween, DESKTOP_MOTION, MOBILE_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Finalracet i VM Polen 2018: scrub-räknare P16 → P9 (desktop) respektive
 * kort count-down vid in-view (mobil). Statiskt/utan JS: slutläget direkt.
 */
const CLIMB_FROM = STORY_FACTS.climb2018.from;
const CLIMB_TO = STORY_FACTS.climb2018.to;

export function ClimbCounter() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const display = root?.querySelector<HTMLElement>("[data-climb-display]");
      if (!root || !display) return;

      const original = display.textContent;
      const format = (n: number) => `P${n}`;
      const mm = gsap.matchMedia();
      const restore = () => {
        display.textContent = original;
      };

      mm.add(DESKTOP_MOTION, () => {
        counterTween(display, {
          from: CLIMB_FROM,
          to: CLIMB_TO,
          scrollTrigger: { trigger: root, start: "top 80%", end: "top 30%", scrub: 0.6 },
          format,
        });
        return restore;
      });

      mm.add(MOBILE_MOTION, () => {
        counterTween(display, {
          from: CLIMB_FROM,
          to: CLIMB_TO,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
          format,
        });
        return restore;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="border border-line bg-midnight-800 p-8 sm:p-12">
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Finalracet <span aria-hidden="true">·</span> VM Polen 2018
      </p>
      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span
          data-climb-display
          className="heading-caps tabular text-[clamp(4rem,13vw,8.5rem)] font-extrabold leading-none text-flagyellow"
        >
          P{CLIMB_TO}
        </span>
        <span className="heading-caps text-sm tracking-[0.12em] text-mist sm:text-lg">
          Från {CLIMB_FROM}:e till {CLIMB_TO}:e i finalracet.
        </span>
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mist">
        14:e av 131 i mästerskapet totalt. 6:a med Sverige i Nations Cup.
      </p>
    </div>
  );
}
