"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrollmotor för karriärberättelsen: Lenis smooth scroll kopplad till
 * ScrollTrigger enligt standardreceptet (lenis.on('scroll', update) + gsap-ticker).
 * Vid prefers-reduced-motion startas Lenis aldrig — native scroll rakt igenom.
 * Allt innehåll server-renderas; providern är bara ett animationslager.
 */
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/** Scrolla mjukt till ett kapitel — Lenis om aktiv, annars native. */
export function useScrollToChapter() {
  const lenis = useLenis();
  return (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis && !reduceMotion) {
      lenis.scrollTo(target, { offset: -64, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
    // Flytta fokus dit hoppet landar (utan att trigga en andra scroll)
    target.focus({ preventScroll: true });
  };
}

export function CareerStoryProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
