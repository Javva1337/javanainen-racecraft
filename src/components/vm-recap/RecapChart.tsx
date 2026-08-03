"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ChartPoint } from "@/lib/chart-geometry";
import { chartPathD } from "@/lib/chart-geometry";

/**
 * "Resan genom veckan": standing-kurvan ritas med pathLength när sektionen
 * scrollas i vy, därefter poppar dagspunkterna in i tur och ordning.
 * Pallplatsdagar får gul punkt — samma språk som resultattabellen på
 * /karriar. Nations Cup är en egen startpunkt med streckad anslutning
 * (annan skala: nationer, inte förare — därför utanför kurvan).
 * Skärmläsare och no-JS får en sr-only-lista med hela resan.
 */
const PATH_DURATION = 1.3;
/* 30–80 ms mellan syskon — längre stagger gör slutet av sekvensen segt */
const POINT_STAGGER = 0.08;

export function RecapChart({
  points,
  nationsCup,
  lang,
  labels,
}: {
  points: ChartPoint[];
  nationsCup: { position: string; slug: string };
  lang: "sv" | "en";
  labels: {
    ncLabel: string;
    chartAria: string;
    /**
     * Färdigrenderad aria-text per dag (dag → sträng), inte en funktion —
     * Server Components får inte skicka funktioner till klientkomponenter
     * över RSC-gränsen, så VmRecap (server) förberäknar texterna här.
     */
    dayAria: Record<number, string>;
  };
}) {
  const reduceMotion = useReducedMotion();
  const newsBase = lang === "sv" ? "/nyheter" : "/en/news";
  const first = points[0];

  if (!first) return null;

  /* 0.5 × ritningstiden: punkterna börjar landa medan kurvan ännu ritas,
     så rörelsen läses som en helhet i stället för två separata steg */
  const pointDelay = (i: number) =>
    reduceMotion ? 0 : PATH_DURATION * 0.5 + i * POINT_STAGGER;

  // Kantmedveten förankring: nära vänster-/högerkanten centrerar vi inte
  // tooltipen (klipps annars av containern), utan förankrar mot punkten.
  const tooltipAnchorClass = (x: number) => {
    if (x < 25) return "left-0";
    if (x > 75) return "right-0";
    return "left-1/2 -translate-x-1/2";
  };

  return (
    <figure aria-label={labels.chartAria}>
      {/* Grafytan — höjd i CSS, koordinater i procent av ytan */}
      <div className="relative h-56 sm:h-72">
        <svg
          className="absolute inset-0 h-full w-full overflow-visible text-flagblue-bright"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Streckad anslutning från NC-startpunkten till första kurvpunkten */}
          <motion.line
            x1={2}
            y1={first.y}
            x2={first.x}
            y2={first.y}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={chartPathD(points)}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduceMotion ? 0 : PATH_DURATION, ease: "easeInOut" }}
          />
        </svg>

        {/* NC-startpunkten — egen skala (nationer), därför utanför kurvan */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: "2%", top: `${first.y}%` }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          <Link
            href={`${newsBase}/${nationsCup.slug}`}
            className="group block p-2"
            aria-label={labels.ncLabel}
          >
            <span className="block h-2.5 w-2.5 rounded-full border border-mist-dim bg-midnight transition-transform duration-150 group-hover:scale-125 group-focus-visible:scale-125" />
            {/* Vänsterförankrad (punkten ligger vid 2 %) — annars klipps etiketten av containerkanten */}
            <span className="heading-caps absolute left-0 top-full mt-1 whitespace-nowrap text-[10px] tracking-[0.12em] text-mist-dim transition-colors group-hover:text-snow">
              {labels.ncLabel}
            </span>
          </Link>
        </motion.div>

        {/* Dagspunkterna — poppar in efter att kurvan ritats */}
        {points.map((p, i) => (
          <motion.div
            key={p.day.day}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 20,
              delay: pointDelay(i),
            }}
          >
            <Link
              href={`${newsBase}/${p.day.slug}`}
              className="group block p-2"
              aria-label={labels.dayAria[p.day.day]}
              aria-describedby={`recap-tip-${p.day.day}`}
            >
              <span
                className={`block h-3 w-3 rounded-full transition-transform duration-150 group-hover:scale-125 group-focus-visible:scale-125 ${
                  p.day.podium ? "bg-flagyellow" : "bg-flagblue-bright"
                }`}
              />
              {/* bestFinish-badge ovanför punkten */}
              {p.day.bestFinish && (
                <span className="tabular absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-xs font-bold text-snow">
                  {p.day.bestFinish}
                </span>
              )}
              {/* Standing under punkten */}
              <span className="tabular absolute left-1/2 top-full mt-1 -translate-x-1/2 text-[10px] text-mist-dim transition-colors group-hover:text-snow">
                P{p.day.standing}
              </span>
              {/* Tooltip med dagens rubrik — kantmedveten förankring + smalare på mobil */}
              <span
                id={`recap-tip-${p.day.day}`}
                role="tooltip"
                className={`pointer-events-none absolute bottom-full z-10 mb-6 w-44 sm:w-56 border border-line bg-midnight px-3 py-2 text-xs leading-snug text-mist opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${tooltipAnchorClass(p.x)}`}
              >
                {p.day.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Hela resan i text — skärmläsare och utan JS */}
      <figcaption className="sr-only">
        <ol>
          <li>{labels.ncLabel}</li>
          {points.map((p) => (
            <li key={p.day.day}>{labels.dayAria[p.day.day]}</li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
