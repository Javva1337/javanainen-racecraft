## Lägg till Labatus som första sponsor

### Val av logofil
Sidan har en mycket mörk bakgrund (`--background: 0 0% 4%`), så **den negativa (vita) varianten** används. Jag väljer **SVG-formatet** (`Labatus_Logo_NEG_RGB.svg`) eftersom det är vektorbaserat, skalar perfekt på alla skärmstorlekar och har minimal filstorlek.

### Vad som byggs

Partners-sektionen byggs om så att den både visar en stolt presentation av Labatus som befintlig partner OCH behåller den inbjudande "Vill du synas här?"-känslan för framtida sponsorer. Det får sektionen att kännas etablerad utan att stänga dörren för fler.

### Ny struktur i `SponsorsSection.tsx`

1. **Rubrik & intro** — oförändrat ("Partners")
2. **Värdeerbjudande-korten** (Exponering / Stötta satsningen) — oförändrade
3. **NYTT: "Officiell partner"-block**
   - Liten etikett: "OFFICIELL PARTNER" (guld, tracking-wide, uppercase)
   - Labatus-logotypen centrerad, generös storlek (~max-w-xs/sm), med padding och subtil hover-effekt
   - Stilren ram i samma stil som övriga kort
4. **"Vill du synas här?"-CTA** — behålls men flyttas under Labatus-blocket och justeras språkligt så det passar nu när det finns en partner ("Bli en del av resan tillsammans med Labatus...")

### Filer som ändras

- **Ny fil**: `src/assets/labatus-logo.svg` (kopia av `user-uploads://Labatus_Logo_NEG_RGB.svg`)
- **Ändras**: `src/components/SponsorsSection.tsx` — importera logotypen, lägg till Officiell partner-block, justera CTA-texten

### Designdetaljer
- Logotypen importeras som ES6-modul från `@/assets/labatus-logo.svg`
- Block-bakgrund: subtil `bg-card` med `border-primary/20` för att lyfta fram partnern
- Scroll-reveal-animation i samma stil som övriga element
- Responsiv: logo skalar ner snyggt på mobil
