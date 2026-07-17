# Svenskt språkomtag — "skriv så vem som helst förstår"

**Datum:** 2026-07-17
**Branch:** `fix/karriar-granskningsfynd`
**Omfattning:** All användarvänd svensk text på sajten. Engelska sidorna (`/en/**`) rörs inte.

## Bakgrund

Sajtens svenska text är skriven för någon som redan följer hyrkart-VM. En läsare
utan koll på formatet tappar tråden. Tydligaste exemplet: på startsidan och i
karriärberättelsen står "Vinst i finalen" strax intill "3:e av 102 — VM-brons".
För en utomstående låter det som en självmotsägelse — hen saknar informationen att
VM-titeln avgörs på sammanlagda poäng från hela veckan, så att vinna sista racet
ändå "bara" räckte till brons totalt (vilket gör bedriften större, inte mindre).

Samma sak gäller oförklarade begrepp som möter besökaren direkt: *hyrkart, KWC,
SRKC, Nations Cup, stint, depåstopp, kvalheat, tidskval, "näst bästa svensk",
Hall of Fame.*

Förklaringsartikeln [`content/nyheter/sa-funkar-hyrkart-vm.mdx`](../../../content/nyheter/sa-funkar-hyrkart-vm.mdx)
är redan skriven exakt så här — enkelt, för alla. Den är ankaret resten av sajten
lutar sig mot.

## Mål

En förstagångsbesökare utan racingkunskap ska förstå vad som hänt och varför det är
imponerande, utan att texten blir tjatig eller skolboksaktig för de racingintresserade.

## Vald metod

**Väva in kontexten i löptexten** — korta förklarande bisatser i Rickards egen röst,
plus tydliga länkar till förklaringsartikeln från nyckelsidorna. **Ingen ny
UI-komponent**, inga faktarutor, inga påklistrade intro-block.

## Redaktionella principer (regelboken)

1. **Ingen jargong naken vid första mötet.** Första gången ett tungt begrepp dyker
   upp på en sida får det en kort förklaring i löptexten. Därefter kan det användas fritt.
2. **Lös upp paradoxerna.** Där ett resultat låter motsägelsefullt för en utomstående
   läggs raden till som gör det begripligt *och* rättvist:
   - "Vann finalracet men kom trea" → VM-titeln avgörs på sammanlagda poäng från hela
     veckan, så att vinna sista racet räckte till brons totalt.
   - "Stint från sist till först — men laget femma" → förklara att Nations Cup är en
     lagtävling där allas resultat räknas ihop.
   - "Näst bästa svensk", "3:e av 102" → sätt siffran i sammanhang.
3. **Fakta rörs inte.** Alla siffror sitter kvar i `results.ts`/`STORY_FACTS`
   (sanningskällan). Vi ändrar formuleringar, aldrig resultat, årtal eller placeringar.
4. **Ödmjuk ton.** Kontext ska göra bedriften tydlig utan att skryta. Poängen är
   "så du förstår vad som hände", inte "kolla vad jag gjorde". Se minnet `ton-odmjuk-copy`.
5. **En röst.** Första person där berättaren redan talar (Om, karriär, rapporter);
   neutralt tredje-person där sajten talar (meta, etiketter, knappar).
6. **Konsekventa förklaringar.** En standardformulering per begrepp (se ordlistan)
   så samma sak inte förklaras på fem olika sätt.

## Ordlista — begrepp som ska glosas vid första mötet

Kort, enkel förklaring vid första omnämnandet, i förklaringsartikelns ton. Exakt
lydelse landas i copywriting-passet:

- **hyrkart** — racing där alla kör likvärdiga kartar som arrangören ställer upp; bara föraren skiljer.
- **Kart World Championship / KWC** — världsmästerskapet i hyrkart.
- **SRKC** — den svenska serien / kvalet till hyrkart-VM.
- **Nations Cup** — lagtävlingen i VM där man kör för sitt land; allas resultat räknas ihop.
- **kvalheat** — de inledande racen som avgör vem som går vidare.
- **tidskval** — ett enda varv som sätter startordningen inför ett heat.
- **strykresultat** — det sämsta resultatet räknas bort.
- **stint** — den sträcka en förare kör innan nästa tar över (i lagtävling).
- **depåstopp** — förarbytet/stoppet i depån under en lagtävling.
- **semifinal/final** — stegen som avgör titeln.
- **Hall of Fame** — SRKC:s hedersgalleri.
- **"näst bästa svensk"** — placeringen bland svenskarna, satt i sammanhang.

## Svengelska att rensa

- **"racecraft"** → svensk formulering. Meritkortets rubrik "Strategisk racecraft"
  blir **"Läser racet"** (signalerar strategiskt smart racing, inte bara rå fart),
  med brödtext i stil med: *"Racet avgörs lika mycket på huvudet som på gasen —
  rätt beslut i rätt läge, race efter race."* Förklaringsartikelns rad
  "ett test av racecraft, strategi och konsekvens" formuleras om utan svengelska
  (t.ex. körskicklighet/beslut/konsekvens) så den hänger ihop. Engelska sidan rörs inte.
- Håll utkik efter fler svengelska glidningar under skrivandet och rensa dem på samma sätt.

## Schema/datum — förtydligande

VM-veckan ska förklaras dygn för dygn så en utomstående förstår upplägget. Auktoritativ
indelning (från Rickard):

| Datum | Vad som händer |
| --- | --- |
| 22–24 juli | Träning |
| 25–26 juli | Nations Cup (lagtävlingen) |
| 27 juli | Vilodag |
| 28 juli–1 augusti | Individuella mästerskapet (KWC Individual) |

Detta stämmer med `SportsEventJsonLd` som redan har Nations Cup och Individual som
subEvents; det som saknas är **träning (22–24)** och **vilodag (27)**.

Åtgärder:
- **Sanningskälla:** lägg till konstanter i `KWC` (`src/lib/site.ts`) för träning
  (22–24 juli) och vilodag (27 juli), i linje med filens princip att datum aldrig
  hårdkodas i sidor.
- **Synligt schema** på `/vm-2026`: bygg ut `SCHEDULE` till fyra rader
  (träning · Nations Cup · vilodag · individuella VM) i stället för dagens vaga
  "VM-veckan börjar".
- **FAQ** "När och var körs hyrkart-VM 2026?": ta med hela dygnsindelningen.
- **Komprimerade rader** (tagline i `site.ts`, meritkort på startsidan) hålls korta
  men korrekta; hela dygn-för-dygn-bilden bor på `/vm-2026`.
- **Strukturerad data:** överväg att lägga träningen (22–24 juli) som ett `subEvent`
  i `SportsEventJsonLd` så schemat är komplett. Håll `description`-raderna i synk.

## Ytor som skrivs om

### Delade strängar (sanningskällor)
- `src/lib/site.ts` — `TAGLINE`, `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION` (endast `.sv`).
- `src/lib/dictionary.ts` — nav/footer/nyhetsbrev/artikel/faktaruta (`sv`-grenen). Mest ok, putsas.
- `src/lib/results.ts` — `RESULTS`-noter, `TIMELINE`-beskrivningar, `STATS`-etiketter
  (`.sv`-fälten). Formuleringar, inte siffror.
- `src/lib/career-story.ts` — kapiteltitlar (om de behöver bli självförklarande).

### Första mötet
- `src/components/Hero.tsx` (via `TAGLINE`) och rubrik.
- `src/app/(sv)/page.tsx` — `MERITS` (bronsparadoxen sitter i första kortet;
  "Strategisk racecraft" är jargong), sektionsrubriker.

### Berättelsen `/karriar`
- `src/components/career/`: `ChapterDalarna`, `ChapterBanracing`, `ChapterGenombrottet`,
  `ChapterBronset` + `BronzeSequence` (paradoxen), `ChapterJakten`, `ChapterVandel`,
  `QuoteInterlude`, samt räknar-/etikettext (`ClimbCounter`, `FieldCounter`,
  `GinettaStats`, `StartFieldGrid`).
- Ingresser (`lede`) via `ChapterSection`.

### Djupsidor
- `src/app/(sv)/om/page.tsx` — 6 kapitel + avslutande citat.
- `src/app/(sv)/vm-2026/page.tsx` — redan bra; putsas så jargong aldrig kommer före
  sin förklaring, säkra länk till förklaringsartikeln.

### Servicesidor
- `src/app/(sv)/partners/page.tsx`, `kontakt/page.tsx`, `media/page.tsx`,
  `press/page.tsx`, `nyheter/page.tsx` (+ ev. `[slug]` ramtext).

### Nyhetsartiklar
Både **frontmatter (`title` + `description`) och brödtext** gås igenom. Brödtexterna
är redan mestadels starka och begripliga — där räcker lätt puts. Den svaga punkten
sitter oftare i `description`-raderna, som dessutom syns mest (artikelkort, Google/AI-sök),
så de prioriteras.
- `content/nyheter/sa-funkar-hyrkart-vm.mdx` — redan mönstret, ev. mikroputs.
- `content/nyheter/sveriges-lag-i-nations-cup.mdx` — brödtext stark; skriv om
  `description`-raden ("ofta nära pallen men aldrig riktigt fram. I år siktar vi dit"
  → tydligare och mindre vag).
- `content/nyheter/vagen-till-vandel.mdx` — läs & putsa titel, description och text.

**Princip:** all svensk text på sajten gås igenom — inklusive varje artikels titel
och description, inte bara brödtexten.

## Kvalitetskedja (per textyta, i denna ordning)

Enligt projektets `CLAUDE.md`:
1. `copywriting` — skriv/förbättra copyn.
2. `seo-audit` — Google: rubrikstruktur, meta, on-page.
3. `ai-seo` — AI-sök (endast svenska ytor).
4. `humanizer` — sista passet, ta bort AI-drag, landa den ödmjuka tonen.

## Arbetsordning

1. Delade strängar + ordlistans standardformuleringar.
2. Första-möte-sidorna (Hero, startsida).
3. Berättelsen `/karriar`.
4. Djupsidor (`/om`, `/vm-2026`).
5. Servicesidor.
6. Nyhetsartiklar.
7. **Verifiering:** `next build` grönt + snabb visuell koll i webbläsarpanelen på
   nyckelsidorna innan något anses klart.

## Avgränsningar (icke-mål)

- Ingen ny UI-komponent, inga faktarutor, inga intro-block.
- Inga nya fakta uppfinns. Om kontext kräver en uppgift som inte finns i källorna
  stäms den av med Rickard i stället för att gissas.
- Engelska sidorna (`/en/**`) och engelska strängfälten rörs inte.
- Inga strukturella/komponent-refaktoreringar utöver det textbytet kräver.
- Layout, design, animationer och sanningskälls-arkitekturen (`results.ts` ↔ komponenter)
  lämnas orörda.

## Risker & vaktposter

- **Sifferglidning:** noter och löptext måste fortsatt matcha `results.ts`/`STORY_FACTS`.
  Ändra aldrig ett tal på ett ställe utan det andra.
- **Överförklaring:** balansera så racingläsaren inte tröttnar — glosa en gång per sida,
  håll bisatserna korta.
- **Tonen:** dubbelkolla mot `ton-odmjuk-copy` — kontext får inte tippa över i skryt.
- **Commit/push:** endast på uttrycklig begäran; aldrig direkt på `main`.
