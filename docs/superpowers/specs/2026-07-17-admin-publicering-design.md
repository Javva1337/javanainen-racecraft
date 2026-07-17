# Design: Publicera rapport — mobil publiceringssida (`/admin`)

**Datum:** 2026-07-17
**Status:** Godkänd av Rickard (chat, 2026-07-17)
**Mål:** Rickard ska kunna publicera dagliga VM-rapporter på nyhetssidan själv, från telefon eller valfri dator, utan Claude Code. Mejlutskicket till sponsorer förblir manuellt (BCC) — utanför scope.

## Bakgrund

Nyheterna är MDX-filer i `content/nyheter/` som byggs statiskt och deployas när en commit pushas till GitHub (Vercel). Mallen `content/_mall-vm-rapport.mdx` definierar frontmatter för dagsrapporter (rubrik, beskrivning, VM-dag, dagens siffror, "imorgon"), och `content/vm-status.json` ska hållas i synk med samma siffror. Idag kräver publicering git-vana + dator. Den luckan stängs med en lösenordsskyddad publiceringssida på sajten.

## Valda avvägningar

- **Egen admin-sida** (inte färdigt git-CMS, inte GitHub-appen): skräddarsydd för mallens fält, synkar `vm-status.json` automatiskt, snabbast i depån. GitHub-appen kvarstår som manuell nödutgång.
- **Enkelt lösenord** (Rickards val) i stället för GitHub-OAuth.
- **Bild från mobilen ska funka** i huvudflödet.
- **Innehållet bor kvar i repot** — publicering = en commit via GitHubs API, Vercel bygger som vanligt.

## Komponenter

### 1. Sidan `/admin` (`src/app/admin/`)

Mobilanpassat formulär (client component) som speglar rapportmallen:

| Fält | Typ | Anteckning |
|---|---|---|
| Rubrik | text | Kroken, t.ex. "Dag 3: Från P12 till P5 i regnet" |
| Beskrivning | text, 1–2 meningar | Syns i listor/delningar |
| VM-dag | nummer 1–11 | Datum sätts automatiskt till idag; kategori alltid "VM 2026" |
| Heat körda | text/nummer | Faktarutan |
| Bästa placering | text (P–) | Faktarutan |
| Totalställning | text (P–) | Faktarutan + delningsbild |
| Nations Cup | text (P–) | Faktarutan |
| Imorgon väntar… | text | Följetongsblocket |
| Brödtext | textarea | Vanliga stycken/markdown |
| Bild | file (valfri) | Kamera/bibliotek på mobil |

Beteenden:

- **Slug** genereras automatiskt: `vm-dag-{N}-{slugifierad-krok}` (åäö → a/a/o, gemener, bindestreck). Samma dag + samma rubrik ⇒ samma slug ⇒ filen skrivs över (så rättas stavfel). Ändrad rubrik ⇒ ny slug; den gamla filen ligger kvar och städas manuellt vid behov.
- **Autospar**: hela formuläret sparas i `localStorage` vid varje ändring; återläses vid sidladdning. Rensas efter lyckad publicering.
- **Lösenord** sparas i `localStorage` efter första inmatningen (medveten avvägning: bekvämlighet på egen telefon > risk; tokenen finns aldrig i klienten, lösenordet skyddar bara publiceringsrätten).
- **Bildförminskning i klienten**: canvas-nedskalning till max 1600 px långsida, JPEG ~0.8, innan uppladdning (mobilfoton 5–10 MB > Vercels 4,5 MB-gräns).
- **Live-förhandsvisning av faktarutan** ur siffer-fälten.
- **noindex** (`robots: { index: false }`) och exkluderad ur `sitemap.ts`; ingen länk från publika sidor.
- Feedback efter publicering: "Publicerad! Live om ca 2 min" + länk till artikel-URL.

### 2. API-route `POST /api/admin/publicera` (`src/app/api/admin/publicera/route.ts`)

1. **Auth**: lösenord i header jämförs timing-säkert (`crypto.timingSafeEqual`) mot `ADMIN_PASSWORD`. Saknas env-variabeln ⇒ 503. Fel lösenord ⇒ 401.
2. **Validering** av alla fält (typ, längd, dag 1–11, bildstorlek ≤ 4 MB base64) med tydliga svenska fel.
3. **En atomisk commit** via GitHubs Git Data API (`ADMIN_GITHUB_TOKEN`, finkornig PAT med contents:write på repot):
   - blob för `content/nyheter/{slug}.mdx` (frontmatter byggs YAML-säkert på servern)
   - blob (base64) för `public/images/vm/{slug}.jpg` om bild finns
   - `content/vm-status.json` med samma siffror + `updatedAt`
   - tree → commit → uppdatera ref för `ADMIN_GITHUB_BRANCH` (default `main`)
4. **Svar**: `{ ok: true, url, slug }` eller `{ ok: false, error }` (400/401/502/503).

Env-variabler (nya i `.env.example`): `ADMIN_PASSWORD`, `ADMIN_GITHUB_TOKEN`, `ADMIN_GITHUB_REPO` (default `Javva1337/javanainen-racecraft`), `ADMIN_GITHUB_BRANCH` (default `main`).

### 3. Delad logik `src/lib/publicera.ts`

Ren, testbar logik utan I/O:

- `slugify(rubrik, dag)` — åäö-hantering, tecken-städning
- `buildArticleMdx(fält)` — frontmatter serialiseras YAML-säkert (strängar via `JSON.stringify`, giltigt YAML; citattecken/kolon i rubriker får aldrig knäcka bygget)
- `buildVmStatus(fält, datum)` — JSON-objektet för `vm-status.json`

## Felhantering

Alla fel visas på svenska, formulärinnehållet behålls alltid (autospar + ingen sidnavigering):

| Fel | Beteende |
|---|---|
| Fel lösenord | 401, "Fel lösenord." |
| Ogiltigt fält | 400 med fältspecifikt meddelande |
| GitHub-API-fel/token utgången | 502, "Kunde inte publicera — försök igen. Din text är sparad." + serverlogg |
| Env saknas | 503, "Publicering är inte konfigurerad." |
| Offline | fetch-fel fångas, samma "texten är sparad"-besked |

## Testning

Vitest, samma mönster som `src/app/api/nyhetsbrev/route.test.ts`:

- `publicera.test.ts`: slugify (åäö, specialtecken, tom krok), MDX-byggaren (citattecken/kolon/radbrytningar i rubrik — resultatet ska gå igenom `gray-matter` och ge tillbaka samma värden), vm-status-byggaren
- `route.test.ts`: fel/rätt lösenord, saknad env ⇒ 503, valideringsfel ⇒ 400, lyckat flöde (mockad GitHub-fetch, verifiera att tre filer ingår i trädet), GitHub-fel ⇒ 502
- Manuell verifiering: `next build` + `next start` (aldrig samtidigt med dev — OneDrive), mobilvy-skärmdump via puppeteer

## Medvetet bortvalt (YAGNI)

Engelsk version (sv-fallback finns), redigering/radering av äldre artiklar, mejlutskick, rate limiting utöver lösenordet, förhandsgranskning av hela artikelsidan.
