# Design: /en/career — port av scrollytelling-karriären till engelska

**Datum:** 2026-07-17
**Gren:** feat/engelska-omtag (worktree C:/dev/javanainen-engelska; origin/main är inmergad)
**Status:** Utkast — väntar på Rickards godkännande

## Mål

Engelska karriärsidan ska vara samma scrolldrivna berättelse som nya `/karriar`
(sex kapitel + prolog/epilog, racinglinje, pin/scrub-sekvenser) — inte gamla
tabell+tidslinje-versionen som ligger på `/en/career` idag.

## Beslut

| Fråga | Val |
| --- | --- |
| Arkitektur | `lang`-prop på career-komponenterna + copy per komponent — animationslagret dubbleras ALDRIG |
| Kapiteltitlar | `ChapterDef.title` blir `{ sv, en }` i `career-story.ts` (nav + rubriker läser samma källa) |
| Sidnivå-copy (prolog/epilog) | Inline i respektive `page.tsx` enligt spegelmönstret (som övriga /en-sidor) |
| Gamla `/en/career` | Ersätts helt; tillfälligt återinförda `Timeline.tsx` raderas igen |
| Siffror | Fortsatt enbart ur `lib/results.ts` (`STORY_FACTS`, `RESULTS`, `STATS` — redan tvåspråkiga där det behövs) |
| Ton | Ödmjuk, fritt formulerad engelska; bildtexters plats/år ändras aldrig (verifierade fakta) |

**Förkastade alternativ:**
- **Spegla kapitelkomponenterna (7 st EN-dubbletter)** — dubblerar hela
  GSAP-lagret; en animationsfix måste då göras två gånger. Copyn är liten,
  animationskoden stor — parametrisera copyn i stället.
- **Central `career-copy.ts`** — flyttar copyn långt från markupen; per-komponent-
  objekt (`const COPY = { sv: {...}, en: {...} }`) håller den läsbar där den används.

## 1. Datamodell: `lib/career-story.ts`

`ChapterDef.title: string` → `title: { sv: string; en: string }`. Titlar:

| id | sv | en |
| --- | --- | --- |
| prolog | Prolog | Prologue |
| dalarna | Dalarna | Dalarna |
| banracing | Banracing | Circuit racing |
| genombrottet | Genombrottet | The breakthrough |
| bronset | Bronset | The bronze |
| jakten | Jakten | The chase |
| vandel | Vandel | Vandel |
| facit | Facit | The tally |

TypeScript-kompilatorn hittar alla läsare (`ChapterNav`, `ChapterSection`) —
de får `lang`-prop och läser `title[lang]`.

## 2. `lang`-prop genom komponentlagret

Obligatorisk `lang: Lang` (explicit, som `Hero`/`FactBox`) på:

| Komponent | Vad som översätts |
| --- | --- |
| `ChapterNav` | "Kapitelprogression", aria "Kapitel NN: …", knappen "Kapitel", "Välj kapitel", "Stäng", `title[lang]` |
| `ChapterSection` | Etiketten "Kapitel NN ·" / "Chapter NN ·", `title[lang]` |
| `ScrollCue` | "Scrolla" / "Scroll" |
| `ChapterDalarna` | lede, två stycken, plattan ("Där det började" / "Where it started") |
| `ChapterBanracing` | lede, Renault/JTCC-raderna |
| `GinettaStats` | kicker-intro, statetiketter ("vinster/race/av 22 totalt"), suffix ":a"→"th", noten |
| `ChapterGenombrottet` | lede, två stycken |
| `StintSequence` | kicker, "Sist"→"Last", "En stint. Från sist till först.", noten |
| `ChapterBronset` + `BronzeSequence` | lede, "Finalen · VM Italien 2016", "Vinst i finalen", stycket, bild-alt, "Hela startfältet", "3:e/av 102"→"3rd/of 102", "VM-brons"→"Worlds bronze", depåstopp-noten |
| `StartFieldGrid` | aria-label |
| `QuoteInterlude` | citatet skickas redan som prop från sidan; aria "Citat"→"Quote" via lang |
| `ChapterJakten` | lede, STRIPE_ITEMS (alt/caption/statetikett — plats/år oförändrade), SRKC-stycket |
| `FieldCounter` | "förare — största startfältet hittills." + Spanien-stycket |
| `ClimbCounter` | "Finalracet · VM Polen 2018", "Från 16:e till 9:e …", noten |
| `ChapterVandel` | lede, två stycken (KWC `.en`), figcaption "Sverige, 2026"→"Sweden, 2026", lägesraden (before/during/after), knapparna, länkar `/en/vm-2026` + `latestHref` |

Mönster per komponent: `const COPY = { sv: {...}, en: {...} } as const;` överst,
`const t = COPY[lang];` — inga villkor inne i JSX-trädet, animationskoden orörd.
Copy med siffror fortsätter interpolera ur `STORY_FACTS`/`KWC`.

## 3. Sidorna

- **`src/app/en/career/page.tsx`** ersätts med scrollytelling-spegeln:
  `CareerStoryProvider` + `ChapterNav lang="en"` + prolog (engelsk h1 "Career",
  intro, `VideoBackdrop` med `DICT.en`-ljudetiketter och engelsk alt) + kapitlen
  med `lang="en"` + `QuoteInterlude` med engelskt citat ("With the same equipment
  for everyone, there is nothing to hide behind.") + engelsk epilog (Epilogue ·
  "The tally", stats/tabell med `.en`-fält — samma markup som svenska epilogen).
  `getAllArticles("en")`, `latestHref = /en/news/<slug>`. Metadata/hreflang behålls
  från nuvarande EN-sida. OG-bilden behålls oförändrad.
- **`src/app/(sv)/karriar/page.tsx`**: enda ändringen är `lang="sv"`-props till
  komponenterna (copy och markup orörda).
- **`src/components/Timeline.tsx`** raderas igen (sista användaren försvinner).

## 4. Testning & verifiering

- Inga komponenttester finns för career-lagret (etablerat läge) — verifiering:
  `npm test` (67 befintliga), `npm run build`, dev-genomgång av `/en/career`
  (kapitelmeny, rail, pin/scrub-sekvenserna, reduced-motion-fallback via DOM-koll,
  språkväxlaren `/karriar` ↔ `/en/career`) och att `/karriar` renderar exakt som före
  porten (svensk copy, samma DOM-struktur).
- `career-story.ts`-ändringen är typstyrd — bygget fångar missade läsare.

## Utanför scope

- Nya animationer eller ändringar i GSAP/Lenis-lagret
- Verifiering av stint-startpositionen (StintSequence-TODO:n står kvar)
- Push/PR (görs på Rickards begäran efter porten)
