"use client";

import { motion, useReducedMotion } from "motion/react";
import { NumberTicker } from "./NumberTicker";

export type RecapStatItem = {
  value: number | string;
  prefix?: string;
  suffix?: string;
  detail?: string;
  label: string;
};

/**
 * Nyckeltalsraden i VM-recapen: korten fjädrar in staggered när raden
 * scrollas i vy. Textinnehållet är alltid server-renderat i slutläge —
 * bara transform/opacity animeras. Reduced motion → inga animationer.
 */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 26 },
  },
};

export function RecapStats({ items }: { items: RecapStatItem[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      className={`grid grid-cols-2 gap-px border border-line bg-line ${
        items.length === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4"
      }`}
      variants={container}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {items.map((stat) => (
        <motion.li
          key={stat.label}
          variants={reduceMotion ? undefined : item}
          className="min-w-0 bg-midnight-800 p-5 sm:p-6"
        >
          <p className="heading-caps text-3xl font-extrabold text-snow sm:text-4xl">
            {typeof stat.value === "number" ? (
              <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            ) : (
              /* Ordvärden ("Semifinal") kan inte radbrytas — mindre grad på
                 mobil så kortet aldrig spränger tvåkolumnsgriden */
              <span className="text-xl sm:text-4xl">{stat.value}</span>
            )}
            {stat.detail && (
              /* Riktigt mellanslag före spannet — annars blir copy/paste
                 och skärmläsare "41:aav 180" (ml-1 syns men läses inte) */
              <>
                {" "}
                <span className="text-base font-bold text-mist-dim">{stat.detail}</span>
              </>
            )}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-mist-dim">
            {stat.label}
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
