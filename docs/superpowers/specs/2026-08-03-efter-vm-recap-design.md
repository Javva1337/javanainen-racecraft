# Efter VM-läget: animerad VM-recap — design

**Datum:** 2026-08-03
**Status:** Godkänd av Rickard (chatt), spec under granskning
**Branch:** `feat/efter-vm-recap`

## Mål

Sajten är sedan 1 augusti i `after`-läge (`lib/mode.ts`), men läget visar idag bara en
enkel textruta på /vm-2026 och en knapp i heron. Vi bygger det visuella "efter
VM"-lagret: en animerad VM-sammanfattning i referenssajt-kvalitet, plus ett svep som
rättar kvarvarande före/under-VM-framing.

**Kontext som styr ambitionsnivån:** sajten dubblar som referenssajt för Rickards
webbyrå. Polish-nivån är en del av leveransen, inte grädde. Därför Framer Motion
(paketet `motion`) — medvetet "overkill". OBS: GSAP finns redan i projektet och
driver karriärsidan; Rickard valde medvetet (2026-08-03, efter avstämning) att ändå
ta in Framer Motion för recapen, för att portfolion ska visa bredd i båda
biblioteken. Recapen är alltså sajtens Framer Motion-yta, karriärsidan förblir GSAP.

## Beslut (fattade i brainstormingen)

| Fråga | Beslut |
| --- | --- |
| Placering | **C** — kompakt teaser på startsidan + full recap på /vm-2026 |
| Innehållsnivå | **B** — nyckeltal + animerad "resan genom veckan"-graf |
| Grafens fokus | **C** — standing-kurva som linje + bästa dagsresultat som punkter, Nations Cup som startpunkt |
| Teknik | **C** — Framer Motion (`motion`), nytt beroende accepterat |

## Komponenter

### 1. `VmRecapTeaser` — startsidan (sv + en)

Ersätter dagens after-innehåll i `CurrentCompetition`-ytan på startsidan.

- Tre nyckeltal, spring-animerade in staggered vid scroll-in:
  **41:a av 180 · 3 pallplatser i heaten · semifinal**
- CTA: "Se hela VM-resan →" → /vm-2026 (resp. /en/vm-2026)
- Kompakt: säljer klicket, konkurrerar inte med heron

### 2. `VmRecap` — full recap på /vm-2026 (sv + en)

Ersätter textrutan "VM 2026 — så gick det" (`mode === "after"`-blocket).

- **Nyckeltalsrad:** 41:a av 180 · 9 heat · 3 pallplatser · semifinal.
  Orkestrerad stagger med spring-fysik.
- **"Resan genom veckan":** SVG-graf.
  - Standing-kurvan P67 → P54 → P37 → P37 → 41:a ritas med
    pathLength-animation vid scroll-in.
  - Nations Cup som egen startpunkt före kurvan: 6:a i regnheatet → A-final →
    14:e av 32.
  - Dagspunkter poppar in sekventiellt efter att kurvan ritats.
  - Pallplatsdagar får gul punkt — samma visuella språk som resultattabellen på
    /karriar (`podium: true` → gul).
  - Varje punkt: bestFinish-badge, hover/focus-tooltip med dagens rubrik, länk
    till dagsrapporten.
  - Mobil: responsiv viewBox, etiketter anpassas.

### 3. Datalager: `src/lib/vm-recap.ts`

- Härleder tidslinjen ur dagsrapporternas frontmatter (`day`, `bestFinish`,
  `standing`) via `getAllArticles`, kombinerat med `KWC` (`lib/site.ts`) och
  `lib/results.ts`.
- Inga siffror hårdkodas i komponenter — samma princip som `results.ts`
  ("siffrorna kan aldrig glida isär").
- Unit-tester i `vm-recap.test.ts` på härledningen (antal punkter, ordning,
  pallplatsflagga, länk-slugs).

## Motion-hygien (referenssajt-nivå)

- `prefers-reduced-motion` → allt renderas direkt i slutläge, inga animationer.
- Slutvärden server-renderas — crawlers och no-JS ser färdig text (sajtens
  etablerade mönster från räknar-fixen i commit 62c4eb0).
- Endast transform/opacity animeras — inga layoutanimationer.
- `review-animations`-pass krävs innan animationerna räknas som klara.

## Resultatsvepet

`results.ts` och `STATS` har redan 2026-resultatet. Svepet auditerar och rättar
kvarvarande före/under-VM-framing på:

- Karriärsidans Vandel-kapitel (`ChapterVandel`) — sv + en
- /om, /press och deras meta-beskrivningar
- Dictionary-strängar (`lib/dictionary.ts`) som bara används i before/during
- Övriga metadata (title/description) som ännu låter som att VM pågår

## Copy

All ny användarvänd text går genom kedjan
**copywriting → seo-audit → ai-seo → humanizer** (projektets obligatoriska flöde),
med Rickards ödmjuka ton (se minnet `ton-odmjuk-copy.md`).

## Nytt beroende

- `motion` (Framer Motion för React). Klientkomponenter hålls så små som
  möjligt — server-komponenter äger data och text, klientdelen äger bara rörelsen.

## Testning

- Unit: `vm-recap.test.ts` (datahärledning).
- Manuellt/browser: verifiering i preview — scroll-in-animationer, reduced motion,
  mobil, båda språken, tooltips/fokus, länkar till dagsrapporter.
- `review-animations` + `/code-review` före PR.

## Utanför scope

- Inga ändringar i rapporternas innehåll.
- Ingen ny karriärsida-liknande storytelling (nivå C valdes bort).
- Ingen ändring av hero-videon eller dess lägeslogik utöver CTA-texter om
  svepet kräver det.
