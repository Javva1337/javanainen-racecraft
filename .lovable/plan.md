

## Updates to Partners & Results sections

### 1. SponsorsSection.tsx — Three changes

**a) Value cards: reduce from 3 to 2, rewrite content**
- **Remove** "Nätverk" card entirely
- **Exponering** → new desc: "Logotyp på racingoverall, digitala kanaler och takbox på tävlingsbilen. Vill man slå på stort finns möjlighet att lacka om hjälmen."
- **Trovärdighet** → rename to "Stötta satsningen" or similar, desc: "Var med på vägen mot VM-titeln. Associering med dokumenterade resultat på VM-nivå."
- Grid changes from `md:grid-cols-3` to `md:grid-cols-2`

**b) Logo grid: replace placeholder text with inviting CTA**
- Remove "Nuvarande & framtida partners" heading
- Keep PrimAB logo in slot 1
- Replace empty placeholder slots with a styled "Bli nästa partner?" text/CTA instead of "Logotyp 2/3/4"
- Show 3 empty slots with "Din logotyp här?" or one merged CTA slot

**c) Keep "Bli partner" CTA button as-is**

### 2. ResultsSection.tsx — Update results data

Replace current results array with corrected data:
```
SRKC Linköping | Linköping | 2015 | 1:a | podium
KWC Individuellt | Italien | 2015 | 7:e | no
KWC — VM | Italien | 2016 | 3:e | podium
KWC | Spanien | 2017 | 11:e | no
SRKC Göteborg | Göteborg | 2018 | 1:a | podium
KWC | Polen | 2018 | 12:e | no
SRKC | Sverige | 2021 | 6:e | no
SRKC | Sverige | 2026 | 3:e bästa svensk | no
```

Remove the Nations Cup row (was not in user's updated list). Update positions to match user's corrections (7:e, 11:e, 12:e instead of previous values). Add 2026 SRKC result.

### Technical detail
Two files edited, text/data only. No structural changes except grid column count on value cards (3→2).

