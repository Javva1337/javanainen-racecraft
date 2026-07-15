"use client";

import { useEffect, useState } from "react";
import { DICT, type Lang } from "@/lib/dictionary";

const MS = { day: 86_400_000, hour: 3_600_000, minute: 60_000, second: 1_000 };

function splitRemaining(ms: number) {
  const clamped = Math.max(0, ms);
  return {
    days: Math.floor(clamped / MS.day),
    hours: Math.floor((clamped % MS.day) / MS.hour),
    minutes: Math.floor((clamped % MS.hour) / MS.minute),
    seconds: Math.floor((clamped % MS.minute) / MS.second),
  };
}

/**
 * Countdown till Nations Cup. Den mest signifikanta enheten (aktiv siffra)
 * markeras i flaggult. Renderas först efter mount för att undvika
 * hydration-avvikelser — placeholdern har samma mått.
 */
export function Countdown({ target, lang }: { target: number; lang: Lang }) {
  const [now, setNow] = useState<number | null>(null);
  const t = DICT[lang].home;

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now === null ? null : splitRemaining(target - now);
  const units = [
    { key: "days", label: t.days, value: remaining?.days },
    { key: "hours", label: t.hours, value: remaining?.hours },
    { key: "minutes", label: t.minutes, value: remaining?.minutes },
    { key: "seconds", label: t.seconds, value: remaining?.seconds },
  ];
  const activeIndex = units.findIndex((unit) => (unit.value ?? 0) > 0);

  return (
    <div className="flex items-start gap-3 sm:gap-6" role="timer" aria-label={t.countdownTo}>
      {units.map((unit, index) => (
        <div key={unit.key} className="flex flex-col items-center">
          <span
            className={`heading-caps tabular text-3xl font-bold transition-colors duration-200 sm:text-5xl ${
              index === activeIndex ? "text-flagyellow" : "text-snow"
            }`}
          >
            {unit.value === undefined ? "––" : String(unit.value).padStart(2, "0")}
          </span>
          <span className="heading-caps mt-1 text-[0.65rem] tracking-[0.16em] text-mist-dim">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
