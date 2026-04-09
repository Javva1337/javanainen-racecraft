

## Ny sektion: Världsmästerskapet 2026

### Vad som byggs
En ny komponent `ChampionshipSection.tsx` som presenterar årets VM-tävling med formatbeskrivning, vad som avgör, Nations Cup och karaktär. Placeras mellan ResultsSection och GallerySection i sidans flöde.

### Struktur

Sektionen delas upp i fyra block:

1. **Intro** — Kort om KWC 2026: 160+ förare, lika förutsättningar, standardiserat material
2. **Format** — De tre stegen (8 kvalheat, 1 semifinal, final med 18 bästa) presenterade visuellt med siffror/ikoner
3. **Vad som avgör + Karaktär** — Kombination av kravlistan (stabil prestation, beslutsfattande, anpassning) och karaktärsbeskrivningen (racecraft, strategi, konsekvens)
4. **Nations Cup** — Kort beskrivning av lagtävlingen

### Design
- Samma stilmönster som övriga sektioner (scroll-reveal, gold-line, font-display headings)
- Format-stegen visas som tre horisontella kort med siffror (8 → 1 → 18)
- Kravlistan som en enkel grid med korta punkter
- Ton: saklig och faktacentrerad, inga förbjudna ord

### Filer som ändras
- **Ny fil**: `src/components/ChampionshipSection.tsx`
- **Ändras**: `src/pages/Index.tsx` — import + placering efter ResultsSection
- **Ändras**: `src/components/Navigation.tsx` — nytt nav-länk "VM 2026" mellan Resultat och Galleri

