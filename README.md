# rickardjavanainen.se

Personlig racingsajt för Rickard Javanainen — Sveriges VM-förare i hyrkart.
VM-hubb, nyhetsmotor med en delningsbild per artikel och ett svenskt designuttryck
("skandinavisk minimalism möter motorsport").

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · MDX · @vercel/og · Vercel

---

## Kom igång lokalt

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest (lägeslogik, innehållspipeline, kurbits, språkväxling)
npm run build      # produktionsbygge
```

> **OBS (Windows/OneDrive):** kör aldrig `next dev` och `next build` samtidigt —
> de delar `.next`-katalogen. OneDrive-synk kan dessutom få dev-serverns
> filbevakare att kompilera i loop; produktionsflödet `build` + `start` påverkas inte.

## Publicera en daglig VM-rapport (kvällsrutinen)

1. Kopiera `content/_mall-vm-rapport.mdx` → `content/nyheter/vm-dag-N-krok.mdx`
   (filnamnet blir URL:en, t.ex. `vm-dag-3-fran-p12-till-p5`).
2. Fyll i frontmatter (`title`, `description`, `date`, `day`, `heatsRaced`,
   `bestFinish`, `standing`, `nationsCup`, `tomorrow`) + 3–5 stycken brödtext.
3. Uppdatera `content/vm-status.json` med samma siffror (styr "Läget just nu" på `/vm-2026`).
4. Committa och pusha — Vercel bygger och publicerar automatiskt (~1 min).
   Funkar utmärkt från GitHub-appen i mobilen på hotellrummet.

Faktarutan, delningsbilden ("VM DAG N" + totalställning i gult + partnerloggor)
och partnerfoten genereras automatiskt. Engelsk version av en artikel: lägg en
parallell fil `<slug>.en.mdx` — annars visas svenska med notis på `/en/news/<slug>`.

## Fakta och siffror — en enda sanningskälla

Alla datum, resultat och meriter ligger i **`src/lib/site.ts`** (KWC-datum, partners,
taglines) och **`src/lib/results.ts`** (resultattabell + tidslinje + statistik).
Tidslinjen och tabellen på `/karriar` läser samma data och kan inte glida isär.
Ändra aldrig siffror direkt i sidorna.

Lägeslogiken (före/under/efter VM) ligger i `src/lib/mode.ts` och slår om automatiskt
via ISR (styrs av tidsstämplarna i `site.ts`).

## Miljövariabler

Kopiera `.env.example` → `.env.local`. Alla är valfria — sajten fungerar utan dem:

| Variabel | Används till | Utan värde |
| --- | --- | --- |
| `RESEND_API_KEY` | Kontaktformulär + nyhetsbrevs-fallback ([resend.com](https://resend.com)) | Formuläret faller tillbaka på mailto-länk |
| `RESEND_FROM` | Verifierad avsändaradress, t.ex. `Rickard Javanainen <noreply@rickardjavanainen.se>` | Resends onboarding-adress |
| `BUTTONDOWN_API_KEY` | Nyhetsbrevsprenumeranter ([buttondown.com](https://buttondown.com), dubbel opt-in) | Adressen mejlas/loggas i stället |
| `NEXT_PUBLIC_SITE_URL` | Absolut bas-URL för OG/meta | `https://rickardjavanainen.se` |

## Deploy på Vercel

1. Pusha repot till GitHub och importera det på [vercel.com/new](https://vercel.com/new)
   — ramverket (Next.js) detekteras automatiskt, inga specialinställningar behövs.
2. Lägg in miljövariablerna ovan under **Settings → Environment Variables**.
3. Deploy. Varje push till huvudbranchen ger en ny produktion, varje PR en preview.

### Domänpekning (www + apex)

Under **Settings → Domains** i Vercel-projektet:

1. Lägg till `rickardjavanainen.se` **och** `www.rickardjavanainen.se`
   (sätt apex som primär — www redirectas automatiskt).
2. Hos domänregistraren:
   - Apex: `A`-post → `76.76.21.21`
   - www: `CNAME` → `cname.vercel-dns.com`
   (alternativt: byt till Vercels namnservrar så sköts allt automatiskt)
3. Behåll befintliga `MX`-poster så att `rickard@rickardjavanainen.se` fortsätter fungera.
4. Innan nyhetsbrevsutskick: sätt upp **SPF/DKIM/DMARC** för Resend/Buttondown
   (instruktioner finns i respektive tjänst under Domains) så utskicken inte
   hamnar i skräpposten.

## Struktur

```
content/
  nyheter/*.mdx          ← artiklarna (frontmatter + brödtext)
  _mall-vm-rapport.mdx   ← mall för dagsrapporten
  vm-status.json         ← aktuell VM-ställning (LiveStanding)
src/
  app/                   ← routes (sv i (sv)/, engelska under en/)
  components/            ← Hero, Countdown, Timeline, FactBox, PartnerFooter …
  lib/                   ← site.ts, results.ts (fakta), content.ts (MDX),
                           mode.ts (lägeslogik), og.tsx (delningsbilder), dictionary.ts
public/
  images/                ← optimeras via next/image
  press/                 ← original för nedladdning på /press
assets/                  ← källbilder (original, orörda)
```

## Kvalitetskontroller som gjorts

- `next build` utan varningar; 45 statiska sidor
- SSR verifierad med curl på samtliga routes (fullt HTML, ingen tom SPA)
- Unik titel/beskrivning/OG-bild per artikel, hreflang sv/en, JSON-LD
  (Person globalt, SportsEvent på /vm-2026, NewsArticle per artikel)
- Lighthouse mobil: Hem 90/100/100, artikel 96/100/100 (perf/a11y/SEO)
- Inget horisontellt överflöde 320–1280 px
- Flaggult används endast på mörk botten (WCAG AA)
- `prefers-reduced-motion` respekteras (CSS-övergångar + count-up/tidslinje)
