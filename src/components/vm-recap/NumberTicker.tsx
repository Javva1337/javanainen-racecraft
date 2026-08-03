"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Recapens motsvarighet till CountUp, men på Framer Motion: server-HTML:en
 * innehåller alltid slutvärdet (SEO/skärmläsare/utan JS ser aldrig en nolla).
 * Uppräkningen från 0 startar först när elementet är i vy, och hoppar helt
 * över vid prefers-reduced-motion.
 */
export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !isInView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        element.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, value, prefix, suffix]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
