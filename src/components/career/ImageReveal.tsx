"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Bildreveal: clip-path ritas upp nedifrån + subtil skala när elementet
 * scrollas in. Startläget sätts av JS efter mount — utan JavaScript (och vid
 * prefers-reduced-motion) är bilden alltid fullt synlig.
 */
export function ImageReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Redan i viewport vid mount (t.ex. deep-link)? Hoppa över revealen helt —
    // annars garanteras en klippt första frame innan IO-callbacken hunnit köra.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    element.classList.add("image-reveal-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          element.classList.remove("image-reveal-pending");
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    );
    // OBS: observera föräldern — elementets egen clip-path (inset 100%) ger
    // annars intersection ratio 0 och revealen skulle aldrig triggas.
    observer.observe(element.parentElement ?? element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`image-reveal ${className}`}>
      {children}
    </div>
  );
}
