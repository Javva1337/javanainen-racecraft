# EN-port av scrollytelling-karriären — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/en/career` blir samma scrolldrivna berättelse som `/karriar` — via `lang`-prop och copy-objekt per komponent, utan att animationslagret dubbleras.

**Architecture:** `ChapterDef.title` blir `{sv,en}` i `career-story.ts`; varje career-komponent får obligatorisk `lang: Lang` och ett `const COPY = { sv: {...}, en: {...} } as const`-objekt överst; sidnivå-copy (prolog/epilog) ligger inline i respektive `page.tsx` enligt spegelmönstret. GSAP/Lenis-koden rörs aldrig.

**Tech Stack:** Next.js 15 (RSC), GSAP/ScrollTrigger/Lenis (orört), Tailwind 4, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-17-en-karriar-port-design.md`

## Global Constraints

- **Arbetskatalog:** worktreen `C:/dev/javanainen-engelska`, gren `feat/engelska-omtag`. Rör ALDRIG OneDrive-katalogen.
- **OneDrive-regeln:** kör aldrig `npm run dev` och `npm run build` samtidigt.
- **Test/Build:** `npm test` (67 ska passera) och `npm run build` i varje task.
- **Svenska sidan:** `/karriar`s renderade copy och DOM-struktur får INTE ändras — enbart `lang="sv"`-props tillkommer. Animations-/GSAP-kod får inte ändras i någon komponent.
- **Siffror:** alltid ur `STORY_FACTS`/`RESULTS`/`STATS`/`KWC` — aldrig nya hårdkodade tal. Bildtexters plats/år är verifierade fakta och översätts ordagrant (Spanien→Spain, Polen→Poland, Italien→Italy, Sverige→Sweden; årtal oförändrade).
- **Copy-mönster:** `const COPY = { sv: {...}, en: {...} } as const;` överst i komponenten, `const t = COPY[lang];` — inga språkvillkor inne i JSX utom där planen visar det.
- **`Lang`-typen:** `import type { Lang } from "@/lib/dictionary";`
- **Engelska:** ödmjuk ton; copyn i denna plan är den godkända texten — transkribera ordagrant.
- **Commits:** conventional commits på svenska, INGA Co-Authored-By-rader, inga `--no-verify`/`--no-gpg-sign`-flaggor.

---

### Task 1: Tvåspråkiga kapiteltitlar + lang på nav/skal/scrollcue

**Files:**
- Modify: `src/lib/career-story.ts`
- Modify: `src/components/career/ChapterSection.tsx`
- Modify: `src/components/career/ChapterNav.tsx`
- Modify: `src/components/career/ScrollCue.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (endast props)
- Modify (tillfälliga `lang="sv"`-literaler): `src/components/career/ChapterDalarna.tsx`, `ChapterBanracing.tsx`, `ChapterGenombrottet.tsx`, `ChapterBronset.tsx`, `ChapterJakten.tsx`, `ChapterVandel.tsx`

**Interfaces:**
- Produces: `ChapterDef.title: { sv: string; en: string }`; `ChapterSection({ chapter, lang, children, className?, lede? })`; `ChapterNav({ chapters, lang })`; `ScrollCue({ lang })`. Task 2–6 ersätter kapitlens tillfälliga `lang="sv"` med en egen prop.

- [ ] **Step 1: `career-story.ts` — titlar blir `{sv,en}`**

Ersätt `title: string;` i `ChapterDef` med:

```ts
  title: { sv: string; en: string };
```

och ersätt hela `CHAPTERS`-arrayen med:

```ts
export const CHAPTERS: ChapterDef[] = [
  { id: "prolog", num: null, years: "", title: { sv: "Prolog", en: "Prologue" } },
  { id: "dalarna", num: "01", years: "2002–2006", title: { sv: "Dalarna", en: "Dalarna" } },
  { id: "banracing", num: "02", years: "2007–2011", title: { sv: "Banracing", en: "Circuit racing" } },
  {
    id: "genombrottet",
    num: "03",
    years: "2015",
    title: { sv: "Genombrottet", en: "The breakthrough" },
    podium: true,
  },
  { id: "bronset", num: "04", years: "2016", title: { sv: "Bronset", en: "The bronze" }, podium: true },
  { id: "jakten", num: "05", years: "2017–2021", title: { sv: "Jakten", en: "The chase" }, podium: true },
  { id: "vandel", num: "06", years: "2026", title: { sv: "Vandel", en: "Vandel" } },
  { id: "facit", num: null, years: "2015–2026", title: { sv: "Facit", en: "The tally" } },
];
```

- [ ] **Step 2: `ChapterSection.tsx` — lang-prop + etikett**

Lägg till importen `import type { Lang } from "@/lib/dictionary";` och (efter importerna):

```ts
const COPY = {
  sv: { chapterLabel: "Kapitel" },
  en: { chapterLabel: "Chapter" },
} as const;
```

Byt signaturen till:

```ts
export function ChapterSection({
  chapter,
  lang,
  children,
  className = "",
  lede,
}: {
  chapter: ChapterDef;
  lang: Lang;
  children: React.ReactNode;
  className?: string;
  /** Kort ingress under rubriken */
  lede?: string;
}) {
  const t = COPY[lang];
```

Byt etikettraden:

```tsx
            <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
              {t.chapterLabel} {chapter.num} <span aria-hidden="true">·</span> {chapter.years}
            </p>
```

och rubriken:

```tsx
              {chapter.title[lang]}
```

- [ ] **Step 3: `ChapterNav.tsx` — lang-prop + UI-strängar**

Lägg till `import type { Lang } from "@/lib/dictionary";` och (efter importerna):

```ts
const COPY = {
  sv: {
    progression: "Kapitelprogression",
    chapterAria: (num: string, title: string) => `Kapitel ${num}: ${title}`,
    button: "Kapitel",
    choose: "Välj kapitel",
    close: "Stäng",
  },
  en: {
    progression: "Chapter progression",
    chapterAria: (num: string, title: string) => `Chapter ${num}: ${title}`,
    button: "Chapters",
    choose: "Choose a chapter",
    close: "Close",
  },
} as const;
```

Byt signaturen till:

```ts
export function ChapterNav({ chapters, lang }: { chapters: ChapterDef[]; lang: Lang }) {
  const t = COPY[lang];
```

Byt sedan exakt dessa fem textställen (animations-/fokuslogiken orörd):

```tsx
      <nav
        aria-label={t.progression}
```

```tsx
                aria-label={
                  chapter.num
                    ? t.chapterAria(chapter.num, chapter.title[lang])
                    : chapter.title[lang]
                }
```

```tsx
                  {chapter.num ? `${chapter.num} · ${chapter.title[lang]}` : chapter.title[lang]}
```

Knappen (texten efter hamburger-spannet): `        {t.button}` i stället för `        Kapitel`.

Overlayn:

```tsx
          <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">{t.choose}</p>
```

```tsx
            {t.close}
```

och menyradens titel:

```tsx
                  <span className="heading-caps text-2xl font-extrabold leading-none sm:text-4xl">
                    {chapter.title[lang]}
                  </span>
```

samt `aria-label={t.choose}` på dialog-diven (ersätter `aria-label="Välj kapitel"`).

- [ ] **Step 4: `ScrollCue.tsx` — hela nya filen**

```tsx
import type { Lang } from "@/lib/dictionary";

const COPY = { sv: "Scrolla", en: "Scroll" } as const;

/**
 * Scrollindikator i prologen — ren CSS-animation (motion-reduce döljer pulsen,
 * etiketten står kvar). Server-renderad.
 */
export function ScrollCue({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col items-center gap-3" aria-hidden="true">
      <span className="heading-caps text-[0.6rem] tracking-[0.22em] text-mist-dim">
        {COPY[lang]}
      </span>
      <span className="relative block h-10 w-px overflow-hidden bg-line">
        <span className="absolute left-0 top-0 h-4 w-px animate-scroll-cue bg-flagyellow motion-reduce:hidden" />
      </span>
    </div>
  );
}
```

- [ ] **Step 5: Uppdatera anroparna så bygget går grönt**

I `src/app/(sv)/karriar/page.tsx`: `<ChapterNav chapters={CHAPTERS} lang="sv" />` och `<ScrollCue lang="sv" />`.

I var och en av de sex kapitelkomponenterna (`ChapterDalarna`, `ChapterBanracing`, `ChapterGenombrottet`, `ChapterBronset`, `ChapterJakten`, `ChapterVandel`): lägg till `lang="sv"` på `<ChapterSection …>`-anropet, t.ex.:

```tsx
    <ChapterSection chapter={chapter} lang="sv" lede="Tio år gammal. Första gokarten.">
```

(Detta är TILLFÄLLIGT — Task 2–6 byter literalen mot komponentens egen `lang`-prop.)

- [ ] **Step 6: Verifiera**

Kör: `npm test` → 67 PASS. Kör: `npm run build` → lyckas (typfel här = missad läsare av `title[lang]`).

- [ ] **Step 7: Commit**

```bash
git add src/lib/career-story.ts src/components/career "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(karriar): tvasprakiga kapiteltitlar + lang pa nav, kapitelskal och scrollcue"
```

---

### Task 2: Dalarna + Banracing + GinettaStats på engelska

**Files:**
- Modify: `src/components/career/ChapterDalarna.tsx`
- Modify: `src/components/career/ChapterBanracing.tsx`
- Modify: `src/components/career/GinettaStats.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (props)

**Interfaces:**
- Consumes: `ChapterSection({ chapter, lang, … })` från Task 1.
- Produces: `ChapterDalarna({ lang })`, `ChapterBanracing({ lang })`, `GinettaStats({ lang })`. Task 7 renderar dem med `lang="en"`.

- [ ] **Step 1: `ChapterDalarna.tsx` — hela nya filen**

```tsx
import { Kurbits } from "@/components/Kurbits";
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { BackdropYear } from "./BackdropYear";
import { ChapterSection } from "./ChapterSection";

const chapter = CHAPTERS.find((c) => c.id === "dalarna")!;

const COPY = {
  sv: {
    lede: "Tio år gammal. Första gokarten.",
    p1: "Första steget in i motorsport togs 2002, i en gokart i Dalarna. Tio år gammal, och direkt fast.",
    p2: "Åren som följde, 2002–2006, blev flera år av utveckling genom olika gokartklasser — med flertalet vinster och pallplatser längs vägen.",
    plateLabel: "Där det började",
  },
  en: {
    lede: "Ten years old. The first go-kart.",
    p1: "The first step into motorsport came in 2002, in a go-kart in Dalarna. Ten years old, and instantly hooked.",
    p2: "The years that followed, 2002–2006, brought several seasons of development through different karting classes — with a number of wins and podiums along the way.",
    plateLabel: "Where it started",
  },
} as const;

/** Kapitel 01 — Dalarna (2002–2006). Där det började: första gokarten, tio år gammal. */
export function ChapterDalarna({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <BackdropYear year="2002" className="-right-8 top-4 sm:-right-16" />

      <div className="relative mt-12 grid gap-10 sm:mt-16 sm:grid-cols-[3fr_2fr] sm:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
        </div>

        {/* Inga arkivbilder från åren finns bevarade — grafisk platta med kurbitslinje,
            komponerad som en bokplatta: speglade kurbitsar ramar in plats och år */}
        <figure
          className="flex aspect-square flex-col items-center justify-center gap-8 border border-line bg-midnight-800 p-8"
          data-chapter-plate
        >
          <Kurbits className="w-44 max-w-full text-flagblue" />
          <figcaption className="flex flex-col items-center gap-2 text-center">
            <span className="heading-caps text-[0.65rem] tracking-[0.22em] text-mist-dim">
              {t.plateLabel}
            </span>
            <span className="heading-caps tabular text-2xl font-bold text-snow">
              Dalarna <span aria-hidden="true">·</span> 2002
            </span>
          </figcaption>
          <Kurbits className="w-44 max-w-full rotate-180 text-flagblue" />
        </figure>
      </div>
    </ChapterSection>
  );
}
```

- [ ] **Step 2: `ChapterBanracing.tsx` — hela nya filen**

```tsx
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { ChapterSection } from "./ChapterSection";
import { GinettaStats } from "./GinettaStats";

const chapter = CHAPTERS.find((c) => c.id === "banracing")!;

const COPY = {
  sv: {
    lede: "Ur gokarten, in i bilarna.",
    renault: "2:a plats totalt.",
    jtcc: "Junior Touring Car Championship. Flertalet pallplatser.",
  },
  en: {
    lede: "Out of the kart, into the cars.",
    renault: "2nd overall.",
    jtcc: "Junior Touring Car Championship. Multiple podiums.",
  },
} as const;

/** Kapitel 02 — Banracing (2007–2011): Renault Junior Cup, JTCC, Ginetta G20 Cup. */
export function ChapterBanracing({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <div className="mt-12 space-y-10 sm:mt-16">
        <ol className="space-y-6" data-chapter-copy>
          <li className="flex flex-col gap-1 border-b border-line/60 pb-6 sm:flex-row sm:items-baseline sm:gap-8">
            <span className="heading-caps tabular w-28 shrink-0 text-sm font-bold text-mist-dim">
              2007
            </span>
            <div>
              <h3 className="heading-caps text-lg text-snow">Renault Junior Cup</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">{t.renault}</p>
            </div>
          </li>
          <li className="flex flex-col gap-1 border-b border-line/60 pb-6 sm:flex-row sm:items-baseline sm:gap-8">
            <span className="heading-caps tabular w-28 shrink-0 text-sm font-bold text-mist-dim">
              2008–2010
            </span>
            <div>
              <h3 className="heading-caps text-lg text-snow">JTCC</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">{t.jtcc}</p>
            </div>
          </li>
        </ol>

        <GinettaStats lang={lang} />
      </div>
    </ChapterSection>
  );
}
```

- [ ] **Step 3: `GinettaStats.tsx` — copy-objekt + lang**

Lägg till `import type { Lang } from "@/lib/dictionary";` och ersätt blocket `const GINETTA = …` t.o.m. `const displayOf = …` med:

```ts
const GINETTA = STORY_FACTS.ginetta2011;

const COPY = {
  sv: {
    intro: "Inhopp mitt i säsongen, som stand-in utan försäsong.",
    placeSuffix: ":a",
    wins: "vinster",
    races: "race",
    ofTotal: (drivers: number) => `av ${drivers} totalt`,
    note: (place: number, drivers: number) =>
      `${place}:a av ${drivers} förare totalt — med bara hälften av racen körda.`,
  },
  en: {
    intro: "A mid-season call-up, as a stand-in with no pre-season.",
    placeSuffix: "th",
    wins: "wins",
    races: "races",
    ofTotal: (drivers: number) => `of ${drivers} overall`,
    note: (place: number, drivers: number) =>
      `${place}th of ${drivers} drivers overall — having raced only half the season.`,
  },
} as const;

type GinettaStat = { value: number; suffix: string; label: string };

const statsFor = (lang: Lang): GinettaStat[] => [
  { value: GINETTA.wins, suffix: "", label: COPY[lang].wins },
  { value: GINETTA.races, suffix: "", label: COPY[lang].races },
  { value: GINETTA.place, suffix: COPY[lang].placeSuffix, label: COPY[lang].ofTotal(GINETTA.drivers) },
];

const displayOf = (stat: GinettaStat) => `${stat.value}${stat.suffix}`;
```

Byt signaturen till `export function GinettaStats({ lang }: { lang: Lang })` och lägg som första rader i komponenten:

```ts
  const t = COPY[lang];
  const stats = statsFor(lang);
```

I `useGSAP`-callbacken: byt de två förekomsterna av `GINETTA_STATS` mot `stats` (`values.length !== stats.length` och `const stat = stats[i];` samt `displayOf(stats[i])` i `restore`). Animationslogiken i övrigt orörd.

I JSX: introraden byts till `{t.intro}`, `{GINETTA_STATS.map((stat) => (` → `{stats.map((stat) => (`, och not-stycket byts till:

```tsx
      <p className="mt-8 text-sm leading-relaxed text-mist" data-ginetta-note>
        {t.note(GINETTA.place, GINETTA.drivers)}
      </p>
```

Kickern `Ginetta G20 Cup <span aria-hidden="true">·</span> 2011` är språkneutral — orörd.

- [ ] **Step 4: Svenska sidan skickar lang**

I `src/app/(sv)/karriar/page.tsx`: `<ChapterDalarna lang="sv" />` och `<ChapterBanracing lang="sv" />`.

- [ ] **Step 5: Verifiera**

Kör: `npm test` → 67 PASS. Kör: `npm run build` → lyckas.

- [ ] **Step 6: Commit**

```bash
git add src/components/career/ChapterDalarna.tsx src/components/career/ChapterBanracing.tsx src/components/career/GinettaStats.tsx "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(en-karriar): Dalarna, Banracing och Ginetta-statistiken pa engelska"
```

---

### Task 3: Genombrottet + stinten på engelska

**Files:**
- Modify: `src/components/career/ChapterGenombrottet.tsx`
- Modify: `src/components/career/StintSequence.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (props)

**Interfaces:**
- Consumes: `ChapterSection({ chapter, lang, … })`.
- Produces: `ChapterGenombrottet({ lang })`, `StintSequence({ lang })`.

- [ ] **Step 1: `ChapterGenombrottet.tsx` — hela nya filen**

```tsx
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { ChapterSection } from "./ChapterSection";
import { StintSequence } from "./StintSequence";

const chapter = CHAPTERS.find((c) => c.id === "genombrottet")!;

const COPY = {
  sv: {
    lede: "Tillbaka i karten — och allt föll på plats.",
    p1Highlight: "Vinnare av första upplagan av SRKC Linköping.",
    p1Rest: " Samma år: VM-debut i Italien, 11:e av 127 individuellt.",
    p2: "Men det var i Nations Cup som stinten kom att definiera året.",
  },
  en: {
    lede: "Back in the kart — and everything fell into place.",
    p1Highlight: "Winner of the inaugural SRKC in Linköping.",
    p1Rest: " The same year: a Worlds debut in Italy, 11th of 127 individually.",
    p2: "But it was in the Nations Cup that one stint came to define the year.",
  },
} as const;

/** Kapitel 03 — Genombrottet (2015): SRKC-vinst, VM-debut och Nations Cup-stinten. */
export function ChapterGenombrottet({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <div className="mt-12 space-y-5 text-base leading-relaxed text-mist sm:mt-16 sm:text-lg" data-chapter-copy>
        <p>
          <span className="text-snow">{t.p1Highlight}</span>
          {t.p1Rest}
        </p>
        <p>{t.p2}</p>
      </div>

      <StintSequence lang={lang} />
    </ChapterSection>
  );
}
```

- [ ] **Step 2: `StintSequence.tsx` — copy-objekt + lang**

Lägg till `import type { Lang } from "@/lib/dictionary";` och efter `const LADDER_STEPS = 14;`:

```ts
const COPY = {
  sv: {
    event: "Italien 2015",
    from: "Sist",
    label: "En stint. Från sist till först.",
    note: "Laget gick i mål som femma totalt.",
  },
  en: {
    event: "Italy 2015",
    from: "Last",
    label: "One stint. From last to first.",
    note: "The team crossed the line fifth overall.",
  },
} as const;
```

Byt signaturen till `export function StintSequence({ lang }: { lang: Lang })` och lägg `const t = COPY[lang];` först i komponenten. Byt sedan exakt fyra textställen i JSX (animationskoden orörd; "Nations Cup" och "P1" är språkneutrala):

```tsx
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Nations Cup <span aria-hidden="true">·</span> {t.event}
      </p>
```

`Sist`-spannet: `              {t.from}` — `P1`-spannet orört.

```tsx
          <p
            data-stint-label
            className="heading-caps mt-4 text-sm tracking-[0.14em] text-snow sm:text-base"
          >
            {t.label}
          </p>
```

```tsx
      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mist" data-stint-note>
        {t.note}
      </p>
```

- [ ] **Step 3: Svenska sidan:** `<ChapterGenombrottet lang="sv" />`.

- [ ] **Step 4: Verifiera:** `npm test` → 67 PASS; `npm run build` → lyckas.

- [ ] **Step 5: Commit**

```bash
git add src/components/career/ChapterGenombrottet.tsx src/components/career/StintSequence.tsx "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(en-karriar): Genombrottet och stint-sekvensen pa engelska"
```

---

### Task 4: Bronset-sekvensen + startfältet + citatet på engelska

**Files:**
- Modify: `src/components/career/ChapterBronset.tsx`
- Modify: `src/components/career/BronzeSequence.tsx`
- Modify: `src/components/career/StartFieldGrid.tsx`
- Modify: `src/components/career/QuoteInterlude.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (props)

**Interfaces:**
- Consumes: `ChapterSection({ chapter, lang, … })`.
- Produces: `ChapterBronset({ lang })`, `BronzeSequence({ lang })`, `StartFieldGrid({ lang, className? })` (`heroTravelDelta` oförändrad), `QuoteInterlude({ quote, lang })`.

- [ ] **Step 1: `ChapterBronset.tsx` — hela nya filen**

```tsx
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { BronzeSequence } from "./BronzeSequence";
import { ChapterSection } from "./ChapterSection";

const chapter = CHAPTERS.find((c) => c.id === "bronset")!;

const COPY = {
  sv: { lede: "VM i Italien. Året då det bar hela vägen till pallen." },
  en: { lede: "The Worlds in Italy. The year it went all the way to the podium." },
} as const;

/** Kapitel 04 — Bronset (2016). Berättelsens klimax: vinst i finalen, 3:e av 102. */
export function ChapterBronset({ lang }: { lang: Lang }) {
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={COPY[lang].lede}>
      <BronzeSequence lang={lang} />
    </ChapterSection>
  );
}
```

- [ ] **Step 2: `BronzeSequence.tsx` — copy-objekt + lang**

Lägg till `import type { Lang } from "@/lib/dictionary";` och efter `gsap.registerPlugin(...)`:

```ts
const COPY = {
  sv: {
    act1Kicker: "Finalen",
    act1Event: "VM Italien 2016",
    heading: "Vinst i finalen",
    body: "Med samma kartar för alla avgörs finalen på det man själv gör bakom ratten. Den här gången räckte det hela vägen.",
    imgAlt: "Prispallen i VM 2016 — Rickard Javanainen överst med svenska flaggan",
    figcaption: "Italien, 2016",
    fieldLabel: "Hela startfältet",
    drivers: "förare",
    result: "3:e",
    of: "av",
    medal: "VM-brons",
    note: "Samma mästerskap: 5:a med Sverige i Nations Cup, där en miss i ett depåstopp kostade chansen till segern.",
  },
  en: {
    act1Kicker: "The final",
    act1Event: "Worlds, Italy 2016",
    heading: "Won the final",
    body: "With the same karts for everyone, the final comes down to what you do behind the wheel. This time it went all the way.",
    imgAlt: "The 2016 Worlds podium — Rickard Javanainen on top with the Swedish flag",
    figcaption: "Italy, 2016",
    fieldLabel: "The full field",
    drivers: "drivers",
    result: "3rd",
    of: "of",
    medal: "Worlds bronze",
    note: "The same championship: 5th with Sweden in the Nations Cup, where a pit-stop mistake cost the team a shot at the win.",
  },
} as const;
```

Byt signaturen till `export function BronzeSequence({ lang }: { lang: Lang })` och lägg `const t = COPY[lang];` direkt före `const rootRef`. `useGSAP`-blocket orört. Byt sedan textställena i JSX:

```tsx
          <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
            {t.act1Kicker} <span aria-hidden="true">·</span> {t.act1Event}
          </p>
```

H3-innehållet: `            {t.heading}` (understryknings-spannen orörd). Brödtexten: `{t.body}`. Bilden: `alt={t.imgAlt}`. Figcaption: `{t.figcaption}`.

Akt 2:

```tsx
        <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
          {t.fieldLabel} <span aria-hidden="true">·</span> {STORY_FACTS.field2016} {t.drivers}
        </p>
        <StartFieldGrid lang={lang} className="mt-8 w-full max-w-3xl" />
```

Resultatet: `            {t.result}` respektive `            {t.of} {STORY_FACTS.field2016}`. Medaljen: `          {t.medal}`. Noten: `          {t.note}`.

- [ ] **Step 3: `StartFieldGrid.tsx` — aria-label per språk**

Lägg till `import type { Lang } from "@/lib/dictionary";` och efter `const HERO_INDEX = 2;`:

```ts
const ARIA = {
  sv: (drivers: number) => `Startfältet i VM 2016: ${drivers} förare, tredjeplatsen markerad`,
  en: (drivers: number) => `The 2016 Worlds field: ${drivers} drivers, third place highlighted`,
} as const;
```

Byt signaturen till:

```ts
export function StartFieldGrid({ lang, className = "" }: { lang: Lang; className?: string }) {
```

och aria-attributet till `aria-label={ARIA[lang](FIELD_SIZE)}`. `heroTravelDelta` och SVG-koden i övrigt orörda.

- [ ] **Step 4: `QuoteInterlude.tsx` — hela nya filen**

```tsx
import { Kurbits } from "@/components/Kurbits";
import type { Lang } from "@/lib/dictionary";

const ARIA_LABEL = { sv: "Citat", en: "Quote" } as const;

/**
 * Citat-mellanspel: helskärmssektion mellan kapitel — andrum som ger rytm.
 * Tonar/skalar in via animationslagret (data-quote); statiskt fullt synlig.
 *
 * TODO(Rickard): platshållarcitat — byt till ett riktigt citat från Rickard.
 */
export function QuoteInterlude({ quote, lang }: { quote: string; lang: Lang }) {
  return (
    <section
      aria-label={ARIA_LABEL[lang]}
      className="flex min-h-[80svh] items-center justify-center px-6 py-24"
    >
      <figure data-quote className="max-w-3xl text-center">
        <Kurbits className="mx-auto mb-8 w-24 text-flagblue" />
        <blockquote>
          <p className="font-display text-3xl font-semibold leading-tight text-snow sm:text-5xl">
            ”{quote}”
          </p>
        </blockquote>
      </figure>
    </section>
  );
}
```

- [ ] **Step 5: Svenska sidan:** `<ChapterBronset lang="sv" />` och `<QuoteInterlude quote="Med samma material för alla finns inget att gömma sig bakom." lang="sv" />`.

- [ ] **Step 6: Verifiera:** `npm test` → 67 PASS; `npm run build` → lyckas.

- [ ] **Step 7: Commit**

```bash
git add src/components/career/ChapterBronset.tsx src/components/career/BronzeSequence.tsx src/components/career/StartFieldGrid.tsx src/components/career/QuoteInterlude.tsx "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(en-karriar): Bronset-sekvensen, startfaltet och citatet pa engelska"
```

---

### Task 5: Jakten + räknarna på engelska

**Files:**
- Modify: `src/components/career/ChapterJakten.tsx`
- Modify: `src/components/career/FieldCounter.tsx`
- Modify: `src/components/career/ClimbCounter.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (props)

**Interfaces:**
- Consumes: `ChapterSection({ chapter, lang, … })`; `GalleryStripe({ items, hint? })` (befintlig — får INGEN lang-prop, `hint` + items skickas per språk härifrån).
- Produces: `ChapterJakten({ lang })`, `FieldCounter({ lang })`, `ClimbCounter({ lang })`.

- [ ] **Step 1: `ChapterJakten.tsx` — hela nya filen**

```tsx
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { ChapterSection } from "./ChapterSection";
import { ClimbCounter } from "./ClimbCounter";
import { FieldCounter } from "./FieldCounter";
import { GalleryStripe, type StripeItem } from "./GalleryStripe";

const chapter = CHAPTERS.find((c) => c.id === "jakten")!;

/** Bildtexter "Plats, År" — samma verifierade uppgifter som i lib/media.ts. */
const STRIPE_ITEMS: Record<Lang, StripeItem[]> = {
  sv: [
    {
      kind: "image",
      src: "/images/gallery-1.jpg",
      alt: "Action på banan i VM 2017",
      caption: "Spanien, 2017",
    },
    {
      kind: "image",
      src: "/images/gallery-2.jpg",
      alt: "Fokus före start i VM 2018",
      caption: "Polen, 2018",
    },
    {
      kind: "stat",
      years: "SRKC · 2021",
      value: "6:a",
      label: "totalt i finalen — näst bästa svensk.",
    },
  ],
  en: [
    {
      kind: "image",
      src: "/images/gallery-1.jpg",
      alt: "On-track action at the 2017 Worlds",
      caption: "Spain, 2017",
    },
    {
      kind: "image",
      src: "/images/gallery-2.jpg",
      alt: "Focus before the start at the 2018 Worlds",
      caption: "Poland, 2018",
    },
    {
      kind: "stat",
      years: "SRKC · 2021",
      value: "6th",
      label: "overall in the final — second-best Swede.",
    },
  ],
};

const COPY = {
  sv: {
    lede: "Spanien, Göteborg, Polen. Jämnheten byggdes race för race.",
    srkcPre: "2018 kom den andra SRKC-titeln: ",
    srkcHighlight: "vinst i SRKC Göteborg.",
    srkcPost: " Och i VM i Polen samma år, ett finalrace att minnas:",
    galleryHint: "Scrolla för att utforska",
  },
  en: {
    lede: "Spain, Gothenburg, Poland. The consistency was built race by race.",
    srkcPre: "2018 brought the second SRKC title: ",
    srkcHighlight: "a win in SRKC Gothenburg.",
    srkcPost: " And at the Worlds in Poland that year, a final race to remember:",
    galleryHint: "Scroll to explore",
  },
} as const;

/** Kapitel 05 — Jakten (2017–2021): största startfältet, andra SRKC-titeln, klättringen i Polen. */
export function ChapterJakten({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      {/* Spanien 2017 — det bärande talet */}
      <div className="mt-12 sm:mt-16">
        <FieldCounter lang={lang} />
      </div>

      {/* SRKC Göteborg 2018 — andra titeln */}
      <p className="mt-14 max-w-2xl text-base leading-relaxed text-mist sm:mt-20 sm:text-lg">
        {t.srkcPre}
        <span className="text-snow">{t.srkcHighlight}</span>
        {t.srkcPost}
      </p>

      <div className="mt-8">
        <ClimbCounter lang={lang} />
      </div>

      <GalleryStripe items={STRIPE_ITEMS[lang]} hint={t.galleryHint} />
    </ChapterSection>
  );
}
```

- [ ] **Step 2: `FieldCounter.tsx` — copy + lang**

Lägg till `import type { Lang } from "@/lib/dictionary";` och efter `const FIELD_SIZE_2017 = STORY_FACTS.field2017;`:

```ts
const COPY = {
  sv: {
    bigLabel: "förare — största startfältet hittills.",
    body: (field: number) => `VM i Spanien 2017: 12:e av ${field}. 5:a med Sverige i Nations Cup.`,
  },
  en: {
    bigLabel: "drivers — the largest field to date.",
    body: (field: number) =>
      `The Worlds in Spain 2017: 12th of ${field}. 5th with Sweden in the Nations Cup.`,
  },
} as const;
```

Signaturen: `export function FieldCounter({ lang }: { lang: Lang })`, `const t = COPY[lang];` först i komponenten. JSX-textställena:

```tsx
        <span className="heading-caps text-sm tracking-[0.12em] text-mist sm:text-lg">
          {t.bigLabel}
        </span>
```

```tsx
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
        {t.body(FIELD_SIZE_2017)}
      </p>
```

- [ ] **Step 3: `ClimbCounter.tsx` — copy + lang**

Lägg till `import type { Lang } from "@/lib/dictionary";` och efter `const CLIMB_TO = STORY_FACTS.climb2018.to;`:

```ts
const COPY = {
  sv: {
    kicker: "Finalracet",
    event: "VM Polen 2018",
    label: (from: number, to: number) => `Från ${from}:e till ${to}:e i finalracet.`,
    note: "14:e av 131 i mästerskapet totalt. 6:a med Sverige i Nations Cup.",
  },
  en: {
    kicker: "The final race",
    event: "Worlds, Poland 2018",
    label: (from: number, to: number) => `From ${from}th to ${to}th in the final race.`,
    note: "14th of 131 in the championship overall. 6th with Sweden in the Nations Cup.",
  },
} as const;
```

Signaturen: `export function ClimbCounter({ lang }: { lang: Lang })`, `const t = COPY[lang];` först i komponenten. Räknar-formatet `P${n}` är språkneutralt — orört. JSX-textställena:

```tsx
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        {t.kicker} <span aria-hidden="true">·</span> {t.event}
      </p>
```

```tsx
        <span className="heading-caps text-sm tracking-[0.12em] text-mist sm:text-lg">
          {t.label(CLIMB_FROM, CLIMB_TO)}
        </span>
```

```tsx
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mist">{t.note}</p>
```

- [ ] **Step 4: Svenska sidan:** `<ChapterJakten lang="sv" />`.

- [ ] **Step 5: Verifiera:** `npm test` → 67 PASS; `npm run build` → lyckas.

- [ ] **Step 6: Commit**

```bash
git add src/components/career/ChapterJakten.tsx src/components/career/FieldCounter.tsx src/components/career/ClimbCounter.tsx "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(en-karriar): Jakten, faltraknaren och klattringen pa engelska"
```

---

### Task 6: Vandel-kapitlet på engelska

**Files:**
- Modify: `src/components/career/ChapterVandel.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (props)

**Interfaces:**
- Consumes: `ChapterSection({ chapter, lang, … })`; `KWC` (`.sv`/`.en`-fält); `Countdown({ target, lang })` (befintlig).
- Produces: `ChapterVandel({ mode, latestHref, latestTitle, lang })` — Task 7 skickar `latestHref` som `/en/news/<slug>`.

- [ ] **Step 1: `ChapterVandel.tsx` — hela nya filen**

```tsx
import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { CHAPTERS } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import type { SiteMode } from "@/lib/mode";
import { KWC } from "@/lib/site";
import { ChapterSection } from "./ChapterSection";
import { ImageReveal } from "./ImageReveal";

const chapter = CHAPTERS.find((c) => c.id === "vandel")!;

const COPY = {
  sv: {
    lede: "Berättelsen slutar inte i historiken. Den fortsätter i Vandel.",
    p1Highlight: "3:e bästa svensk i SRKC 2026.",
    p1Rest: (venue: string, dates: string) =>
      ` Klar för hyrkart-VM på ${venue}, ${dates}: KWC Individual och Nations Cup för Sverige.`,
    p2Pre: "Samma år kom också beskedet om en plats i ",
    p2Link: "SRKC:s Hall of Fame",
    p2Post: " — hittills som ende invalde förare.",
    figcaption: "Sverige, 2026",
    during: (title: string | null) =>
      `VM pågår just nu${title ? ` — senaste rapporten: ${title}` : ""}.`,
    after: "VM 2026 är avgjort — resultaten finns i Facit nedan.",
    cont: (label: string) => `Fortsättning följer. Nations Cup ${label}.`,
    followVm: "Följ VM här",
    latestNews: "Senaste nyheten",
    allNews: "Alla nyheter",
    vmHref: "/vm-2026",
  },
  en: {
    lede: "The story doesn't end in the archive. It continues in Vandel.",
    p1Highlight: "3rd-best Swede in the 2026 SRKC.",
    p1Rest: (venue: string, dates: string) =>
      ` Set for the rental kart Worlds at ${venue}, ${dates}: KWC Individual and the Nations Cup for Sweden.`,
    p2Pre: "The same year also brought a place in the ",
    p2Link: "SRKC Hall of Fame",
    p2Post: " — so far as the only driver inducted.",
    figcaption: "Sweden, 2026",
    during: (title: string | null) =>
      `The Worlds are on right now${title ? ` — latest report: ${title}` : ""}.`,
    after: "Worlds 2026 is decided — the results are in The tally below.",
    cont: (label: string) => `To be continued. Nations Cup ${label}.`,
    followVm: "Follow the Worlds",
    latestNews: "Latest news",
    allNews: "All news",
    vmHref: "/en/vm-2026",
  },
} as const;

/**
 * Kapitel 06 — Vandel (2026). Berättelsen slutar i nuet: SRKC, Hall of Fame
 * och lägesraden mot VM (före/under/efter — samma logik som startsidan).
 */
export function ChapterVandel({
  mode,
  latestHref,
  latestTitle,
  lang,
}: {
  mode: SiteMode;
  /** Länk till senaste nyheten (eller nyhetslistan om ingen finns ännu) */
  latestHref: string;
  latestTitle: string | null;
  lang: Lang;
}) {
  const t = COPY[lang];
  return (
    <ChapterSection chapter={chapter} lang={lang} lede={t.lede}>
      <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-[3fr_2fr] sm:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-mist sm:text-lg" data-chapter-copy>
          <p>
            <span className="text-snow">{t.p1Highlight}</span>
            {t.p1Rest(KWC.venue, KWC.datesLabel[lang])}
          </p>
          <p>
            {t.p2Pre}
            <a
              href="https://srkc.nu/results/hall-of-fame/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flagblue-bright underline underline-offset-2 hover:text-snow"
            >
              {t.p2Link}
            </a>
            {t.p2Post}
          </p>
        </div>

        <figure>
          <ImageReveal className="aspect-square border border-line">
            <Image
              src="/images/gallery-5.png"
              alt={lang === "sv" ? "Rickard Javanainens hjälm i närbild" : "Rickard Javanainen's helmet in close-up"}
              width={800}
              height={800}
              sizes="(max-width: 640px) 92vw, 32vw"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
          <figcaption className="heading-caps mt-3 text-[0.65rem] tracking-[0.18em] text-mist-dim">
            {t.figcaption}
          </figcaption>
        </figure>
      </div>

      {/* Lägesraden mot VM — före/under/efter, samma logik som startsidan */}
      <div className="mt-16 border border-line bg-midnight-800 p-8 sm:mt-20 sm:p-12">
        {mode === "before" && (
          <>
            <p className="heading-caps mb-4 text-xs tracking-[0.16em] text-mist-dim">
              Nations Cup <span aria-hidden="true">·</span> {KWC.place[lang]}
            </p>
            <Countdown target={KWC.nationsCupStart} lang={lang} />
          </>
        )}
        {mode === "during" && (
          <p className="heading-caps text-lg text-snow sm:text-2xl">{t.during(latestTitle)}</p>
        )}
        {mode === "after" && (
          <p className="heading-caps text-lg text-snow sm:text-2xl">{t.after}</p>
        )}

        <p className="mt-8 text-base text-mist sm:text-lg">
          {t.cont(KWC.nationsCupLabel[lang])}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={t.vmHref} className="btn btn-primary">
            {t.followVm}
          </Link>
          <Link href={latestHref} className="btn btn-secondary">
            {latestTitle ? t.latestNews : t.allNews}
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
```

- [ ] **Step 2: Svenska sidan:** `<ChapterVandel mode={mode} latestHref={latestHref} latestTitle={latest?.frontmatter.title ?? null} lang="sv" />`.

- [ ] **Step 3: Verifiera:** `npm test` → 67 PASS; `npm run build` → lyckas. Kontrollera att INGA tillfälliga `lang="sv"`-literaler på `ChapterSection` finns kvar: `grep -rn 'lang="sv"' src/components/career/` ska ge NOLL träffar (alla kapitel forwardar nu sin egen prop).

- [ ] **Step 4: Commit**

```bash
git add src/components/career/ChapterVandel.tsx "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(en-karriar): Vandel-kapitlet pa engelska"
```

---

### Task 7: `/en/career` blir scrollytelling — gamla sidan + Timeline bort

**Files:**
- Modify (ersätt hela): `src/app/en/career/page.tsx`
- Delete: `src/components/Timeline.tsx`

**Interfaces:**
- Consumes: allt från Task 1–6 med `lang="en"`; `getAllArticles("en")`; `DICT.en.common.soundOn/soundOff`; `RESULTS`/`STATS` `.en`-fält.
- Produces: den färdiga engelska karriärsidan. OG-bilden (`src/app/en/career/opengraph-image.tsx`) behålls oförändrad.

- [ ] **Step 1: Ersätt `src/app/en/career/page.tsx` med**

```tsx
import type { Metadata } from "next";
import { CountUp } from "@/components/CountUp";
import { NationBadge } from "@/components/NationBadge";
import { VideoBackdrop } from "@/components/VideoBackdrop";
import { CareerStoryProvider } from "@/components/career/CareerStoryProvider";
import { ChapterBanracing } from "@/components/career/ChapterBanracing";
import { ChapterBronset } from "@/components/career/ChapterBronset";
import { ChapterDalarna } from "@/components/career/ChapterDalarna";
import { ChapterGenombrottet } from "@/components/career/ChapterGenombrottet";
import { ChapterJakten } from "@/components/career/ChapterJakten";
import { ChapterNav } from "@/components/career/ChapterNav";
import { ChapterVandel } from "@/components/career/ChapterVandel";
import { QuoteInterlude } from "@/components/career/QuoteInterlude";
import { RaceLine } from "@/components/career/RaceLine";
import { ScrollCue } from "@/components/career/ScrollCue";
import { StoryEffects } from "@/components/career/StoryEffects";
import { CHAPTERS } from "@/lib/career-story";
import { getAllArticles } from "@/lib/content";
import { DICT } from "@/lib/dictionary";
import { getSiteMode } from "@/lib/mode";
import { RESULTS, STATS } from "@/lib/results";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Career — results and timeline 2002–2026",
  description:
    "Rickard Javanainen's career in numbers: Worlds bronze in 2016 (3rd of 102), two SRKC titles, and the road from karting in Dalarna to the rental kart World Championship in Vandel 2026.",
  alternates: {
    canonical: "/en/career",
    languages: { "sv-SE": "/karriar", en: "/en/career", "x-default": "/karriar" },
  },
  openGraph: { locale: "en_US" },
};

/**
 * /en/career som scrolldriven berättelse — spegel av /karriar med lang="en".
 * Allt innehåll server-renderas; GSAP/Lenis-lagret är progressiv förbättring.
 */
export default function EnglishCareerPage() {
  const mode = getSiteMode();
  const articles = getAllArticles("en");
  const latest = articles[0] ?? null;
  const latestHref = latest ? `/en/news/${latest.slug}` : "/en/news";

  return (
    <CareerStoryProvider>
      <ChapterNav chapters={CHAPTERS} lang="en" />

      {/* Prologue: prispallsceremonin som video-loop, samma mönster som svenska sidan */}
      <section
        id="prolog"
        tabIndex={-1}
        aria-labelledby="prolog-heading"
        data-chapter="prolog"
        className="relative flex min-h-[76svh] items-end overflow-hidden outline-none"
      >
        <VideoBackdrop
          video="/videos/karriar-podium.mp4"
          poster="/images/karriar-poster.jpg"
          imageAlt="Podium ceremony — Rickard Javanainen in the middle of the podium"
          soundOnLabel={DICT.en.common.soundOn}
          soundOffLabel={DICT.en.common.soundOff}
          deferVideoOnMobile
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-36 sm:px-6">
          <NationBadge className="mb-4" />
          <h1
            id="prolog-heading"
            className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl lg:text-6xl"
          >
            Career
          </h1>
          <p className="mt-3 max-w-2xl text-mist sm:text-lg">
            From karting in Dalarna in 2002 to the rental kart Worlds in Vandel 2026. The whole
            road, with the numbers to back it up — told in six chapters.
          </p>
          <div className="mt-10 flex justify-center">
            <ScrollCue lang="en" />
          </div>
        </div>
      </section>

      {/* Berättelsen — kapitel 01–06 längs racinglinjen */}
      <div
        data-story
        className="relative mx-auto max-w-6xl overflow-x-clip [--rail-x:1.25rem] sm:[--rail-x:3rem]"
      >
        {/* Statisk guidelinje — finns alltid, även utan JS */}
        <div
          className="absolute inset-y-0 left-[var(--rail-x)] w-px -translate-x-1/2 bg-line/60"
          aria-hidden="true"
        />
        <RaceLine />
        <StoryEffects />
        <ChapterDalarna lang="en" />
        <ChapterBanracing lang="en" />
        <ChapterGenombrottet lang="en" />
        <ChapterBronset lang="en" />
        <QuoteInterlude
          quote="With the same equipment for everyone, there is nothing to hide behind."
          lang="en"
        />
        <ChapterJakten lang="en" />
        <ChapterVandel
          mode={mode}
          latestHref={latestHref}
          latestTitle={latest?.frontmatter.title ?? null}
          lang="en"
        />
      </div>

      {/* Epilogue — The tally: statistiken och samtliga resultat */}
      <section
        id="facit"
        tabIndex={-1}
        aria-labelledby="facit-heading"
        data-chapter="facit"
        className="scroll-mt-20 border-t border-line outline-none"
      >
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <header>
            <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
              Epilogue <span aria-hidden="true">·</span> 2015–2026
            </p>
            <h2
              id="facit-heading"
              className="heading-caps mt-3 text-4xl font-extrabold leading-[0.95] text-snow sm:text-6xl"
            >
              The tally
            </h2>
            <p className="mt-5 max-w-2xl text-base text-mist sm:text-lg">
              The numbers behind the story — the 2002–2026 timeline as statistics, and every
              result.
            </p>
          </header>

          {/* Javanainen in numbers */}
          <div className="mt-16" aria-labelledby="stats-heading" role="group">
            <h3 id="stats-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
              Javanainen in numbers
            </h3>
            <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
              {STATS.map((stat) => (
                <div key={stat.label.en} className="flex flex-col gap-2 bg-midnight-800 p-6">
                  <CountUp
                    value={stat.value}
                    suffix={"suffix" in stat ? stat.suffix.en : ""}
                    className="heading-caps text-4xl font-bold text-flagyellow sm:text-5xl"
                  />
                  <span className="text-xs leading-snug text-mist-dim">{stat.label.en}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-mist-dim">
              Inducted into the{" "}
              <a
                href="https://srkc.nu/results/hall-of-fame/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flagblue-bright underline underline-offset-2"
              >
                SRKC Hall of Fame
              </a>
              , so far as the only driver.
            </p>
          </div>

          {/* Results table — canonical values from lib/results.ts */}
          <div className="mt-16" aria-labelledby="results-heading" role="group">
            <h3 id="results-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
              Results
            </h3>
            <div className="overflow-x-auto border border-line">
              <table className="tabular w-full min-w-[640px] text-sm">
                <caption className="sr-only">
                  Race results for R. Javanainen (SWE), 2015–2026
                </caption>
                <thead>
                  <tr className="bg-midnight-800 text-left">
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim"
                    >
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((row) => (
                    <tr
                      key={`${row.competition}-${row.year}`}
                      className="border-t border-line transition-colors duration-150 hover:bg-midnight-800"
                    >
                      <td className="px-4 py-3 text-snow">{row.competition}</td>
                      <td className="px-4 py-3 text-mist">{row.place.en}</td>
                      <td className="px-4 py-3 text-mist">{row.year}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          {row.podium && (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full bg-flagyellow"
                              title="Podium"
                              aria-label="Podium"
                            />
                          )}
                          <span className={row.podium ? "font-semibold text-snow" : "text-mist"}>
                            {row.result.en}
                          </span>
                          {row.note && (
                            <span className="text-xs text-mist-dim">— {row.note.en}</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-mist-dim">
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full bg-flagyellow"
                aria-hidden="true"
              />
              Podium · Official KWC results are available from the{" "}
              <a
                href="https://kartworldchampionship.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-flagblue-bright underline underline-offset-2"
              >
                organiser
              </a>
            </p>
          </div>
        </div>
      </section>
    </CareerStoryProvider>
  );
}
```

- [ ] **Step 2: Radera `src/components/Timeline.tsx`**

```bash
git rm src/components/Timeline.tsx
```

Verifiera att ingen kvarvarande import finns: `grep -rn "components/Timeline" src/` → NOLL träffar.

- [ ] **Step 3: Verifiera**

Kör: `npm test` → 67 PASS. Kör: `npm run build` → lyckas; `/en/career` i routelistan.

- [ ] **Step 4: Commit**

```bash
git add src/app/en/career/page.tsx
git commit -m "feat(en): /en/career som scrollytelling-berattelse — gamla sidan och Timeline utgar"
```

(`git rm` har redan stage:at raderingen.)

---

### Task 8: Slutverifiering

**Files:** inga nya — verifiering av helheten.

- [ ] **Step 1:** `npm test` → 67 PASS, 0 failade.

- [ ] **Step 2:** `npm run build` (dev-servern AVSTÄNGD) → lyckas.

- [ ] **Step 3: Dev-genomgång** (starta dev-servern EFTER bygget; stäng den efteråt):

1. `/karriar`: svensk copy oförändrad (stickprov: lede-texterna, "Kapitel 04 · 2016", knappen "Kapitel", "Välj kapitel", "Facit") — DOM-strukturen identisk med före porten.
2. `/en/career`: prolog ("Career", "Scroll"), kapitelmenyn ("Chapters" → "Choose a chapter" → titlarna Prologue/Dalarna/Circuit racing/The breakthrough/The bronze/The chase/Vandel/The tally → "Close"), kapiteletiketter "Chapter 01 ·" osv.
3. Sekvensernas slutlägen på `/en/career`: "Won the final", "The full field · 102 drivers", "3rd / of 102", "Worlds bronze", "Last"→"P1", "One stint. From last to first.", 172-räknaren, "From 16th to 9th in the final race.", Ginetta-noten "8th of 22 drivers overall …".
4. Vandel-kapitlet: countdown-läget (before) på engelska, knapparna "Follow the Worlds" → `/en/vm-2026` och "Latest news"/"All news" → `/en/news/...`.
5. Epilogen: "Epilogue", "The tally", "Javanainen in numbers", tabellen Event/Location/Year/Result med `.en`-värden.
6. Språkväxlaren `/karriar` ↔ `/en/career` åt båda håll.
7. Inga konsolfel på någon av sidorna.

- [ ] **Step 4: Rapportera** testutdata + routelista. Committa inget mer utan besked.

---

## Self-Review (utförd vid planskrivning)

- **Spec-täckning:** §1 datamodell → Task 1; §2 lang-prop-tabellen → Task 1 (nav/skal/cue), Task 2 (Dalarna/Banracing/Ginetta), Task 3 (Genombrottet/stinten), Task 4 (Bronset/startfält/citat), Task 5 (Jakten/räknarna/GalleryStripe-hint), Task 6 (Vandel); §3 sidorna → Task 7 (+ sv-props löpande i Task 1–6, Timeline-radering i Task 7); §4 verifiering → Task 8. Inga luckor.
- **Platshållare:** inga TBD/TODO utöver befintliga TODO(Rickard)-kommentarer som medvetet bevaras ordagrant.
- **Typkonsistens:** `lang: Lang` obligatorisk överallt; `ChapterSection`-anrop forwardar `lang={lang}` i Task 2–6 (ersätter Task 1:s literaler — verifieras med grep i Task 6 Step 3); `StripeItem` importeras oförändrad från GalleryStripe; `title[lang]`-läsare uttömmande via TypeScript.
