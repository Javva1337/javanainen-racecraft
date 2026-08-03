# Efter VM-recap — implementationsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bygg det animerade "efter VM"-lagret: teaser på startsidan + full recap med veckograf på /vm-2026 (sv + en), drivet av Framer Motion, plus ett svep som rättar kvarvarande före/under-VM-copy.

**Architecture:** Ett rent datalager (`lib/vm-recap.ts`) härleder tidslinjen ur dagsrapporternas frontmatter + `vm-status.json` + `KWC` — pure functions med injicerad data, fullt testbara i vitest (node-miljö). Ovanpå ligger små klientkomponenter i `components/vm-recap/` som bara äger rörelsen (Framer Motion via paketet `motion`), medan server-komponenter äger data och text. Grafen är en SVG-linje (pathLength-animation) med HTML-positionerade punkter (procentkoordinater från samma geometrihelper) så tooltips/fokus blir vanlig HTML.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind 4, vitest, `motion` (Framer Motion — NYTT beroende, medvetet val trots befintlig GSAP: recapen är sajtens Framer Motion-yta, karriärsidan förblir GSAP).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-03-efter-vm-recap-design.md`
- Alla siffror hämtas ur `lib/site.ts` (KWC), `content/vm-status.json`, rapporternas frontmatter eller `lib/results.ts` — **aldrig hårdkodade i komponenter**.
- Siffervärden server-renderas alltid som slutvärden (SEO/skärmläsare/utan JS ser aldrig en nolla) — mönstret från `CountUp.tsx`.
- `prefers-reduced-motion` → inga animationer, slutläge direkt (`useReducedMotion` från `motion/react`).
- Endast transform/opacity/pathLength animeras — inga layoutproperties.
- Svenska först, engelska parallellt: varje användarvänd sträng finns i både sv och en.
- All ny användarvänd copy är UTKAST tills orkestratorn kört kedjan copywriting → seo-audit → ai-seo → humanizer (Task 10). Ödmjuk ton — aldrig kaxig.
- Tester: `npm test` (vitest, `src/**/*.test.ts`, node-miljö — inga komponenttester, komponenter verifieras via build + browser).
- Committa efter varje task. Jobba på branchen `feat/efter-vm-recap`.
- Kodkommentarer på svenska, i samma stil som befintliga filer.

## Kanonisk data (för referens i alla tasks)

Dagsrapporternas frontmatter (individuella VM = dag 7–11):

| day | slug | bestFinish | standing |
| --- | --- | --- | --- |
| 7 | `vm-dag-7-tia-och-sexa-i-vm-premiaren` | P6 | P67 |
| 8 | `vm-dag-8-forsta-pallplatsen` | P3 | P54 |
| 9 | `vm-dag-9-tvaa-och-fyra-basta-dagen` | P2 | P37 |
| 10 | `vm-dag-10-tredje-pallplatsen-semifinal-klar` | P3 | P37 |
| 11 | `vm-dag-11-vm-over-41a-av-180` | — (semifinal) | P41 |

Nations Cup: `vm-status.json.nationsCupPosition = "14:e av 32"`, rapportslug `nations-cup-finalen`. Dag 4-rapporten (`standing: "P6"`) är ett NC-heatresultat och ska INTE in i kurvan — därav dag ≥ 7-filtret.

Stats: slutplacering 41 av 180 (`KWC.result2026`, `KWC.driverCount`), 9 körda heat (`vm-status.json.heatsRaced`), 3 pallplatser (härleds: dagar med bestFinish ≤ P3), semifinal.

---

### Task 1: Installera `motion` och verifiera baslinjen

**Files:**
- Modify: `package.json` (via npm)

**Interfaces:**
- Produces: paketet `motion` importerbart som `motion/react` i klientkomponenter (Task 5–7).

- [ ] **Step 1: Verifiera grön baslinje**

Run: `npm test`
Expected: alla befintliga tester PASS (content, dictionary, heats, kurbits, mode, nations-cup, publicera m.fl.)

- [ ] **Step 2: Installera beroendet**

Run: `npm install motion`
Expected: `motion` under `dependencies` i package.json, inga peer-varningar mot React 19.

- [ ] **Step 3: Verifiera att bygget fortfarande går**

Run: `npm run build`
Expected: bygget lyckas (ingen kod använder paketet ännu).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: lägg till motion (Framer Motion) för VM-recapens animationslager"
```

---

### Task 2: Datalagret `lib/vm-recap.ts` — härledning ur rapporterna

**Files:**
- Create: `src/lib/vm-recap.ts`
- Test: `src/lib/vm-recap.test.ts`

**Interfaces:**
- Consumes: `Article`/`ArticleFrontmatter` från `@/lib/content`, `VmStatus` från `@/lib/vm-status`, `KWC` från `@/lib/site`, `Lang` från `@/lib/dictionary`.
- Produces (används av Task 6–9):

```ts
export type RecapDay = {
  day: number;            // VM-dag 7–11
  slug: string;           // länk till dagsrapporten
  title: string;          // rapportens rubrik (tooltip)
  bestFinish: string | null; // "P2" … null när dagen saknar heatresultat (dag 11)
  standing: number;       // totalplacering efter dagen: 67, 54, 37, 37, 41
  podium: boolean;        // bestFinish P1–P3
};
export type VmRecapData = {
  nationsCup: { position: string; slug: string }; // "14:e av 32", "nations-cup-finalen"
  days: RecapDay[];       // stigande day-ordning
  stats: {
    finalStanding: number;  // 41
    fieldSize: number;      // 180 (KWC.driverCount)
    heatsRaced: number;     // 9 (vm-status.json)
    podiums: number;        // 3 (härledd)
  };
};
export function parsePlacement(p: string): number | null;            // "P67" → 67, "41" → 41, skräp → null
export function buildVmRecap(articles: Article[], status: VmStatus | null): VmRecapData | null;
export function getVmRecap(lang: Lang): VmRecapData | null;          // fs-wrapper: getAllArticles + getVmStatus
```

- [ ] **Step 1: Skriv de failande testerna**

Skapa `src/lib/vm-recap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Article } from "./content";
import type { VmStatus } from "./vm-status";
import { buildVmRecap, parsePlacement } from "./vm-recap";

/** Minsta möjliga artikel — bara fälten recapen läser. */
function article(fm: {
  day?: number;
  bestFinish?: string;
  standing?: string;
  title?: string;
  slug?: string;
}): Article {
  return {
    slug: fm.slug ?? `vm-dag-${fm.day}`,
    lang: "sv",
    isFallback: false,
    frontmatter: {
      title: fm.title ?? `Dag ${fm.day}`,
      description: "",
      date: "2026-07-28",
      category: "VM 2026",
      day: fm.day,
      bestFinish: fm.bestFinish,
      standing: fm.standing,
    },
    body: "",
    readingTimeMin: 1,
  };
}

const STATUS: VmStatus = {
  heatsRaced: 9,
  bestFinish: "P2",
  standing: "P41",
  nationsCupPosition: "14:e av 32",
  updatedAt: "2026-08-01",
};

const WEEK: Article[] = [
  article({ day: 11, standing: "P41", slug: "vm-dag-11-vm-over-41a-av-180" }),
  article({ day: 9, bestFinish: "P2", standing: "P37" }),
  article({ day: 7, bestFinish: "P6", standing: "P67" }),
  article({ day: 10, bestFinish: "P3", standing: "P37" }),
  article({ day: 8, bestFinish: "P3", standing: "P54" }),
  // NC-rapport dag 4 — får inte hamna i kurvan
  article({ day: 4, standing: "P6" }),
  // artikel utan day — ignoreras
  article({ day: undefined, slug: "vagen-till-vandel" }),
];

describe("parsePlacement", () => {
  it("tolkar P-prefix och rena tal", () => {
    expect(parsePlacement("P67")).toBe(67);
    expect(parsePlacement("41")).toBe(41);
  });
  it("returnerar null för skräp", () => {
    expect(parsePlacement("semifinal")).toBeNull();
    expect(parsePlacement("")).toBeNull();
  });
});

describe("buildVmRecap", () => {
  it("tar bara med individuella dagar (≥7), i stigande ordning", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.days.map((d) => d.day)).toEqual([7, 8, 9, 10, 11]);
    expect(recap?.days.map((d) => d.standing)).toEqual([67, 54, 37, 37, 41]);
  });
  it("flaggar pallplatsdagar och räknar dem", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.days.map((d) => d.podium)).toEqual([false, true, true, true, false]);
    expect(recap?.stats.podiums).toBe(3);
  });
  it("hämtar stats ur status + sista dagen", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.stats).toEqual({
      finalStanding: 41,
      fieldSize: 180,
      heatsRaced: 9,
      podiums: 3,
    });
    expect(recap?.nationsCup).toEqual({
      position: "14:e av 32",
      slug: "nations-cup-finalen",
    });
  });
  it("dag utan bestFinish får null och räknas inte som pallplats", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.days.at(-1)?.bestFinish).toBeNull();
  });
  it("returnerar null utan status eller utan dagar", () => {
    expect(buildVmRecap(WEEK, null)).toBeNull();
    expect(buildVmRecap([], STATUS)).toBeNull();
  });
});
```

- [ ] **Step 2: Kör testerna — de ska faila**

Run: `npm test -- vm-recap`
Expected: FAIL — `Cannot find module './vm-recap'` (eller motsvarande).

- [ ] **Step 3: Implementera `src/lib/vm-recap.ts`**

```ts
import { getAllArticles, type Article } from "./content";
import type { Lang } from "./dictionary";
import { KWC } from "./site";
import { getVmStatus, type VmStatus } from "./vm-status";

/**
 * Härleder "efter VM"-recapens data ur dagsrapporternas frontmatter,
 * vm-status.json och KWC — recapen har ingen egen sanningskälla.
 * Dag 1–6 är träning + Nations Cup; individuella mästerskapet (kurvan)
 * börjar VM-dag 7 (28 juli). Dag 4-rapportens standing är ett NC-heat
 * och hör inte hemma i totalkurvan.
 */
const INDIVIDUAL_FIRST_DAY = 7;

/** Slutrapporten från Nations Cup — grafens startpunkt länkar hit. */
const NC_REPORT_SLUG = "nations-cup-finalen";

export type RecapDay = {
  day: number;
  slug: string;
  title: string;
  bestFinish: string | null;
  standing: number;
  podium: boolean;
};

export type VmRecapData = {
  nationsCup: { position: string; slug: string };
  days: RecapDay[];
  stats: {
    finalStanding: number;
    fieldSize: number;
    heatsRaced: number;
    podiums: number;
  };
};

/** "P67" → 67, "41" → 41. Allt annat (t.ex. "semifinal") → null. */
export function parsePlacement(p: string): number | null {
  const match = /^P?(\d+)$/.exec(p.trim());
  return match ? Number(match[1]) : null;
}

export function buildVmRecap(
  articles: Article[],
  status: VmStatus | null,
): VmRecapData | null {
  if (status === null) return null;

  const days: RecapDay[] = articles
    .flatMap((a) => {
      const { day, bestFinish, standing, title } = a.frontmatter;
      if (typeof day !== "number" || day < INDIVIDUAL_FIRST_DAY) return [];
      const parsedStanding = standing === undefined ? null : parsePlacement(standing);
      if (parsedStanding === null) return [];
      const finish = bestFinish === undefined ? null : bestFinish;
      const finishPlace = finish === null ? null : parsePlacement(finish);
      return [
        {
          day,
          slug: a.slug,
          title,
          bestFinish: finish,
          standing: parsedStanding,
          podium: finishPlace !== null && finishPlace <= 3,
        },
      ];
    })
    .sort((a, b) => a.day - b.day);

  if (days.length === 0) return null;

  return {
    nationsCup: { position: status.nationsCupPosition, slug: NC_REPORT_SLUG },
    days,
    stats: {
      finalStanding: days[days.length - 1].standing,
      fieldSize: KWC.driverCount,
      heatsRaced: status.heatsRaced,
      podiums: days.filter((d) => d.podium).length,
    },
  };
}

/** Serverkomponenternas ingång: läser rapporter + status från disk. */
export function getVmRecap(lang: Lang): VmRecapData | null {
  return buildVmRecap(getAllArticles(lang), getVmStatus());
}
```

- [ ] **Step 4: Kör testerna — de ska passera**

Run: `npm test -- vm-recap`
Expected: PASS, samtliga.

- [ ] **Step 5: Kör hela sviten**

Run: `npm test`
Expected: PASS — inga regressioner.

- [ ] **Step 6: Commit**

```bash
git add src/lib/vm-recap.ts src/lib/vm-recap.test.ts
git commit -m "feat: datalager för VM-recapen — härleder tidslinjen ur rapporternas frontmatter"
```

---

### Task 3: Grafgeometri — placeringar → procentkoordinater

**Files:**
- Modify: `src/lib/vm-recap.ts` (lägg till i slutet)
- Test: `src/lib/vm-recap.test.ts` (lägg till describe-block)

**Interfaces:**
- Consumes: `RecapDay` från Task 2.
- Produces (används av `RecapChart` i Task 7):

```ts
export type ChartPoint = { x: number; y: number; day: RecapDay }; // x,y i 0–100 (procent av viewBox)
export function chartPoints(days: RecapDay[]): ChartPoint[];
export function chartPathD(points: ChartPoint[]): string; // "M x,y L x,y …"
```

- [ ] **Step 1: Skriv de failande testerna** (lägg till i `vm-recap.test.ts`)

```ts
import { chartPathD, chartPoints } from "./vm-recap";

describe("chartPoints", () => {
  const recap = buildVmRecap(WEEK, STATUS);
  const points = chartPoints(recap?.days ?? []);

  it("sprider dagarna jämnt på x mellan marginalerna", () => {
    expect(points).toHaveLength(5);
    expect(points[0].x).toBe(8);
    expect(points[4].x).toBe(96);
    // jämna steg: (96-8)/4 = 22
    expect(points[1].x).toBeCloseTo(30, 5);
  });
  it("bäst placering (lägst tal) hamnar högst upp (lägst y)", () => {
    const p37 = points[2]; // standing 37 — delad bästa
    const p67 = points[0]; // standing 67 — sämst
    expect(p37.y).toBeLessThan(p67.y);
    expect(p37.y).toBe(14);  // toppmarginal
    expect(p67.y).toBe(86);  // bottenmarginal
  });
  it("tål en ensam punkt utan division med noll", () => {
    const single = chartPoints([(recap?.days ?? [])[0]]);
    expect(single[0].y).toBe(50);
    expect(Number.isFinite(single[0].x)).toBe(true);
  });
});

describe("chartPathD", () => {
  it("bygger en M/L-path av punkterna", () => {
    const d = chartPathD([
      { x: 8, y: 86, day: {} as never },
      { x: 30, y: 50, day: {} as never },
    ]);
    expect(d).toBe("M 8,86 L 30,50");
  });
});
```

- [ ] **Step 2: Kör testerna — de ska faila**

Run: `npm test -- vm-recap`
Expected: FAIL — `chartPoints is not a function` (eller motsvarande).

- [ ] **Step 3: Implementera** (lägg till sist i `src/lib/vm-recap.ts`)

```ts
/**
 * Grafgeometri. Koordinater i procent (0–100) av en viewBox med
 * preserveAspectRatio="none" — samma tal används för SVG-pathen och för
 * HTML-punkternas left/top, så linje och punkter aldrig glider isär.
 * Marginalerna lämnar plats för badges ovanför och etiketter under.
 */
const CHART = { left: 8, right: 96, top: 14, bottom: 86 } as const;

export type ChartPoint = { x: number; y: number; day: RecapDay };

export function chartPoints(days: RecapDay[]): ChartPoint[] {
  if (days.length === 0) return [];
  const standings = days.map((d) => d.standing);
  const best = Math.min(...standings);
  const worst = Math.max(...standings);
  const span = worst - best;
  const xStep = days.length === 1 ? 0 : (CHART.right - CHART.left) / (days.length - 1);
  return days.map((day, i) => ({
    x: CHART.left + xStep * i,
    y:
      span === 0
        ? (CHART.top + CHART.bottom) / 2
        : CHART.top + ((day.standing - best) / span) * (CHART.bottom - CHART.top),
    day,
  }));
}

export function chartPathD(points: ChartPoint[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");
}
```

- [ ] **Step 4: Kör testerna — de ska passera**

Run: `npm test -- vm-recap`
Expected: PASS, samtliga.

- [ ] **Step 5: Commit**

```bash
git add src/lib/vm-recap.ts src/lib/vm-recap.test.ts
git commit -m "feat: grafgeometri för VM-recapens veckokurva"
```

---

### Task 4: Dictionary-strängar för recapen (sv + en)

**Files:**
- Modify: `src/lib/dictionary.ts` (nytt `recap`-avsnitt i både sv- och en-grenen, på samma nivå som `home`/`news`)

**Interfaces:**
- Produces: `DICT[lang].recap` med exakt dessa nycklar (används av Task 6–9):

```ts
recap: {
  kicker: string;         // teaserns kicker
  teaserHeading: string;
  teaserCta: string;      // → /vm-2026
  heading: string;        // recap-sektionens rubrik på /vm-2026
  intro: string;          // en mening under rubriken
  statFinal: string;      // etikett för 41:a av 180
  statHeats: string;      // etikett för 9
  statPodiums: string;    // etikett för 3
  statSemi: string;       // etikett (värdet är text, inte tal)
  statSemiValue: string;
  journeyHeading: string;
  journeyIntro: string;
  ncLabel: (position: string) => string;
  chartAria: string;      // aria-label för grafen
  dayAria: (day: number, standing: number) => string; // sr-text per punkt
  finalReportCta: string;
}
```

- [ ] **Step 1: Lägg till sv-strängarna** (efter `home`-objektet i sv-grenen, före `common`)

```ts
/** "Efter VM"-recapen — teaser på startsidan + full sektion på /vm-2026 */
recap: {
  kicker: "VM 2026 är avgjort",
  teaserHeading: "Så gick VM",
  teaserCta: "Se hela VM-resan →",
  heading: "VM 2026 — så gick det",
  intro:
    "Tävlingsveckan är avslutad. Här är resan genom veckan i siffror — varje punkt länkar till dagens rapport.",
  statFinal: "Slutplacering",
  statHeats: "Körda heat",
  statPodiums: "Pallplatser i kvalheaten",
  statSemi: "Så långt räckte det",
  statSemiValue: "Semifinal",
  journeyHeading: "Resan genom veckan",
  journeyIntro:
    "Placering i totalen efter varje tävlingsdag i det individuella mästerskapet.",
  ncLabel: (position: string) => `Nations Cup · ${position}`,
  chartAria: "Kurva över totalplaceringen dag för dag under VM-veckan",
  dayAria: (day: number, standing: number) =>
    `Dag ${day}: plats ${standing} i totalen — läs dagsrapporten`,
  finalReportCta: "Läs slutrapporten från VM →",
},
```

- [ ] **Step 2: Lägg till en-strängarna** (samma plats i en-grenen)

```ts
/** Post-Worlds recap — home teaser + full section on /en/vm-2026 */
recap: {
  kicker: "Worlds 2026 is decided",
  teaserHeading: "How the Worlds went",
  teaserCta: "See the full Worlds journey →",
  heading: "Worlds 2026 — how it went",
  intro:
    "The race week is over. Here is the journey through the week in numbers — every point links to that day's report.",
  statFinal: "Final standing",
  statHeats: "Heats raced",
  statPodiums: "Podiums in the qualifying heats",
  statSemi: "How far it went",
  statSemiValue: "Semifinal",
  journeyHeading: "The journey through the week",
  journeyIntro:
    "Overall standing after each race day of the individual championship.",
  ncLabel: (position: string) => `Nations Cup · ${position}`,
  chartAria: "Chart of the overall standing day by day during the Worlds week",
  dayAria: (day: number, standing: number) =>
    `Day ${day}: ${standing} overall — read the daily report`,
  finalReportCta: "Read the final report from the Worlds →",
},
```

OBS: en-grenens `nationsCupPosition` är svensk text ("14:e av 32") från vm-status.json — Task 6/8 använder `KWC`-mönstret inte här; positionssträngen visas som den är på sv men behöver en-variant. Lös det i detta task: lägg till i `en.recap` en översättningsfunktion i stället för rå passthrough:

```ts
// i en.recap — ersätter ncLabel ovan:
ncLabel: (position: string) =>
  `Nations Cup · ${position.replace(":e av", "th of")}`,
```

("14:e av 32" → "14th of 32". Kommentera i koden: fungerar för svenska ordningstal på "-:e"; bryts formatet fångas det av dictionary-testet nedan.)

- [ ] **Step 3: Lägg till paritetstest om dictionary.test.ts har mönster för det**

Öppna `src/lib/dictionary.test.ts`. Om där finns nyckelparitets-tester (sv/en samma nycklar): recap-avsnittet täcks då automatiskt — kör bara testet. Om inte, lägg till:

```ts
import { describe, expect, it } from "vitest";
import { DICT } from "./dictionary";

describe("recap-strängar", () => {
  it("sv och en har samma recap-nycklar", () => {
    expect(Object.keys(DICT.en.recap).sort()).toEqual(
      Object.keys(DICT.sv.recap).sort(),
    );
  });
  it("en.ncLabel konverterar svensk positionstext", () => {
    expect(DICT.en.recap.ncLabel("14:e av 32")).toBe("Nations Cup · 14th of 32");
  });
});
```

- [ ] **Step 4: Kör testerna**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/dictionary.ts src/lib/dictionary.test.ts
git commit -m "feat: dictionary-strängar för VM-recapen (sv + en) — UTKAST inför copy-pass"
```

---

### Task 5: `NumberTicker` — Framer Motion-räknare med server-renderat slutvärde

**Files:**
- Create: `src/components/vm-recap/NumberTicker.tsx`

**Interfaces:**
- Consumes: `motion/react` (`useInView`, `useReducedMotion`, `animate`).
- Produces: `<NumberTicker value={41} suffix=":a" className?>` — används av `RecapStats` (Task 6). SSR-HTML innehåller alltid `{value}{suffix}` färdigt.

- [ ] **Step 1: Implementera komponenten**

```tsx
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
```

- [ ] **Step 2: Verifiera att bygget går**

Run: `npm run build`
Expected: bygget lyckas (komponenten är ännu oanvänd — det är OK i detta task; den konsumeras i Task 6).

- [ ] **Step 3: Commit**

```bash
git add src/components/vm-recap/NumberTicker.tsx
git commit -m "feat: NumberTicker — motion-räknare med server-renderat slutvärde"
```

---

### Task 6: `RecapStats` — nyckeltalsraden med orkestrerad stagger

**Files:**
- Create: `src/components/vm-recap/RecapStats.tsx`

**Interfaces:**
- Consumes: `NumberTicker` (Task 5), `motion/react`.
- Produces: `<RecapStats items={RecapStatItem[]} />` där

```ts
export type RecapStatItem = {
  /** Tal → NumberTicker; text (t.ex. "Semifinal") → statisk */
  value: number | string;
  prefix?: string;
  suffix?: string;
  /** Liten rad under värdet, t.ex. "av 180" */
  detail?: string;
  label: string;
};
```

Används av `VmRecap` (Task 8) och `VmRecapTeaser` (Task 9).

- [ ] **Step 1: Implementera komponenten**

```tsx
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
  show: { transition: { staggerChildren: 0.09 } },
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
      className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4"
      variants={container}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {items.map((stat) => (
        <motion.li
          key={stat.label}
          variants={reduceMotion ? undefined : item}
          className="bg-midnight-800 p-5 sm:p-6"
        >
          <p className="heading-caps text-3xl font-extrabold text-snow sm:text-4xl">
            {typeof stat.value === "number" ? (
              <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            ) : (
              stat.value
            )}
            {stat.detail && (
              <span className="ml-1 text-base font-bold text-mist-dim">{stat.detail}</span>
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
```

- [ ] **Step 2: Verifiera att bygget går**

Run: `npm run build`
Expected: lyckas.

- [ ] **Step 3: Commit**

```bash
git add src/components/vm-recap/RecapStats.tsx
git commit -m "feat: RecapStats — staggerade nyckeltalskort för VM-recapen"
```

---

### Task 7: `RecapChart` — veckokurvan med pathLength-animation

**Files:**
- Create: `src/components/vm-recap/RecapChart.tsx`

**Interfaces:**
- Consumes: `ChartPoint`, `chartPathD` (Task 3), `RecapDay`, `VmRecapData["nationsCup"]` (Task 2), `motion/react`, `next/link`.
- Produces: `<RecapChart points={ChartPoint[]} nationsCup={{position, slug}} lang labels={{ncLabel, chartAria, dayAria}} />` där `labels` är för-evaluerade strängar/funktioner från `DICT[lang].recap`. Används av `VmRecap` (Task 8).

**Arkitektur:** SVG:n (viewBox `0 0 100 100`, `preserveAspectRatio="none"`, `vector-effect="non-scaling-stroke"`) ritar bara linjen. Punkterna är HTML-`<Link>`-element absolut positionerade med samma procentkoordinater — så hover/fokus/tooltip är vanlig HTML med Tailwind, fullt tangentbordsnavigerbara. En sr-only-lista beskriver hela resan för skärmläsare och utan JS.

- [ ] **Step 1: Implementera komponenten**

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ChartPoint } from "@/lib/vm-recap";
import { chartPathD } from "@/lib/vm-recap";

/**
 * "Resan genom veckan": standing-kurvan ritas med pathLength när sektionen
 * scrollas i vy, därefter poppar dagspunkterna in i tur och ordning.
 * Pallplatsdagar får gul punkt — samma språk som resultattabellen på
 * /karriar. Nations Cup är en egen startpunkt med streckad anslutning
 * (annan skala: nationer, inte förare — därför utanför kurvan).
 * Skärmläsare och no-JS får en sr-only-lista med hela resan.
 */
const PATH_DURATION = 1.3;
const POINT_STAGGER = 0.12;

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
    dayAria: (day: number, standing: number) => string;
  };
}) {
  const reduceMotion = useReducedMotion();
  const newsBase = lang === "sv" ? "/nyheter" : "/en/news";
  const first = points[0];

  if (!first) return null;

  const pointDelay = (i: number) =>
    reduceMotion ? 0 : PATH_DURATION * 0.55 + i * POINT_STAGGER;

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
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
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
            <span className="heading-caps absolute left-1/2 top-full mt-1 -translate-x-1/4 whitespace-nowrap text-[10px] tracking-[0.12em] text-mist-dim transition-colors group-hover:text-snow">
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
            initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
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
              aria-label={labels.dayAria(p.day.day, p.day.standing)}
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
              {/* Tooltip med dagens rubrik */}
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-6 w-56 -translate-x-1/2 border border-line bg-midnight px-3 py-2 text-xs leading-snug text-mist opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
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
            <li key={p.day.day}>{labels.dayAria(p.day.day, p.day.standing)}</li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: Verifiera att bygget går**

Run: `npm run build`
Expected: lyckas.

- [ ] **Step 3: Commit**

```bash
git add src/components/vm-recap/RecapChart.tsx
git commit -m "feat: RecapChart — veckokurva med pathLength-ritning och länkade dagspunkter"
```

---

### Task 8: `VmRecap` (server) + integration på /vm-2026 och /en/vm-2026

**Files:**
- Create: `src/components/vm-recap/VmRecap.tsx`
- Modify: `src/app/(sv)/vm-2026/page.tsx` (rad ~106–123: `mode === "after"`-blocket)
- Modify: `src/app/en/vm-2026/page.tsx` (motsvarande after-block, rad ~103)

**Interfaces:**
- Consumes: `getVmRecap`, `chartPoints` (Task 2–3), `RecapStats`/`RecapStatItem` (Task 6), `RecapChart` (Task 7), `DICT[lang].recap` (Task 4), `KWC` (`finalReportSlug`, `result2026`).
- Produces: `<VmRecap lang="sv" | "en" />` — serverkomponent, renderar hela recap-sektionen. Returnerar `null` om `getVmRecap` ger null (då behåller sidan sitt enkla after-block som fallback).

- [ ] **Step 1: Implementera `VmRecap.tsx`**

```tsx
import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import { KWC } from "@/lib/site";
import { chartPoints, getVmRecap } from "@/lib/vm-recap";
import { RecapChart } from "./RecapChart";
import { RecapStats, type RecapStatItem } from "./RecapStats";

/**
 * Full "efter VM"-recap på /vm-2026: nyckeltal + veckokurvan.
 * Serverkomponent — äger data och text; klientbarnen äger bara rörelsen.
 */
export function VmRecap({ lang }: { lang: Lang }) {
  const recap = getVmRecap(lang);
  if (recap === null) return null;

  const t = DICT[lang].recap;
  const newsBase = lang === "sv" ? "/nyheter" : "/en/news";

  const stats: RecapStatItem[] = [
    {
      value: recap.stats.finalStanding,
      suffix: lang === "sv" ? ":a" : "st",
      detail: lang === "sv" ? `av ${recap.stats.fieldSize}` : `of ${recap.stats.fieldSize}`,
      label: t.statFinal,
    },
    { value: recap.stats.heatsRaced, label: t.statHeats },
    { value: recap.stats.podiums, label: t.statPodiums },
    { value: t.statSemiValue, label: t.statSemi },
  ];

  return (
    <section className="mb-16" aria-labelledby="recap-heading">
      <h2 id="recap-heading" className="heading-caps mb-3 text-2xl font-bold text-snow">
        {t.heading}
      </h2>
      <p className="mb-8 max-w-2xl text-mist">{t.intro}</p>

      <RecapStats items={stats} />

      <div className="mt-10 border border-line bg-midnight-800 p-5 sm:p-8">
        <h3 className="heading-caps text-lg font-bold text-snow">{t.journeyHeading}</h3>
        <p className="mb-8 mt-1 text-sm text-mist-dim">{t.journeyIntro}</p>
        <RecapChart
          points={chartPoints(recap.days)}
          nationsCup={recap.nationsCup}
          lang={lang}
          labels={{
            ncLabel: t.ncLabel(recap.nationsCup.position),
            chartAria: t.chartAria,
            dayAria: t.dayAria,
          }}
        />
      </div>

      <p className="mt-6">
        <Link
          href={`${newsBase}/${KWC.finalReportSlug}`}
          className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
        >
          {t.finalReportCta}
        </Link>
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Integrera på svenska sidan**

I `src/app/(sv)/vm-2026/page.tsx`: importera `VmRecap` och ersätt hela `{mode === "after" && (<section …>…</section>)}`-blocket (rad 106–123) med:

```tsx
{mode === "after" && <VmRecap lang="sv" />}
```

Import läggs till: `import { VmRecap } from "@/components/vm-recap/VmRecap";`

- [ ] **Step 3: Integrera på engelska sidan**

Samma mönster i `src/app/en/vm-2026/page.tsx` — läs filens after-block först (det speglar det svenska) och ersätt med:

```tsx
{mode === "after" && <VmRecap lang="en" />}
```

- [ ] **Step 4: Bygg och rök-testa**

Run: `npm run build && npm test`
Expected: bygget lyckas, alla tester PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/vm-recap/VmRecap.tsx "src/app/(sv)/vm-2026/page.tsx" src/app/en/vm-2026/page.tsx
git commit -m "feat: full VM-recap med veckokurva på /vm-2026 (sv + en)"
```

---

### Task 9: `VmRecapTeaser` + integration på startsidorna

**Files:**
- Create: `src/components/vm-recap/VmRecapTeaser.tsx`
- Modify: `src/app/(sv)/page.tsx` (rad ~52–53: CurrentCompetition-anropet)
- Modify: `src/app/en/page.tsx` (motsvarande anrop)

**Interfaces:**
- Consumes: `getVmRecap` (Task 2), `RecapStats` (Task 6), `DICT[lang].recap` (Task 4).
- Produces: `<VmRecapTeaser lang />` — serverkomponent. I after-läget ersätter den `CurrentCompetition` på startsidan; om `getVmRecap` ger null faller sidan tillbaka på `CurrentCompetition`.

- [ ] **Step 1: Implementera `VmRecapTeaser.tsx`**

```tsx
import Link from "next/link";
import { CurrentCompetition } from "@/components/CurrentCompetition";
import { DICT, type Lang } from "@/lib/dictionary";
import { getVmRecap } from "@/lib/vm-recap";
import { RecapStats, type RecapStatItem } from "./RecapStats";

/**
 * Startsidans "efter VM"-teaser: tre nyckeltal + CTA till /vm-2026.
 * Ersätter CurrentCompetition i after-läget; saknas recap-data (status-
 * filen borta) faller vi tillbaka på CurrentCompetitions after-text.
 */
export function VmRecapTeaser({ lang }: { lang: Lang }) {
  const recap = getVmRecap(lang);
  if (recap === null) return <CurrentCompetition lang={lang} mode="after" />;

  const t = DICT[lang].recap;
  const vmHref = lang === "sv" ? "/vm-2026" : "/en/vm-2026";

  const stats: RecapStatItem[] = [
    {
      value: recap.stats.finalStanding,
      suffix: lang === "sv" ? ":a" : "st",
      detail: lang === "sv" ? `av ${recap.stats.fieldSize}` : `of ${recap.stats.fieldSize}`,
      label: t.statFinal,
    },
    { value: recap.stats.podiums, label: t.statPodiums },
    { value: t.statSemiValue, label: t.statSemi },
  ];

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-10 sm:px-6"
      aria-label={t.teaserHeading}
    >
      <div className="border border-line bg-midnight-800 p-6 sm:p-8">
        <p className="heading-caps mb-3 text-xs tracking-[0.16em] text-flagyellow">
          {t.kicker}
        </p>
        <h2 className="heading-caps mb-6 text-2xl font-bold text-snow">
          {t.teaserHeading}
        </h2>
        <RecapStats items={stats} />
        <div className="mt-6">
          <Link href={vmHref} className="btn btn-primary">
            {t.teaserCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

OBS: `RecapStats` renderar `lg:grid-cols-4` — med tre items blir sista kolumnen tom på lg. Justera `RecapStats` i detta task så gridklassen följer antalet:

```tsx
// i RecapStats.tsx — ersätt grid-raden:
className={`grid grid-cols-2 gap-px border border-line bg-line ${
  items.length === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4"
}`}
```

- [ ] **Step 2: Integrera på startsidorna**

I `src/app/(sv)/page.tsx`, ersätt:

```tsx
<CurrentCompetition lang="sv" mode={mode} />
```

med:

```tsx
{mode === "after" ? (
  <VmRecapTeaser lang="sv" />
) : (
  <CurrentCompetition lang="sv" mode={mode} />
)}
```

Import: `import { VmRecapTeaser } from "@/components/vm-recap/VmRecapTeaser";`

Samma mönster i `src/app/en/page.tsx` med `lang="en"` (läs filen först — den speglar den svenska).

- [ ] **Step 3: Bygg och testa**

Run: `npm run build && npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/vm-recap/VmRecapTeaser.tsx src/components/vm-recap/RecapStats.tsx "src/app/(sv)/page.tsx" src/app/en/page.tsx
git commit -m "feat: animerad VM-teaser på startsidan i after-läget (sv + en)"
```

---

### Task 10: Resultatsvepet — audit av kvarvarande före/under-VM-copy

**Files:**
- Inspect (fixa bara det som är inaktuellt): `src/components/career/ChapterVandel.tsx`, `src/app/(sv)/om/page.tsx`, `src/app/en/about/page.tsx` (eller motsv.), `src/app/(sv)/press/page.tsx`, `src/lib/press.ts`, `src/app/(sv)/partners/page.tsx`, `src/app/(sv)/media/page.tsx`, `src/lib/dictionary.ts` (bara strängar som visas i after-läget), metadata i samtliga `page.tsx`.

**Interfaces:**
- Consumes: `KWC.result2026`, `RESULTS`/`STATS` (redan uppdaterade).
- Produces: inga nya API:er — bara copyrättelser.

- [ ] **Step 1: Kör audit-grep och gå igenom träffarna**

```bash
grep -rn --include="*.tsx" --include="*.ts" -E "pågår|väntar|kommer att köra|ska köra|inför VM|laddar för|countdown|nedräkning" src/ | grep -v "\.test\." | grep -vE "mode|before|during"
```

Bedömningskriterium per träff: visas texten i after-läget (eller alltid)? Låter den som att VM ligger framför oss? → skriv om till efter-VM-framing med resultat ur `KWC.result2026`/`RESULTS`. Strängar som bara renderas i `before`/`during`-grenar lämnas orörda (koden är lägesstyrd — död copy i fel läge är inte en bugg).

- [ ] **Step 2: Kontrollera kända misstänkta ytor manuellt**

Läs och bedöm (sv + en där parallell finns):
1. `ChapterVandel.tsx` — after-grenen finns; verifiera att texten stämmer med slutresultatet.
2. `/om`-sidan — biografi-framing.
3. `/press` + `lib/press.ts` — pressmaterialets beskrivningar.
4. `/partners` — säljtext ("möjliggörs av" är OK, men framtida VM-löften är inte det).
5. Metadata (`title`/`description`) på alla sidor — jämför med de redan uppdaterade i `vm-2026/page.tsx`.

- [ ] **Step 3: Rätta fynden**

Varje rättelse: hämta siffror från `lib/site.ts`/`lib/results.ts`, hårdkoda aldrig. Skriv utkast — slutgiltig ton sätts i Task 11.

- [ ] **Step 4: Bygg och testa**

Run: `npm run build && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/
git commit -m "fix(sv+en): resultatsvep — kvarvarande före/under-VM-copy uppdaterad till efter-läget"
```

---

### Task 11: Copy-kedjan (körs av orkestratorn, INTE subagent)

**Files:**
- Modify: `src/lib/dictionary.ts` (recap-strängarna), ev. filer från Task 10.

Orkestratorn kör projektets obligatoriska kedja på all ny/ändrad användarvänd text från Task 4, 8, 9, 10:

- [ ] **Step 1:** `copywriting` — förbättra utkasten (rubriker, CTA:er, statetiketter).
- [ ] **Step 2:** `seo-audit` — meta/rubrikstruktur på berörda sidor.
- [ ] **Step 3:** `ai-seo` — AEO-pass (recapen är ett utmärkt citerbart "hur gick VM"-svar).
- [ ] **Step 4:** `humanizer` — sista pass, Rickards ödmjuka ton (minne: `ton-odmjuk-copy.md`).
- [ ] **Step 5:** Kör `npm test` (dictionary-pariteten skyddar nyckelstrukturen) och committa:

```bash
git add -A src/
git commit -m "fix(sv+en): copy-pass på recapens strängar — ton, SEO och AEO"
```

---

### Task 12: Browser-verifiering + animationsgranskning

**Files:** inga nya — verifiering.

- [ ] **Step 1: Starta preview** (launch.json-konfigen `nextjs-dev`) och verifiera på `/`:
  - Teasern visas i stället för CurrentCompetition, tre kort fjädrar in staggered, CTA leder till /vm-2026.
- [ ] **Step 2: Verifiera `/vm-2026`:**
  - Nyckeltalsraden animeras in; siffrorna räknar upp från 0 först när de scrollas i vy.
  - Kurvan ritas vänster→höger, därefter poppar punkterna in i ordning; pallplatsdagar (8, 9, 10) är gula; dag 7 och 11 blå.
  - Hover/fokus på punkt visar tooltip med dagens rubrik; Tab-navigering når alla punkter; klick leder till rätt dagsrapport; NC-punkten leder till `nations-cup-finalen`.
- [ ] **Step 3: Reduced motion:** emulera `prefers-reduced-motion: reduce` → allt står i slutläge direkt, inga animationer, inga dolda element.
- [ ] **Step 4: Mobil (375px):** grafen läsbar, etiketter utan overflow, inga horisontella scrollbars.
- [ ] **Step 5: Engelska:** `/en` + `/en/vm-2026` — samma beteende, engelska strängar, "14th of 32".
- [ ] **Step 6: No-JS-kontroll:** view-source på `/vm-2026` — slutvärdena ("41", "180", "3", "9") finns i HTML:en, sr-only-listan komplett.
- [ ] **Step 7:** Kör `review-animations` (emil-design-eng) — åtgärda fynd tills godkänt.
- [ ] **Step 8:** Kör `/code-review` på diffen — åtgärda CRITICAL/HIGH.
- [ ] **Step 9: Slutcommit + push** (efter Rickards OK):

```bash
git push -u origin feat/efter-vm-recap
```

---

## Självgranskning (utförd vid planskrivning)

- **Spec-täckning:** teaser (T9), full recap (T8), graf (T3+T7), datalager (T2), motion-hygien (T5–T7 + T12), resultatsvep (T10), copy-kedja (T11), sv+en (T4, T8, T9), nytt beroende (T1). ✓
- **Placeholder-scan:** inga TBD; Task 10 är en audit med explicit procedur och bedömningskriterium (fynden kan inte listas i förväg). ✓
- **Typkonsekvens:** `RecapDay`/`VmRecapData`/`ChartPoint`/`RecapStatItem` används med samma namn i T2→T3→T6→T7→T8→T9. `chartPathD` konsumeras i T7 med signaturen från T3. ✓
