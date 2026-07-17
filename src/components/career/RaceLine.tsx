"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Geometry = { d: string; width: number; height: number };

/**
 * Racinglinjen — sidans signatur. En SVG-linje som slingrar sig genom alla
 * kapitel (genom varje kapitelnods gula punkt) och ritas ut i takt med
 * scrollen via stroke-dashoffset. Kurvorna växlar sida som en racinglinje
 * mellan apex. Ren dekor (aria-hidden): utan JS finns i stället den statiska
 * guidelinjen i sidkanten; vid reduced motion ritas linjen fullt utritad.
 */
export function RaceLine() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  // Mät kapitelnodernas positioner och bygg linjens geometri
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = wrapper?.parentElement;
    if (!wrapper || !container) return;

    let frame = 0;
    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const dots = Array.from(container.querySelectorAll<HTMLElement>("[data-chapter-dot]"));
      if (dots.length === 0) return;

      const points = dots.map((dot) => {
        const rect = dot.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      });

      const railX = points[0].x;
      const width = Math.max(1, Math.round(containerRect.width));
      const height = Math.max(1, Math.round(containerRect.height));
      // Racinglinjens utsväng: begränsad så den aldrig lämnar rännan
      const amplitude = Math.min(28, railX * 0.6);

      let d = `M ${railX} 0`;
      const targets = [...points, { x: railX, y: height }];
      let previousY = 0;
      targets.forEach(({ y }, index) => {
        const bulge = railX + (index % 2 === 0 ? amplitude : -amplitude);
        const span = y - previousY;
        d += ` C ${bulge} ${previousY + span * 0.35}, ${bulge} ${y - span * 0.35}, ${railX} ${y}`;
        previousY = y;
      });

      setGeometry({ d, width, height });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Rita linjen i takt med scrollen; noderna poppar in när linjen når dem
  useGSAP(
    () => {
      const path = pathRef.current;
      const container = wrapperRef.current?.parentElement;
      if (!path || !container || !geometry) return;

      const length = path.getTotalLength();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        });

        container.querySelectorAll<HTMLElement>("[data-chapter-node]").forEach((node) => {
          gsap.from(node, {
            scale: 0.4,
            autoAlpha: 0,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: node, start: "top 72%" },
          });
        });
      });

      return () => mm.revert();
    },
    { dependencies: [geometry], revertOnUpdate: true },
  );

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {geometry && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={geometry.d}
            fill="none"
            stroke="var(--color-flagblue-bright)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  );
}
