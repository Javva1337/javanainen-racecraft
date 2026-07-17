# Svenskt språkomtag — Implementationsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Skriv om all användarvänd svensk text så en läsare utan racingkunskap förstår vad som hänt och varför det är imponerande — utan att texten blir tjatig för de racingintresserade.

**Architecture:** Väv in kontexten i löptexten i Rickards egen röst, luta oss mot förklaringsartikeln, ingen ny UI. Fakta (siffror/år/placeringar) sitter kvar i `results.ts`/`STORY_FACTS`/`site.ts` som sanningskälla — vi ändrar formuleringar, aldrig fakta. Schemat förtydligas dygn för dygn.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind v4, MDX (next-mdx-remote), Vitest.

**Spec:** [`docs/superpowers/specs/2026-07-17-svenskt-sprakomtag-design.md`](../specs/2026-07-17-svenskt-sprakomtag-design.md)

## Global Constraints

- **Kvalitetskedja per textyta, i ordning:** `copywriting` → `seo-audit` (Google) → `ai-seo` (AI-sök, endast svenska) → `humanizer` (sista passet, ödmjuk ton). För triviala UI-strängar är seo/ai-seo-passen no-ops.
- **Fakta rörs aldrig:** siffror, årtal och placeringar sitter i `src/lib/results.ts` (`RESULTS`, `TIMELINE`, `STATS`, `STORY_FACTS`) och `src/lib/site.ts` (`KWC`). Ändra ordval, aldrig tal. Om en not och en löptext delar en siffra måste de fortsatt matcha.
- **Ödmjuk ton:** kontext ska göra bedriften tydlig utan att skryta. Se minnet `ton-odmjuk-copy`.
- **Ingen ny UI-komponent, inga faktarutor, inga intro-block.**
- **Inga nya fakta uppfinns.** Behövs en uppgift som inte finns i källorna → stäm av med Rickard, gissa inte.
- **Engelska (`/en/**`) och alla `.en`/`en:`-strängfält rörs inte.**
- **`racecraft` → "Läser racet"** (meritkort). Rensa övrig svengelska som dyker upp.
- **Schema dygn för dygn:** Träning 22–24 juli · Nations Cup 25–26 juli · Vilodag 27 juli · Individuella mästerskapet (KWC Individual) 28 juli–1 augusti.
- **Commit/push endast på Rickards uttryckliga begäran. Aldrig direkt på `main`.** Branch: `fix/karriar-granskningsfynd`. Varje task slutar vid en granskningscheckpoint; commit-steget körs först när Rickard sagt ja.
- **Verifieringskommandon (Windows, kör från repo-roten):**
  - `npx tsc --noEmit`
  - `npm run test` (vitest)
  - `npm run build`
  - Visuell koll: dev-servern via webbläsarpanelen (aldrig dev+build samtidigt — se minnet `onedrive-dev-quirks`).

## Ordlista — målglosor (återanvänds ordagrant där begreppet först dyker upp på en sida)

Håll dem korta; humanizer-passet finslipar. Detta är referensen alla tasks lutar sig mot så samma sak inte förklaras på fem sätt:

- **hyrkart** — racing där alla kör likvärdiga kartar som arrangören ställer upp; bara föraren skiljer, inte materialet.
- **Kart World Championship (KWC)** — världsmästerskapet i hyrkart.
- **SRKC** — den svenska hyrkartserien, som också fungerar som kval/uttagning inför VM.
- **Nations Cup** — lagtävlingen i VM där man kör för sitt land; alla lagförarnas resultat räknas ihop till en nationsplacering.
- **kvalheat** — de inledande racen som avgör vilka som går vidare.
- **tidskval** — ett enda varv före ett heat som avgör var man får starta.
- **strykresultat** — det sämsta resultatet räknas bort.
- **stint** — den sträcka en förare kör innan nästa i laget tar över.
- **depåstopp** — förarbytet i depån under lagtävlingen.
- **semifinal/final** — stegen som avgör titeln.
- **Hall of Fame** — SRKC:s hedersgalleri.

**Paradox-glosan (återanvänds där "vann finalen men brons" förekommer):** VM-titeln avgörs på sammanlagda poäng från hela veckan — så att vinna sista racet räckte till tredje plats totalt, VM-brons.

---

## Task 1: Delade sanningskällor — `site.ts` + `dictionary.ts`

Etablerar tagline, meta och schemakonstanterna som resten av sajten läser. Görs först så scheman och glosor är på plats innan sidorna skrivs.

**Files:**
- Modify: `src/lib/site.ts` (`TAGLINE.sv`, `DEFAULT_TITLE.sv`, `DEFAULT_DESCRIPTION.sv`, `KWC`)
- Modify: `src/lib/dictionary.ts` (`DICT.sv`-grenen — endast där copy skaver)

**Interfaces:**
- Consumes: inget från tidigare tasks.
- Produces: `KWC.trainingLabel: { sv: string; en: string }` och `KWC.restDayLabel: { sv: string; en: string }` — konsumeras av Task 6 (`/vm-2026` schema). Övriga `KWC`-fält oförändrade.

- [ ] **Step 1: Läs nuvarande text**

Läs `src/lib/site.ts` och `src/lib/dictionary.ts`. Notera att `TAGLINE.en`, `DEFAULT_*.en` och hela `DICT.en` INTE ska röras.

- [ ] **Step 2: Lägg till schemakonstanter i `KWC`**

I `src/lib/site.ts`, lägg till två fält i `KWC`-objektet (behåll befintliga fält och kommentarer):

```ts
  trainingLabel: { sv: "22–24 juli", en: "22–24 July" },
  restDayLabel: { sv: "27 juli", en: "27 July" },
```

- [ ] **Step 3: Skriv om `TAGLINE.sv`, `DEFAULT_TITLE.sv`, `DEFAULT_DESCRIPTION.sv` via kvalitetskedjan**

Kör `copywriting` → `seo-audit` → `ai-seo` → `humanizer` på de tre `.sv`-strängarna. Krav:
- "hyrkart-VM" ska vara självförklarande i sitt sammanhang (den som inte vet ska ändå förstå att det är ett världsmästerskap i gokart där alla kör lika kartar).
- Behåll SEO-nyckelfakta som redan finns: namn, "VM-brons 2016", Vandel/Danmark, datum, KWC. Ändra inte år/siffror.
- Ödmjuk ton, ingen svengelska.
Uppdatera strängarna i filen.

- [ ] **Step 4: Putsa `DICT.sv` där copy skaver**

Gå igenom `DICT.sv` (nav, footer, newsletter, article, news, home, common). Det mesta är redan bra. Skriv bara om strängar som är vaga eller insider-tunga (t.ex. kontrollera `home.countdownTo`, `footer.newsletterText`, `common.partnersLine`). Rör inte nycklar, struktur eller `DICT.en`. Kör kedjan lätt på ändrade strängar.

- [ ] **Step 5: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Run: `npm run test`
Expected: alla gröna (särskilt `dictionary.test.ts`, `mode.test.ts`).

- [ ] **Step 6: Checkpoint**

Visa diffen för Rickard. Commit först på hans ja:

```bash
git add src/lib/site.ts src/lib/dictionary.ts
git commit -m "copy(sv): tydligare tagline, meta och schemakonstanter"
```

---

## Task 2: Resultatdata — `results.ts` + `career-story.ts`

Data-strängarna som matar både karriärberättelsen, resultattabellen, startsidan och `/vm-2026`. Settlas tidigt så prosan i senare tasks kan matcha dem ordagrant.

**Files:**
- Modify: `src/lib/results.ts` (`.sv`-fälten i `RESULTS[].result`/`.note`, `TIMELINE[].title`/`.description`, `STATS[].label`)
- Modify: `src/lib/career-story.ts` (`CHAPTERS[].title` vid behov)

**Interfaces:**
- Consumes: paradox-glosan och ordlistan från plan-preamblen.
- Produces: färdiga `.sv`-formuleringar som Task 3–6 citerar. Fältnamn, typer, `podium`-flaggor, år och siffror oförändrade.

- [ ] **Step 1: Läs nuvarande text**

Läs `src/lib/results.ts` och `src/lib/career-story.ts` i sin helhet.

- [ ] **Step 2: Skriv om `.sv`-strängarna via kvalitetskedjan**

Kör kedjan på `RESULTS`-noter, `TIMELINE`-beskrivningar och `STATS`-etiketter (`.sv` endast). Krav:
- `RESULTS` 2016-noten "Vinst i finalen, brons totalt" → gör paradoxen begriplig inom notens korthet (t.ex. "Vann finalracet — brons på veckans sammanlagda poäng"). Måste matcha paradox-glosan.
- `TIMELINE` 2015/2016-beskrivningarna: förklara Nations Cup som lagtävling där stinten "sist till först" ändå gav lagets femteplats (allas resultat räknas). 2018 "från 16:e till 9:e i finalracet" — låt stå men se till att det läses som en stark avancering.
- `STATS`-etiketter: håll dem korta men begripliga ("Störst slaget startfält" ok; se till att "VM-starter", "VM-finaler" är självklara).
- Siffror, år, `podium`, `place`, `competition`, `highlight` oförändrade. `STORY_FACTS` rörs INTE (endast tal).
- `career-story.ts`: kapiteltitlarna ("Genombrottet", "Bronset", "Jakten", "Vandel", "Dalarna", "Banracing") är berättande och får stå — ändra bara om en titel är direkt obegriplig.

- [ ] **Step 3: Korskontroll fakta**

Läs igenom: matchar varje omskriven not fortfarande talet den beskriver? Inga år/placeringar ändrade?

- [ ] **Step 4: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Run: `npm run test`
Expected: alla gröna.

- [ ] **Step 5: Checkpoint**

Diff till Rickard. Commit på hans ja:

```bash
git add src/lib/results.ts src/lib/career-story.ts
git commit -m "copy(sv): resultatnoter och tidslinje med kontext, fakta orörda"
```

---

## Task 3: Startsidan + Hero

Första mötet. Bronsparadoxen och `racecraft`-kortet sitter här.

**Files:**
- Modify: `src/app/(sv)/page.tsx` (`MERITS`-arrayen, sektionsrubriker/etiketter)
- Modify: `src/components/Hero.tsx` (endast om rubrik/text behöver justeras; taglinen kommer från Task 1)

**Interfaces:**
- Consumes: `TAGLINE` (Task 1), paradox-glosan, `RESULTS`-formuleringar (Task 2).
- Produces: inget senare task beror på detta.

- [ ] **Step 1: Läs nuvarande text**

Läs `src/app/(sv)/page.tsx` och `src/components/Hero.tsx`.

- [ ] **Step 2: Skriv om `MERITS` via kvalitetskedjan**

Kör kedjan. Konkreta krav:
- Kort 1 "Top 3 i VM" / "Bronsmedaljör i VM 2016. Vinst i finalen, 3:e av 102…" → väv in paradox-glosan så "vinst i finalen" och "3:e av 102" inte läses som motsägelse. Behåll siffrorna.
- Kort 2 rubrik "Strategisk racecraft" → **"Läser racet"**. Brödtext i stil med: *"Racet avgörs lika mycket på huvudet som på gasen — rätt beslut i rätt läge, race efter race. I ett format där alla har lika kartar är det ofta det som avgör."* (finslipa i humanizer, ödmjuk ton).
- Kort 3 "VM Vandel 2026" → se till att formatet antyds begripligt; behåll datum/siffror. Överväg kort hänvisning till dygn-för-dygn på `/vm-2026`.
- Sektionsetiketter ("Senaste nytt", "VM-satsningen möjliggörs av", "Bli partner") — putsa vid behov.

- [ ] **Step 3: Justera Hero vid behov**

Rubriken "Rickard Javanainen" står. Kontrollera bara att taglinen (från Task 1) läser bra under namnet; ändra inget i `Hero.tsx` om det inte behövs.

- [ ] **Step 4: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Visuell koll: starta dev-servern, öppna `/` i webbläsarpanelen, läs hero + tre meritkort som en nybörjare. Bekräfta att bronsparadoxen nu går ihop och "Läser racet" sitter.

- [ ] **Step 5: Checkpoint**

Diff + skärmdump till Rickard. Commit på hans ja:

```bash
git add "src/app/(sv)/page.tsx" src/components/Hero.tsx
git commit -m "copy(sv): startsidan — bronskontext och Läser racet"
```

---

## Task 4: Karriärberättelsen `/karriar`

Den största prosaytan. En sammanhållen röst genom alla kapitel — görs som en coherent pass.

**Files:**
- Modify: `src/components/career/ChapterDalarna.tsx`, `ChapterBanracing.tsx`, `ChapterGenombrottet.tsx`, `ChapterBronset.tsx`, `BronzeSequence.tsx`, `ChapterJakten.tsx`, `ChapterVandel.tsx`, `QuoteInterlude.tsx`
- Modify (etiketttext): `StintSequence.tsx`, `ClimbCounter.tsx`, `FieldCounter.tsx`, `GinettaStats.tsx`, `StartFieldGrid.tsx` (endast synliga textsträngar/labels — rör INTE GSAP-logik, `data-*`-attribut, refs eller animationssteg)

**Interfaces:**
- Consumes: ordlistan, paradox-glosan, `STORY_FACTS`/`RESULTS`-formuleringar (Task 2), `ChapterSection`-`lede`-proppen.
- Produces: inget senare task beror på detta.

- [ ] **Step 1: Läs alla kapitel + ledes**

Läs var och en av filerna ovan i sin helhet. Notera exakt vilka strängar som är synlig prosa vs. `alt`-text vs. `data-*`/klasser.

- [ ] **Step 2: Skriv om prosan via kvalitetskedjan, kapitel för kapitel**

Kör kedjan. Krav:
- **Första mötet med varje begrepp glosas** enligt ordlistan (hyrkart, Nations Cup, stint, depåstopp, kvalheat, tidskval, SRKC, Hall of Fame). Glosa en gång, sen fritt.
- **BronzeSequence** (kapitel 04): akt 1 "Vinst i finalen" → akt 2 "3:e av 102 — VM-brons". Väv in paradox-glosan i akt 2:s not (raden `data-bronze-note` eller en angränsande mening) så förloppet blir begripligt. Behåll `STORY_FACTS.field2016`-referensen och alla `data-*`.
- **Ledes** (`lede`-proppen i varje `Chapter*`): gör dem inbjudande för en utomstående.
- **QuoteInterlude / avslutande citat**: behåll känslan, rensa insider-språk.
- **Etikettkomponenter** (counters, GinettaStats, StintSequence): bara synliga labels; se till att t.ex. "8:a av 22", "sist till först" har minimal kontext där de står ensamma.
- Rör ALDRIG animationslogik, `useGSAP`, `ScrollTrigger`, `data-*`-selektorer eller refs. Endast textinnehåll.

- [ ] **Step 3: Korskontroll fakta + selektorer**

Bekräfta: inga siffror ändrade mot `results.ts`/`STORY_FACTS`; inga `data-*`-attribut, klassnamn eller refs rörda (annars bryts animationerna).

- [ ] **Step 4: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Visuell koll: öppna `/karriar`, scrolla igenom hela berättelsen i webbläsarpanelen. Bekräfta att animationerna fortfarande triggar och att texten läses tydligt för en nybörjare. Kontrollera även reduced-motion/statiskt läge (server-renderade slutlägen ska vara läsbara).

- [ ] **Step 5: Checkpoint**

Diff + skärmdumpar till Rickard. Commit på hans ja:

```bash
git add src/components/career/
git commit -m "copy(sv): karriärberättelsen — kontext och glosor, animationer orörda"
```

---

## Task 5: `/om`

Sex kapitel + avslutande citat, i första person.

**Files:**
- Modify: `src/app/(sv)/om/page.tsx` (`metadata`, `CHAPTERS`-arrayen, avslutande `blockquote`)

**Interfaces:**
- Consumes: ordlistan, paradox-glosan, formuleringar från Task 2/4 (håll samma glosor).
- Produces: inget.

- [ ] **Step 1: Läs nuvarande text**

Läs `src/app/(sv)/om/page.tsx`.

- [ ] **Step 2: Skriv om via kvalitetskedjan**

Kör kedjan på `metadata.title/description` och varje kapitels `title`/`text`. Krav:
- Kapitel "Hyrkart" / "Den renaste formen av racing": glosa hyrkart tidigt; väv in paradox-glosan där bronset/finalen nämns; förklara stinten sist-till-först som lagtävling.
- "Comebacken": förklara SRKC (kval till VM) och Hall of Fame kort.
- Behåll alla år/siffror. Behåll bild-`alt` (den är redan beskrivande).
- Avslutande citat: behåll känslan, håll det begripligt.

- [ ] **Step 3: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Visuell koll: `/om` i webbläsarpanelen, läs som nybörjare.

- [ ] **Step 4: Checkpoint**

Diff till Rickard. Commit på hans ja:

```bash
git add "src/app/(sv)/om/page.tsx"
git commit -m "copy(sv): om-sidan — kontext och glosor"
```

---

## Task 6: `/vm-2026` — schema, FAQ, format + strukturerad data

Redan mest begriplig; bygg ut schemat dygn för dygn och säkra att jargong aldrig kommer före sin förklaring.

**Files:**
- Modify: `src/app/(sv)/vm-2026/page.tsx` (`metadata`, `SCHEDULE`, `FORMAT_STATS`, format-/tävlings-/bansektionerna, `FAQ_ITEMS`)
- Modify: `src/components/JsonLd.tsx` (`SportsEventJsonLd` — lägg träningen som `subEvent`, håll `description` i synk)

**Interfaces:**
- Consumes: `KWC.trainingLabel`/`KWC.restDayLabel` (Task 1), ordlistan.
- Produces: inget.

- [ ] **Step 1: Läs nuvarande text**

Läs `src/app/(sv)/vm-2026/page.tsx` och `src/components/JsonLd.tsx`.

- [ ] **Step 2: Bygg ut `SCHEDULE` till fyra rader**

Ersätt dagens vaga "VM-veckan börjar"-rad. Ny `SCHEDULE` (behåll `highlight` på tävlingsdagarna):

```ts
const SCHEDULE = [
  { dates: KWC.trainingLabel.sv, label: "Träning", detail: "Fri och officiell träning på Vandel Kart inför tävlingsdagarna" },
  { dates: KWC.nationsCupLabel.sv, label: "Nations Cup", detail: "Lagtävlingen — Rickard kör för Sverige", highlight: true },
  { dates: KWC.restDayLabel.sv, label: "Vilodag", detail: "Ingen körning mellan lagtävlingen och det individuella mästerskapet" },
  { dates: KWC.individualLabel.sv, label: "KWC Individual", detail: "Det individuella världsmästerskapet: kvalheat, semifinal och final", highlight: true },
];
```

Importera `KWC` (redan importerat i filen). Finslipa `detail`-texterna i humanizer-passet.

- [ ] **Step 3: Skriv om `FAQ_ITEMS`, format- och tävlingssektionerna via kvalitetskedjan**

Kör kedjan. Krav:
- FAQ "När och var körs hyrkart-VM 2026?": ta med hela dygnsindelningen (träning 22–24, Nations Cup 25–26, vilodag 27, individuellt 28 jul–1 aug).
- Format-/tävlingssektionerna: säkerställ att kvalheat/tidskval/strykresultat/semifinal glosas innan de används; behåll länken till förklaringsartikeln.
- **FAQ-texten måste vara identisk med `FaqJsonLd`-schemat** (samma array matar båda — den kopplingen finns redan, bevara den).
- Behåll alla siffror (180 förare, 8 kvalheat, 18 finalister, 10 race, 3:e av 102).

- [ ] **Step 4: Lägg träningen i `SportsEventJsonLd`**

I `src/components/JsonLd.tsx`, lägg till ett `subEvent` för träningen och håll `description`-raderna korrekta:

```ts
      {
        "@type": "SportsEvent",
        name: "KWC Training 2026",
        startDate: "2026-07-22",
        endDate: "2026-07-24",
      },
```

Lägg det först i `subEvent`-arrayen (före Nations Cup). Rör inte `.en`-grenens betydelse felaktigt — uppdatera båda `description`-varianterna bara om de blir inaktuella (de nämner inte träning idag, så de kan stå).

- [ ] **Step 5: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Run: `npm run build`
Expected: bygget grönt (verifierar att JSON-LD och sidan renderar).
Visuell koll: `/vm-2026` — schemat visar fyra rader, FAQ läser rätt.

- [ ] **Step 6: Checkpoint**

Diff + skärmdump till Rickard. Commit på hans ja:

```bash
git add "src/app/(sv)/vm-2026/page.tsx" src/components/JsonLd.tsx
git commit -m "copy(sv): vm-2026 — schema dygn för dygn, FAQ och träning i schema.org"
```

---

## Task 7: Servicesidor — Partners, Kontakt, Media, Press, Nyhetslistan

**Files:**
- Modify: `src/app/(sv)/partners/page.tsx`, `src/app/(sv)/kontakt/page.tsx`, `src/app/(sv)/media/page.tsx`, `src/app/(sv)/press/page.tsx`, `src/app/(sv)/nyheter/page.tsx`

**Interfaces:**
- Consumes: ordlistan; håll partner-fakta i linje med minnet `partners-primab-labatus` (inga löften om mätbar exponering).
- Produces: inget.

- [ ] **Step 1: Läs alla fem sidor**

Läs varje `page.tsx`. Notera synlig prosa vs. metadata vs. media-bildtexter (bildtexter är verifierade — se minnet `media-captions-att-verifiera` — rör inte plats/år).

- [ ] **Step 2: Skriv om via kvalitetskedjan**

Kör kedjan per sida. Krav:
- Partners: begriplig, ödmjuk pitch; inga löften om mätbar exponering; håll Primab/Labatus-fakta rätt.
- Kontakt/Media/Press: putsa metadata + löptext; glosa ev. begrepp; rör inte verifierade bildtexter, e-post eller länkar.
- Nyhetslistan: `news.title/description` (i `dictionary.ts`, redan Task 1) plus ev. sidtext.

- [ ] **Step 3: Verifiera**

Run: `npx tsc --noEmit`
Expected: inga fel.
Visuell koll: öppna de fem sidorna i webbläsarpanelen.

- [ ] **Step 4: Checkpoint**

Diff till Rickard. Commit på hans ja:

```bash
git add "src/app/(sv)/partners/page.tsx" "src/app/(sv)/kontakt/page.tsx" "src/app/(sv)/media/page.tsx" "src/app/(sv)/press/page.tsx" "src/app/(sv)/nyheter/page.tsx"
git commit -m "copy(sv): servicesidor — tydligare språk"
```

---

## Task 8: Nyhetsartiklar (MDX) — frontmatter + brödtext

Brödtexterna är mestadels starka; den svaga punkten är `description`-raderna som syns i kort och sök.

**Files:**
- Modify: `content/nyheter/sa-funkar-hyrkart-vm.mdx`, `content/nyheter/sveriges-lag-i-nations-cup.mdx`, `content/nyheter/vagen-till-vandel.mdx`

**Interfaces:**
- Consumes: ordlistan; håll VM-formatet i linje med minnet `kwc-format-tidskval` (tidskval sätter startordningen, INTE slump; kartarna lottas).
- Produces: inget.

- [ ] **Step 1: Läs alla tre artiklar**

Läs varje `.mdx` i sin helhet (frontmatter + brödtext).

- [ ] **Step 2: Skriv om via kvalitetskedjan**

Kör kedjan. Krav:
- **`sveriges-lag-i-nations-cup.mdx`**: skriv om `description`-raden ("Den 25–26 juli kör Sverige Nations Cup i hyrkart-VM. Jag har kört lagtävlingen i alla mina VM, ofta nära pallen men aldrig riktigt fram. I år siktar vi dit.") → tydligare och konkret (t.ex. vad "nära pallen" betyder: femma 2015–2017, sexa 2018, i år siktet mot pallen). Brödtexten är stark — lätt puts endast.
- **`vagen-till-vandel.mdx`**: putsa titel, description och brödtext; behåll fakta.
- **`sa-funkar-hyrkart-vm.mdx`**: redan mönstret — mikroputs, rensa ev. "racecraft" (rad 14) till svensk formulering konsekvent med startsidans "Läser racet"-språk.
- Alla år/siffror/namn oförändrade. Håll `description` inom rimlig SEO-längd (~150–160 tecken).

- [ ] **Step 3: Verifiera**

Run: `npm run test`
Expected: `content.test.ts` grönt (använder fixtures, påverkas inte, men bekräftar att MDX-parsern är nöjd).
Run: `npm run build`
Expected: grönt (renderar MDX).
Visuell koll: öppna varje artikel + nyhetskorten i webbläsarpanelen; läs description i kortet.

- [ ] **Step 4: Checkpoint**

Diff till Rickard. Commit på hans ja:

```bash
git add content/nyheter/
git commit -m "copy(sv): nyhetsartiklar — tydligare titlar och beskrivningar"
```

---

## Task 9: Slutverifiering — hela sajten

**Files:** inga (verifiering + ev. småfixar som dyker upp).

- [ ] **Step 1: Full typecheck + tester + build**

Run: `npx tsc --noEmit`
Expected: inga fel.
Run: `npm run test`
Expected: alla gröna.
Run: `npm run build`
Expected: grönt, inga sid-/schema-fel.

- [ ] **Step 2: Fakta-svep**

Läs igenom diffen mot `src/lib/results.ts`/`STORY_FACTS`/`KWC`: bekräfta att inget tal, årtal eller placering glidit. Bekräfta att paradox-glosan är konsekvent formulerad överallt den förekommer (startsida, karriär, om, resultatnot).

- [ ] **Step 3: Nybörjar-läsning**

Öppna i webbläsarpanelen och läs som någon utan racingkunskap: `/`, `/karriar`, `/om`, `/vm-2026`, en artikel. Notera kvarvarande ställen som fortfarande antar förkunskap eller innehåller svengelska; åtgärda och verifiera om.

- [ ] **Step 4: Slutcheckpoint**

Sammanfatta för Rickard vad som ändrats per yta. Push/PR endast på hans uttryckliga begäran (aldrig `main`).

---

## Self-Review (ifylld av planförfattaren)

- **Spec-täckning:** Alla spec-ytor mappade — delade strängar (T1), resultatdata (T2), första mötet (T3), karriär (T4), om (T5), vm-2026 + schema + JsonLd (T6), servicesidor (T7), nyhetsartiklar inkl. frontmatter (T8), slutverifiering (T9). Svengelska/racecraft (T3+T8), schema dygn-för-dygn (T1+T6), paradox-glosan (T2/T3/T4/T5). Kvalitetskedjan i varje texttask.
- **Placeholders:** Inga TODO/TBD. Ankarcopy (racecraft-kort, schema-rader, JsonLd-subevent, Nations Cup-description) är konkret angiven; övrig slutlig lydelse produceras av kvalitetskedjan vid exekvering, vilket är själva arbetet.
- **Typkonsistens:** `KWC.trainingLabel`/`KWC.restDayLabel` definieras i T1 och konsumeras i T6 med samma namn/typ. `SCHEDULE`-formen matchar befintlig render (`dates`/`label`/`detail`/`highlight`). Inga rörda `data-*`/refs i T4.
