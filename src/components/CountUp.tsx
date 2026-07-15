"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Siffra som räknar upp när den scrollas in (IntersectionObserver).
 * Vid prefers-reduced-motion visas slutvärdet direkt.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  durationMs = 900,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasRunRef.current) return;
        hasRunRef.current = true;
        observer.disconnect();

        if (reduceMotion) {
          setDisplayValue(value);
          return;
        }

        const start = performance.now();
        const tick = (time: number) => {
          const progress = Math.min(1, (time - start) / durationMs);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
