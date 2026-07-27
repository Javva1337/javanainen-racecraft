"use client";

import { useEffect, useState } from "react";
import { Countdown } from "@/components/Countdown";
import type { Lang } from "@/lib/dictionary";
import {
  FINALE_DAY,
  getNextHeat,
  HEAT_COPY,
  HEAT_DAYS,
  HEAT_LAYOUT_NAMES,
  heatDayOf,
  heatState,
  type HeatLayoutId,
  type HeatState,
} from "@/lib/heats";
import { LIVE } from "@/lib/site";

/** Classic = kontur, New 23 = fylld — båda i flaggblått så gult förblir prestation/handling. */
function LayoutChip({ layout }: { layout: HeatLayoutId }) {
  const styles =
    layout === "classic"
      ? "border-flagblue text-flagblue-bright"
      : "border-flagblue bg-flagblue text-snow";
  return (
    <span className={`heading-caps inline-block border px-2 py-1 text-[0.65rem] tracking-[0.12em] ${styles}`}>
      {HEAT_LAYOUT_NAMES[layout]}
    </span>
  );
}

const TIME_STYLE: Record<HeatState, string> = {
  done: "text-mist-dim line-through decoration-1",
  live: "text-flagyellow",
  next: "text-flagyellow",
  upcoming: "text-snow",
};

/**
 * "När kör Rickard?" — Rickards åtta kvalheat som livevy: nästa heat med
 * nedräkning överst, dagskort under, körda heat bockas av. Följer
 * Countdown-mönstret: neutral render tills klockan finns på klienten,
 * så server- och klient-HTML aldrig glider isär.
 */
export function HeatSchedule({ lang }: { lang: Lang }) {
  const t = HEAT_COPY[lang];
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const next = now === null ? getNextHeat(0) : getNextHeat(now);
  const nextDay = next ? heatDayOf(next) : null;
  const nextIsLive =
    now !== null && next !== null && heatState(next, now) === "live";
  const stateOf = (heat: (typeof HEAT_DAYS)[number]["heats"][number]): HeatState =>
    now === null ? "upcoming" : heatState(heat, now);

  return (
    <div>
      <p className="mb-8 max-w-2xl text-mist">{t.intro}</p>

      {/* Nästa heat — det enda gula i sektionen */}
      {next && nextDay ? (
        <div className="mb-8 flex flex-col gap-6 border border-flagyellow bg-midnight-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="heading-caps mb-3 text-xs tracking-[0.16em] text-mist-dim">
              {nextIsLive ? t.liveNow : t.nextHeat} · {t.heatLabel(next.no)} · Round {next.round}
            </p>
            <p className="heading-caps tabular text-5xl font-bold text-flagyellow sm:text-6xl">
              {next.time}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-mist">
              <span>{nextDay.date[lang]}</span>
              <LayoutChip layout={nextDay.layout} />
            </p>
          </div>
          {!nextIsLive && <Countdown target={next.start} lang={lang} />}
        </div>
      ) : (
        <div className="mb-8 border border-line bg-midnight-800 p-6">
          <p className="text-mist">{t.allDone}</p>
        </div>
      )}

      {/* Fyra dagar, två heat per dag */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HEAT_DAYS.map((day) => (
          <div key={day.day} className="border border-line bg-midnight-800 p-6">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <h3 className="heading-caps text-sm font-bold text-snow">{day.date[lang]}</h3>
              <span className="heading-caps text-[0.65rem] tracking-[0.14em] text-mist-dim">
                {t.dayLabel(day.day)}
              </span>
            </div>
            <LayoutChip layout={day.layout} />
            <ol className="mt-5 space-y-4">
              {day.heats.map((heat) => {
                const state = stateOf(heat);
                return (
                  <li key={heat.no} className="flex items-baseline justify-between gap-3">
                    <span
                      className={`heading-caps tabular text-2xl font-bold transition-colors duration-200 ${TIME_STYLE[state]}`}
                    >
                      {heat.time}
                    </span>
                    <span className="text-right text-xs text-mist">
                      <span className={state === "done" ? "text-mist-dim" : undefined}>
                        {t.heatRow(heat.no)} · Round {heat.round}
                      </span>
                      {state === "done" && (
                        <span className="heading-caps ml-2 text-[0.6rem] tracking-[0.12em] text-mist-dim">
                          {t.done}
                        </span>
                      )}
                      {state === "live" && (
                        <span className="heading-caps ml-2 text-[0.6rem] tracking-[0.12em] text-flagyellow">
                          {t.liveNow}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      {/* Finaldagen */}
      <div className="mt-4 flex flex-col gap-1 border border-line bg-midnight-800 px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8">
        <span className="heading-caps w-44 shrink-0 text-sm font-bold text-snow">
          {FINALE_DAY.date[lang]}
        </span>
        <span className="heading-caps text-sm text-snow">{t.finale}</span>
        <span className="text-sm text-mist">{t.finaleDetail}</span>
      </div>

      <p className="mt-6 max-w-2xl text-sm text-mist-dim">
        {t.footnote}{" "}
        <a
          href={LIVE.timing}
          target="_blank"
          rel="noopener noreferrer"
          className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
        >
          {t.timingLink}
        </a>
        .
      </p>
    </div>
  );
}
