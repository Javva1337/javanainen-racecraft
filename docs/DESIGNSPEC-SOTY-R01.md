# Modeateljén R01 — rickardjavanainen.se SOTY showcase

**Status:** PREVIEW ONLY — MERGA INTE  
**Gren:** `feat/rj-soty-showcase-r01`  
**Mål:** Elit-idrottsprofil (gokart/KWC), cinematic storyline. Inte Studio Javanainen-pitch.  
**Inspiration (känsla, inte pixelklon):** benkaluza.com — continuous sticky field, kapitel-per-skärm, light→dark journey, signal-accent, typografi Archivo/Geist-nivå.

---

## 1. Positionering

Rickard Javanainen = svensk hyrkart-förare som *läser racet*. Sajten är hans sportprofil: precision, ödmjukhet, fakta från `src/lib/site.ts` + `results.ts`. Sekundär effekt (ej copy): andra profiler ska vilja ha en egen sida — men ingen webbyrå-sälj, ingen Soft Premium-jargong, ingen SJ-pitch på startsidan.

Ton: ödmjuk, konkret, dåtid där det hör hemma (VM 2026 är över). Aldrig kaxig.

---

## 2. Visuell DNA — «Asphalt Signal» (unik vs Ben-gul och vs SJ)

| Token | Hex | Roll |
|---|---|---|
| `--void` | `#07080A` | Djup asfalt / natt |
| `--asphalt` | `#101318` | Sidobakgrund |
| `--carbon` | `#1A1E26` | Ytor / kort |
| `--line` | `#2A3140` | Kanter |
| `--snow` | `#F4F1EA` | Primär text på mörkt |
| `--mist` | `#9AA3B2` | Sekundär text |
| `--signal` | `#FF3B2E` | Accent (bromsljus / timing) — **inte** Ben-gul, **inte** flaggul som default |
| `--signal-dim` | `#C42E24` | Hover/pressed |
| `--timing` | `#3DFFB0` | Sekundär signal (varvtid / «live»-ögonblick) — sparsamt |
| `--paper` | `#EDE8DF` | Ljusa kapitel (light-pass) |
| `--ink` | `#0C0E12` | Text på paper |

**Form:** 0–2 px radie. Hårda skuggor (`0 1px 0` / `4px 4px 0`) — ingen glas/blur-frost/mjuka drop shadows.  
**Tejp/signal-kant:** 2–3 px `--signal` på highlight-kort och primär CTA.  
**Typografi:** behåll Archivo (display, caps, stretch) + Inter/Geist-nivå body. Display: tät, motorsport. Body: lugn skandinavisk läsbarhet.  
**Förbjudet:** Ben-gul 1:1, SJ rost+beige papper-värld, gradienttext, glassmorphism, generiska AI-mallar, «template look».

Light→dark journey: start kan vara paper/snow hero-yta som övergår till void/asphalt genom kapitlen (eller omvänt: void hero → paper chapter → void again). Välj **en** resa och håll den konsekvent — rekommenderat: **void hero → paper «Läser racet» → void VM-kapitel → paper banor → void partners**.

---

## 3. Motion & sticky field (P0 för denna preview)

1. **Sticky/fixed field** över hela startsidan: en continuous bakgrund (Three.js-fält *eller* CSS/canvas-ekvivalent på SOTY-nivå) som hänger kvar medan kapitel scrollar ovanpå. Känsla: bana/asfalt/grid som långsamt reagerar på scroll — inte dekoration som försvinner per sektion.
2. **Lenis** (redan i `package.json`) för smooth scroll; respektera `prefers-reduced-motion` (stäng Lenis + Three-animering, behåll layout).
3. **Kapitel-per-skärm:** varje story-block ≈ 100vh (desktop), sticky headline eller pin under kort scroll, tydlig övergång.
4. GSAP/ScrollTrigger OK (redan i repo) för pin/reveal — inte för lekig bounce.

Three.js: lägg till `three` + `@react-three/fiber` + `@react-three/drei` om field byggs i R3F. Håll shader enkel (plane + noise/grid/lines) — performance > wow. Mobile: förenklad field eller statisk gradient om FPS < 40.

---

## 4. Storyline (startsida — kapitel)

| # | Kapitel | Innehåll (fakta från site/results) | Visuell ton |
|---|---|---|---|
| 0 | **Hero** | Namn + en rad racecraft («Läser racet») + mikro: 41:a/180 · Vandel 2026. CTA → Kapitel 3 eller /vm-2026. Svincool, full viewport. | Void + signal |
| 1 | **Läser racet** | Filosofi: likvärdiga kartar → beslut avgör. Kort, ödmjuk. | Paper / ink |
| 2 | **Brons 2016** | Vann finalracet, 3:e av 102. Final även 15/17/18. | Void, signal highlight |
| 3 | **Vandel 2026** | 41/180, tre pallplatser i kval, semifinal. Länk till recap/nyheter. | Void + timing accent |
| 4 | **Banor** | VG Classic / New 23 teaser (befintlig TrackLayoutsTeaser kan lyftas in cinematic). | Paper |
| 5 | **Partners** | Primab + Labatus — diskret. | Void |
| 6 | **Fot** | Befintlig footer; Studio-länk får finnas i footer/JSON-LD som idag — **inte** som hero-CTA. | — |

Behåll befintliga undersidor (/vm-2026, /karriar, /nyheter, …) fungerande. Denna R01 prioriterar **startsida showcase**; undersidor får tokens uppdaterade globalt men behöver inte full kapitel-ombyggnad än.

---

## 5. Copy-regler

- Svenska primär; EN-rutter behålls.
- Skill-kedja vid copy-ändring: copywriting → seo-audit → ai-seo → humanizer (enligt CLAUDE.md).
- Inga påhittade meriter. Alla siffror från `site.ts` / `results.ts`.
- CTA-exempel: «VM 2026 — så gick det», «Läs racecraft», inte «Bygg din sajt».

---

## 6. Acceptans (preview)

- [ ] Klickbar Vercel-preview på `feat/rj-soty-showcase-r01`
- [ ] Hero full-bleed, signal-accent synlig, namn + racecraft-rad
- [ ] Sticky/continuous field hänger genom scroll (desktop)
- [ ] Minst 4 kapitel med tydlig storyline (hero + 3)
- [ ] Lenis på; reduced-motion safe
- [ ] Tokens enligt tabell i globals + DESIGN.md sektion «Asphalt Signal R01»
- [ ] Inga Ben-gula default-CTA; flaggul får **endast** behållas där befintlig semantic «prestation» fortfarande behövs på undersidor — startsida använder `--signal`
- [ ] `tsc` + `npm test` + `npm run build` gröna
- [ ] PR titel: `[MERGA INTE] feat: SOTY showcase Asphalt Signal R01 (preview)`
- [ ] **Ingen merge till main**

---

## 7. Icke-mål (R01)

- Full redesign av admin, OG-pipeline, MDX-flöde
- Meta-ads / spend
- Byt domän eller hosting
- designlang extract av Ben som *bindande* tokens (referens OK om skill finns — Rickards DNA ovan vinner alltid)

---

## 8. Hero P0 tillägg (VD/Rickard 2026-10-30 ~20:13) — cyborg/scan-reveal

Rickard vill ha **Bens detaljer**, inte bara generisk sticky field:

1. Titta på https://benkaluza.com hero live: 3D studio-porträtt → machine-scan / cyborg-reveal, micro-effekter, continuous cut.
2. Kör `extract-design` (designlang) + `reverse-engineer-anything` (REA) mot Ben — gissa inte.
3. Översätt till Asphalt Signal (void/asphalt + `--signal`): egen cyborg/scan-reveal för **Rickards porträtt** (foto i `public/` om finns, annars placeholder med tydlig scan-rig). Inte Ben-gul pixelklon.
4. Micro-effekter: scan-lines, HUD-ticks, glitch-frames, particle sparks, timing-readouts — sparsamt men synligt; reduced-motion = statiskt porträtt + tokens.
5. Preview räknas klar först när hero visar reveal + minst 3 micro-effekter + sticky field.

Referensartefakter: `design/refs/benkaluza/` (om extract finns) + REA-anteckning i `docs/rea-ben-hero.md`.
