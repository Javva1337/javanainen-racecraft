

## Rewrite all copy to match tone & style guidelines

**Summary**: Go through every text-bearing component and rewrite all copy to be factual, scannable, short-sentenced, and written from an established profile's perspective. Remove emotional/selling language, fix incorrect data (year typos), and restructure sponsor section from sponsor's perspective.

### Issues found in current copy

| Section | Problems |
|---|---|
| **Hero** | "VM-satsande" sounds aspirational; "Bevisad prestation" is vague |
| **Positioning** | "Vinner med precision och kalkyl" = kaxigt; "Siktar på det ultimata målet" = säljigt; year says 2025 instead of 2026 |
| **About** | "motorsportresa" (banned word "resa"); "drömmen aldrig riktigt släppt" (banned "dröm"); sentences too long; written in narrative style rather than fact-first |
| **Career** | Placeholder data with wrong years (2019-2025) instead of real milestones (2015-2026); descriptions use filler ("omedelbar potential") |
| **Results** | Placeholder/fictional data — needs real results or removal |
| **Sponsors** | "En investering i..." = säljigt; "ambition" = fluff; descriptions talk about Rickard, not what partner gets concretely |
| **Contact** | "Skicka meddelande" is fine; section is clean |

### Changes per file

**1. HeroSection.tsx** — Tagline rewrite
- Change to: `Hyrkart&ensp;|&ensp;3:e plats VM 2016&ensp;|&ensp;VM Billund 2026`
- Buttons: keep "Se karriär" and "Bli partner" (already good per guidelines)

**2. PositioningSection.tsx** — Rewrite all three cards
- "Top 3 i VM" → desc: "Bronsmedaljör i VM 2016. Finalist i VM 2015, 2017 och 2018."
- "Strategisk racecraft" → desc: "Stark i taktiska beslut under race. Konsekvent i tävlingssituationer."
- "VM Billund 2025" → fix to "VM Billund 2026", desc: "Världsmästerskapet i hyrkart. Billund, Danmark. Juni 2026."

**3. AboutSection.tsx** — Rewrite biography, fact-first, short sentences
- Remove "resa", "drömmen", emotional language
- Structure: bakgrund → resultat → nuvarande fokus
- Short paragraphs, max 2-3 sentences each, fact-first

**4. CareerSection.tsx** — Replace placeholder milestones with real data
- 2005: Gokart, 10 år
- 2015: SRKC-vinst Linköping + VM Italien, Nations Cup-seger
- 2016: VM Italien — 3:e totalt, vinst i finalheatet
- 2017: VM-final, Spanien
- 2018: SRKC-vinst Göteborg + VM-final Polen (16:e → 9:e)
- 2021: SRKC-final, 6:e plats
- 2026: VM Billund, Danmark

**5. ResultsSection.tsx** — Replace with real results from biography
- SRKC Linköping 2015 — 1:a
- KWC Nations Cup Italien 2015 — 1:a (lag)
- KWC Individuellt Italien 2015 — Finalist
- KWC Italien 2016 — 3:e (VM)
- KWC Spanien 2017 — Finalist
- SRKC Göteborg 2018 — 1:a
- KWC Polen 2018 — 9:e (uppkörning från 16:e)
- SRKC 2021 — 6:e

**6. SponsorsSection.tsx** — Rewrite from sponsor perspective
- Heading: "Partners" (drop "& Sponsorer")
- Intro: "Samarbeten byggs kring synlighet, trovärdighet och gemensamt värde."
- Value cards rewritten:
  - Exponering: "Logotyp på kart, racingdräkt och digitala kanaler. Synlighet vid internationella tävlingar."
  - Nätverk: "Koppling till motorsport på elitnivå. Närvaro vid event och mästerskap."
  - Trovärdighet: "Associering med dokumenterade resultat på VM-nivå."
- CTA button: "Bli partner" stays, it's already good

**7. ContactSection.tsx** — Minor tweak
- Button: "Skicka meddelande" → "Skicka" (shorter, more neutral)

### Technical detail
All changes are text/data-only within existing component files. No structural, styling, or logic changes needed. Seven files edited.

