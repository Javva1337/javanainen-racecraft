# REA-anteckning: Ben Kaluza hero → Asphalt Signal (R01)

## Källor och vad de säger

| Källa | Vad den ger | Vad den inte ger |
|---|---|---|
| `design/refs/benkaluza/` (designlang, 2026-10-30) | Tokens, rörelsetokens, skärmdumpar. Mörk yta `#0b0b0b` 92 %, gul primär `#faf600`, röd sekundär `#b3261e`. Rörelse: scroll-länkad (`scrollLinked: true`, 36 observerade triggers), reveal via `filter`, easing `cubic-bezier(0.2,0.7,0.2,1)`, durationer 228 / 300 / 450 / 1000 / 1600 ms. | Cursor-beteendet. Det är runtime (canvas/WebGL) och syns inte i en statisk extract. |
| `docs/HERO-CURSOR-MECHANICS.md` (VD live-tolkning) | Mekaniken: cursor-driven ink-trail som äter porträttet → robotskalle, cyan öga, HUD-brackets, binary-fält, scroll paper → svart. | Exakta implementationsdetaljer. Vi har inte läst Bens källkod, så implementationen nedan är egen. |

Slutsats: **extract ger känsla och rörelsetempo, live-tolkningen ger mekaniken.** Inget är kopierat 1:1, och Bens gula accent används inte.

## Översättning Ben → Asphalt Signal

| Ben (tolkat) | Rickard / Asphalt Signal | Fil |
|---|---|---|
| Ljus start-yta, svart efter scroll | `--paper` → `--void`, driven av scroll-progress (smoothstep). `html[data-tone]` låter headern byta färg. | `StickyField.tsx` |
| Fixed binary 0/1-fält bakom allt | Fixed canvas: pastell på paper, `--signal`/`--timing` på void. Asfaltsgrid med perspektiv som glider med scroll. | `StickyField.tsx` |
| Mörk blank ink-blob efter musen, binary inuti | Radial-stampad trail-mask (låg upplösning, ~5 % decay per bildruta) som klipper ett mörkt pattern: grid `--line` + 0/1 i `--signal`/`--timing`, flimrar ~8 ggr/s. | `HeroCyborg.tsx` |
| Trailen äter ansiktet → robot | Separat "uppätet"-grid (72×96) som fylls av musen och avtar långsamt (~20 s). Maskar robotlagret, så avslöjandet är progressivt och kräver rörelse. | `HeroCyborg.tsx` |
| Krom/svart robotskalle med paneler, kablar, kuggar | Fotot avfärgas till stålramp med band (pixelbearbetning), sedan ritas sömmar, kindpaneler, munnens galler, två kugghjul, halskablar (en i `--signal`) och kretsspår på overallen. Allt procedurellt, seedat. | `robot.ts` |
| Cyan öga | Höger öga (sett från betraktaren) i `--timing`: iris, ringar, pupill, pulserande glöd, roterande ticks. | `robot.ts` `drawEye` |
| Nos/haka wireframe | Triangelnät i `--timing` över nos, kind och haka. | `robot.ts` |
| Tracking-brackets, YAW/PITCH, SCANNING↔TRACKING | DOM-HUD över porträttet. Brackets följer musen ±6 px, byter till `--signal` (öga: `--timing`) när musen är i ramen. YAW/PITCH räknas från musposition. Siffrorna på NOSE/MOUTH jittrar. | `HeroCyborg.tsx`, `globals.css` |
| Crosshair | Signal-hårkors + `--timing`-ring + X/Y-läsning i canvas. | `HeroCyborg.tsx` |
| Micro-effekter | Partikelgnistor vid snabb rörelse, scan-line som sveper över roboten, glitch-frame (slice-förskjutning + signal-streck) var 3,5–7 s, hörn-HUD. | `HeroCyborg.tsx` |
| Gul CTA | `btn-primary` = `--signal` med hård kant. Ingen gul default. | `globals.css` |

## Beslut som avviker från live-tolkningen

- **Porträttet är ingen frilagd cut-out.** Vi har inget segmenteringsverktyg, så fotot visas i en hård ram (0 px radie, `4–6 px` signal-skugga). Robotlagret följer fotots geometri. Byt till en riktig cut-out när en finns (samma landmärken i `robot.ts` `PT`).
- **Hero börjar på paper** (enligt HERO-CURSOR-MECHANICS), inte void som DESIGNSPEC §2 rekommenderade. Kapitlen följer sedan: void (Läser racet, Brons, Vandel) → paper (Banor) → void (Partners).
- **Ingen Three.js/R3F.** Hero och fält är Canvas 2D: inga nya beroenden, lägre kostnad på mobil. Fältet kan bytas mot R3F senare utan att röra hero.
- **"FACE MESH · 468 PTS"** är dekorativ HUD-text, ingen körande face-mesh-modell.
- Horisontell tidslinje driven av vertikal scroll är inte med i R01 (nice-to-have i specen).

## Tillgänglighet och prestanda

- `prefers-reduced-motion`: ingen canvas, ingen trail, ingen Lenis, inget scroll-fade. Kvar: statiskt porträtt, statiska brackets, statiskt fält. Cues "för musen…" döljs.
- Touch: `touch-action: pan-y` på heron, horisontellt finger-drag ger trail, vertikal scroll fungerar. Cue-texten byts via `(hover: none)`.
- Effektlagret ritar bara när heron syns (IntersectionObserver) och inom ~3 s efter senaste rörelse eller medan robot-gridet inte är tomt. DPR kapas till 1,5.
- Bakgrundsfältet körs på ~24 fps.
- Porträttet i canvas laddas först vid första musrörelse, så LCP-bilden är den vanliga `next/image`.
- Canvas är `aria-hidden`. HUD-text är dekoration (`aria-hidden`). Bilden har alt-text.
