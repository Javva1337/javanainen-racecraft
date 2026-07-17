"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANY_MOTION, DESKTOP_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Sidövergripande effektlager för berättelsen (monteras en gång i
 * story-containern):
 *  - mjuka fade-up-reveals på kapitelrubriker, brödtext och plattor
 *  - citat-mellanspelet tonar/skalar in med scrubben
 *  - bakgrundsårtalen glider långsammare än scrollen (subtil djupkänsla,
 *    endast desktop)
 * Alla startlägen sätts av JS — utan JS/vid reduced motion är allt synligt.
 */
export function StoryEffects() {
  const anchorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scopeEl = anchorRef.current?.parentElement;
    if (!scopeEl) return;

    const mm = gsap.matchMedia();

    mm.add(ANY_MOTION, () => {
      scopeEl
        .querySelectorAll<HTMLElement>(
          "[data-chapter-header], [data-chapter-copy], [data-chapter-plate]",
        )
        .forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 28,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 82%" },
          });
        });

      scopeEl.querySelectorAll<HTMLElement>("[data-quote]").forEach((quote) => {
        gsap.fromTo(
          quote,
          { autoAlpha: 0.15, scale: 0.94 },
          {
            autoAlpha: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: quote, start: "top 85%", end: "center 55%", scrub: 0.6 },
          },
        );
      });
    });

    mm.add(DESKTOP_MOTION, () => {
      scopeEl.querySelectorAll<HTMLElement>("[data-backdrop-year]").forEach((year) => {
        const section = year.closest("section") ?? year;
        gsap.fromTo(
          year,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });
    });

    return () => mm.revert();
  });

  return <div ref={anchorRef} hidden aria-hidden="true" />;
}
