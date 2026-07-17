"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { counterTween, DESKTOP_MOTION, MOBILE_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Ginetta G20 Cup 2011 som stat-pop: siffrorna räknas upp i gult medan
 * sektionen är pinnad (desktop) eller vid in-view (mobil). Statiskt/utan JS:
 * slutvärdena. Siffrorna är samma som i tidslinjedatan: vann 2 av 6 race,
 * 8:a av 22 totalt med bara hälften av racen körda.
 */
const GINETTA_STATS = [
  { value: 2, display: "2", suffix: "", label: "vinster" },
  { value: 6, display: "6", suffix: "", label: "race" },
  { value: 8, display: "8:a", suffix: ":a", label: "av 22 totalt" },
] as const;

export function GinettaStats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const values = Array.from(root.querySelectorAll<HTMLElement>("[data-ginetta-value]"));
      const note = root.querySelector<HTMLElement>("[data-ginetta-note]");
      if (values.length !== GINETTA_STATS.length || !note) return;

      const mm = gsap.matchMedia();

      const restore = () => {
        values.forEach((el, i) => {
          el.textContent = GINETTA_STATS[i].display;
        });
      };

      const buildCounts = (tl: gsap.core.Timeline) => {
        values.forEach((el, i) => {
          const stat = GINETTA_STATS[i];
          tl.add(
            counterTween(el, {
              from: 0,
              to: stat.value,
              duration: 0.4,
              format: (n) => `${n}${stat.suffix}`,
            }),
            i * 0.22,
          );
        });
        tl.fromTo(note, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.9);
        return tl;
      };

      mm.add(DESKTOP_MOTION, () => {
        buildCounts(
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top 25%",
              end: "+=100%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          }),
        );
        return restore;
      });

      mm.add(MOBILE_MOTION, () => {
        buildCounts(
          gsap.timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: { trigger: root, start: "top 72%" },
          }).timeScale(0.8),
        );
        return restore;
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} data-ginetta className="border border-line bg-midnight-800 p-8 sm:p-12">
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Ginetta G20 Cup <span aria-hidden="true">·</span> 2011
      </p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist">
        Inhopp mitt i säsongen, som stand-in utan försäsong.
      </p>

      <dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-8">
        {GINETTA_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            <dd
              data-ginetta-value
              className="heading-caps tabular order-first text-5xl font-extrabold text-flagyellow sm:text-7xl"
            >
              {stat.display}
            </dd>
            <dt className="heading-caps text-[0.65rem] tracking-[0.16em] text-mist-dim sm:text-xs">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm leading-relaxed text-mist" data-ginetta-note>
        8:a av 22 förare totalt — med bara hälften av racen körda.
      </p>
    </div>
  );
}
