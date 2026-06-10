## Lägg till Primab som partner

### Hämtning av logotyp
Primabs logotyp ligger publikt på deras WordPress-installation:
`https://primab.se/wp-content/uploads/2022/11/primab_logotyp2.webp`

Jag laddar ner filen, konverterar den till PNG (bättre kompatibilitet än webp för logotyper i React) och sparar i `src/assets/primab-logo.png`.

### Hantering av mörk bakgrund
Primabs logotyp är mörkblå och syns dåligt direkt mot sajtens svarta bakgrund. Lösning: visa logotypen på en ljus "chip" (vit bakgrund med subtil padding och rundade hörn) så färgerna behåller sin identitet. Det är en vanlig och elegant lösning för partnervisning där olika sponsorer har olika logotypstilar.

### Ny struktur i `SponsorsSection.tsx`

Eftersom vi nu går från 1 till 2 partners byggs "Officiell partner"-blocket om till en **partner-grid** istället för ett enskilt logo-block:

1. **Rubrik & intro** — oförändrat
2. **Värdeerbjudande-korten** — oförändrade  
3. **Partner-grid** (ny layout):
   - Etikett: "PARTNERS" (guld, uppercase, tracking-wide) — uppdaterad från "OFFICIELL PARTNER"
   - 2-kolumners grid (1 kolumn på mobil) inuti samma ram som idag
   - **Labatus**: vit SVG visas direkt mot mörk bakgrund (som idag)
   - **Primab**: visas på en ljus chip (`bg-white` med padding ~`p-8`, subtila rundade hörn) så den mörkblå loggan syns tydligt
   - Båda är klickbara länkar med hover-effekt
4. **"Vill du synas här?"-CTA** — uppdateras: "Bli en del av resan tillsammans med Labatus och Primab..."

### Filer som ändras

- **Ny fil**: `src/assets/primab-logo.png` (nedladdad och konverterad från primab.se)
- **Ändras**: `src/components/SponsorsSection.tsx` — partner-grid med båda logotyperna, uppdaterad CTA-text

### Designdetaljer
- Båda logotyperna får samma höjd-budget (`max-h-20` eller liknande) så de visuellt balanseras trots olika proportioner
- Labatus: behåller `opacity-90 hover:opacity-100` på mörk yta
- Primab: ljus chip med subtil skugga eller `border-primary/10` så den smälter in med övrig design
- Responsiv: staplas vertikalt under `md`-brytpunkt

### Att tänka på
Att hämta en logga från ett företags hemsida utan deras explicita godkännande är vanligt för "syns hos sponsor"-listor men juridiskt en gråzon. Rekommenderar att du dubbelkollar med Primab att de är okej med visningen — gärna be om en officiell logotypfil i hög upplösning på samma gång.
