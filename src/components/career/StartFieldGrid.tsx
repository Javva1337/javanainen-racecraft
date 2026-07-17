"use client";

import type { Lang } from "@/lib/dictionary";
import { STORY_FACTS } from "@/lib/results";

/**
 * Startfältet i VM 2016 som raster: 102 punkter (17 × 6) i en enda SVG —
 * inga DOM-divar. Scrubben tänder raderna och låter den gula punkten vandra
 * till tredjeplatsen; statiskt/utan JS visas slutläget (allt tänt, gul på P3).
 */
const FIELD_COLS = 17;
const FIELD_SIZE = STORY_FACTS.field2016;
const FIELD_ROWS = Math.ceil(FIELD_SIZE / FIELD_COLS);
const SPACING = 14;
const DOT_RADIUS = 3;

/** P3 = tredje rutan i första raden (radordnat startfält) */
const HERO_INDEX = 2;

const ARIA = {
  sv: (drivers: number) => `Startfältet i VM 2016: ${drivers} förare, tredjeplatsen markerad`,
  en: (drivers: number) => `The 2016 Worlds field: ${drivers} drivers, third place highlighted`,
} as const;

function dotPosition(index: number) {
  const col = index % FIELD_COLS;
  const row = Math.floor(index / FIELD_COLS);
  return { cx: col * SPACING + SPACING / 2, cy: row * SPACING + SPACING / 2 };
}

function heroDotPosition() {
  return dotPosition(HERO_INDEX);
}

/** Gula punktens resa: från fältets sista ruta till P3 (som x/y-delta). */
export function heroTravelDelta() {
  const hero = dotPosition(HERO_INDEX);
  const last = dotPosition(FIELD_SIZE - 1);
  return { x: last.cx - hero.cx, y: last.cy - hero.cy };
}

export function StartFieldGrid({ lang, className = "" }: { lang: Lang; className?: string }) {
  const hero = heroDotPosition();
  const rows = Array.from({ length: FIELD_ROWS }, (_, row) =>
    Array.from({ length: FIELD_COLS }, (_, col) => row * FIELD_COLS + col).filter(
      (index) => index < FIELD_SIZE,
    ),
  );

  return (
    <svg
      viewBox={`0 0 ${FIELD_COLS * SPACING} ${FIELD_ROWS * SPACING}`}
      className={className}
      role="img"
      aria-label={ARIA[lang](FIELD_SIZE)}
    >
      {rows.map((cols, row) => (
        <g key={row} data-field-row>
          {cols.map((index) => (
            <circle
              key={index}
              cx={(index % FIELD_COLS) * SPACING + SPACING / 2}
              cy={row * SPACING + SPACING / 2}
              r={DOT_RADIUS}
              className="fill-mist-dim"
              opacity={0.7}
            />
          ))}
        </g>
      ))}
      {/* Rickards punkt — vandrar till P3 i scrubben */}
      <circle
        data-field-hero
        cx={hero.cx}
        cy={hero.cy}
        r={DOT_RADIUS + 1.5}
        className="fill-flagyellow"
      />
    </svg>
  );
}
