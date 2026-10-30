# Hero — cursor-driven cyborg reveal (från Ben live-tolkning)

**Källa:** VD live-tolkning av https://benkaluza.com (2026-10-30).  
**R02: Ben-tokens (gäller, ersätter tidigare Asphalt Signal-tolkning).** Void `#0b0b0b`, paper `#f2f2f2` / `#e2e2dd`, primary gul `#faf600`, secondary `#b3261e`. Typ: Archivo / Geist / Geist Mono. Inga nya hex. Se `docs/DESIGNSPEC-BEN-1TO1-R02.md`.  
**Porträtt:** `/images/portrait.jpg` eller `/press/rickard-javanainen-portratt.jpg`.  
**Trigger:** **cursor-driven** (inte auto-play). Reduced-motion = statiskt porträtt + HUD text.

## Mekanik (måste in i preview)

1. **Start-läge:** ljus/off-white eller paper-yta; logotyp/namnrigg (Rickard, inte «BEN KALUZA»); nav. Corner HUD: t.ex. «FACE MESH · N PTS», «MOVE TO REVEAL / SCROLL TO GO DEEPER» (svenska OK: «FÖR MUSEN FÖR ATT AVSLÖJA»).
2. **Porträtt cut-out** + **fixed binary 0/1-fält** (dämpad grå → gul accent) bakom hela hero.
3. **Musrörelse** = mörk blank **ink-blob**/trail + crosshair; inuti trail: binary på mörk grid (gul `#faf600`).
4. Trail **äter ansiktet** → chrome/svart **robotskalle** (paneler, kablar, kuggar). Höger öga → **gult cyber-öga** (`#faf600`, ingen cyan i R02). Nos/haka wireframe; tröja/overall circuit-mönster om synligt.
5. Tracking-brackets på nos/mun («NOSE 98%» e.d.), YAW/PITCH HUD, SCANNING↔TRACKING (secondary `#b3261e` för SKANNAR, gul för FÖLJER).
6. **Scroll:** bakgrund paper/off-white → near-black/void; binary ljusare; header fixed; övergång till kapitel 1 (storyline). Horizontal timeline driven av vertical scroll är nice-to-have i R01 om tid finns — hero reveal är P0.

## Acceptans preview
- Cursor över porträtt visar ink-trail + progressive robot-reveal
- ≥3 micro-effekter synliga (HUD, brackets, binary, gult öga, crosshair…)
- Sticky/continuous field bakom
- prefers-reduced-motion: ingen trail/reveal-animering
