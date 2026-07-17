# Design: Engelska omtaget — saknade sidor + tvåspråkiga nyheter

**Datum:** 2026-07-17
**Branch:** feat/admin-publicering (ny gren skapas för arbetet)
**Status:** Godkänd design, redo för implementationsplan

## Mål

Engelskspråkiga följare ska kunna läsa hela sajten. Idag finns bara tre engelska
sidor (Home, Worlds 2026, News) — sex saknas. Nyheterna ska kunna skrivas i både
svensk och engelsk variant, och de tre redan publicerade artiklarna ska översättas.

## Beslut

| Fråga | Val |
| --- | --- |
| Vilka sidor byggs? | Alla sex: Career, About, Partners, Media, Contact, Press |
| Arkitektur | Spegelmönstret — egna `/en`-sidor med engelsk copy inline (som `/en` och `/en/vm-2026` idag) |
| EN-versioner av nya nyheter | Valfria EN-fält i admin-formuläret; båda språken commitas atomiskt |
| Befintliga 3 artiklar | Claude översätter till `.en.mdx`; Rickard granskar |
| URL-slugs | Engelska: `/en/career`, `/en/about`, `/en/partners`, `/en/media`, `/en/contact`, `/en/press`. `/en/vm-2026` behålls |
| RSS | `feed.xml` förblir svensk (eget EN-flöde är YAGNI) |
| Ton | Ödmjuk, fritt formulerad engelska (inte ordagrann översättning), humanizer på all ny copy |

**Förkastade alternativ:**
- **Delade sidkomponenter med lang-prop** — DRY men refaktorerar fungerande
  svenska prodsidor; copy i stora dict-objekt blir sämre att redigera.
- **next-intl med `[locale]`-routing** — ritar om hela route-strukturen för en
  tvåspråkig personlig sajt. Overkill.
- **Auto-översättning vid publicering** — kräver API-nyckel, kostar per
  publicering och översättningen går ut osedd.

## 1. URL:er & navigation

- Engelska menyn i `src/lib/dictionary.ts` utökas från 3 till 8 poster, samma
  ordning som svenska menyn: Home, Worlds 2026, News, Career, About, Partners,
  Media, Contact.
- `altLangPath()` byts från if-kedja till mappningstabell:
  `/karriar` ↔ `/en/career`, `/om` ↔ `/en/about`, `/partners` ↔ `/en/partners`,
  `/media` ↔ `/en/media`, `/kontakt` ↔ `/en/contact`, `/press` ↔ `/en/press`,
  plus befintliga `/` ↔ `/en`, `/vm-2026` ↔ `/en/vm-2026`, `/nyheter` ↔ `/en/news`
  och artikelmönstret. Okänd sökväg faller tillbaka på `/en` resp. `/` som idag.
- Språkväxlaren i headern landar därmed alltid på motsvarande sida.

## 2. De sex nya sidorna

Varje sida speglar sin svenska motsvarighet: samma komponenter, layout och
`opengraph-image.tsx`-mönster, engelsk copy inline i filen.

| Ny sida | Speglar | Noteringar |
| --- | --- | --- |
| `src/app/en/career/page.tsx` | `(sv)/karriar` | Tidslinje + resultat från `lib/results.ts` (språkneutrala data) |
| `src/app/en/about/page.tsx` | `(sv)/om` | Berättelsen, ödmjuk ton |
| `src/app/en/partners/page.tsx` | `(sv)/partners` | Inga löften om mätbar exponering (samma regel som svenska) |
| `src/app/en/media/page.tsx` | `(sv)/media` | Bildtexter översätts; verifierade plats/år-uppgifter ändras inte |
| `src/app/en/contact/page.tsx` | `(sv)/kontakt` | Kräver `ContactForm`-ändringen nedan |
| `src/app/en/press/page.tsx` | `(sv)/press` | Presskit på engelska för internationell media |

- Metadata: `canonical` + `alternates.languages` (`sv-SE`, `en`, `x-default`) på
  varje ny sida, och de svenska motsvarigheterna kompletteras med samma
  `languages`-mappning (saknas idag på alla utom startsidorna).
- **Riktad förbättring:** `ContactForm` har hårdkodad svensk copy. Den får en
  `lang`-prop och sina texter (fältetiketter, statusmeddelanden, mailto-ämne)
  från en ny `contactForm`-sektion i dictionaryn. Svenska kontaktsidan skickar
  `lang="sv"` — beteendet ändras inte.

## 3. Tvåspråkiga nyheter

- Infrastrukturen finns redan: `getArticle(slug, "en")` läser `<slug>.en.mdx`
  med svensk fallback + notis. Inga ändringar i `content.ts`:s läslogik.
- De tre befintliga artiklarna översätts till parallellfiler:
  `sa-funkar-hyrkart-vm.en.mdx`, `sveriges-lag-i-nations-cup.en.mdx`,
  `vagen-till-vandel.en.mdx`. Samma frontmatter-struktur, datum, kategori och
  siffror; titel/beskrivning/brödtext på engelska.
- Kategorinamnen i frontmatter (`"VM 2026"`, `"SRKC"`, `"Satsningen"`,
  `"Partners"`) förblir oförändrade — de är nycklar. Visningen översätts via en
  kategorimappning i dictionaryn (`VM 2026` → `Worlds 2026`, `Satsningen` →
  `The campaign` osv.); `/en/news`-listan och artikelsidorna använder den.
- En engelsk rapportmall `content/_mall-vm-rapport.en.mdx` läggs till som referens.

## 4. Admin: valfri engelsk sektion

- `AdminForm` får en hopfällbar sektion "English version (optional)" med fälten
  EN-titel, EN-ingress, EN-brödtext samt EN-tomorrow (visas bara om svenska
  tomorrow är ifyllt). EN-tomorrow är valfritt även när EN-sektionen används —
  utelämnas det får EN-artikeln inget tomorrow-block.
- **Allt-eller-inget-regel:** är något av EN-titel/ingress/brödtext ifyllt måste
  alla tre vara ifyllda, annars 400 med tydligt felmeddelande (klient- och
  servervalidering). Tomt = ingen EN-fil, svensk fallback visas som idag.
- Siffrorna (heat, placeringar, Nations Cup) återanvänds oförändrade — de är
  språkneutrala och FactBox-etiketterna översätts redan via dictionaryn.
- EN-fälten ingår i det debouncade autosparet (localStorage).
- `lib/publicera.ts` får `buildArticleEnMdx(falt, enFalt)` som bygger EN-filen
  med samma slug, datum, kategori, day, siffror och ev. bildsökväg.
- API-routen `api/admin/publicera` validerar EN-fälten och lägger
  `content/nyheter/<slug>.en.mdx` som ytterligare tree-entry i **samma atomiska
  GitHub-commit**. Slug byggs som idag från svenska titeln.

## 5. SEO & teknik

- `sitemap.ts`: de sex nya EN-routerna läggs till bland staticPages.
- `feed.xml` orörd (svensk). Robots orörd.

## 6. Testning & felhantering

TDD mot befintliga testfiler (test först, rött → grönt):

| Testfil | Nya fall |
| --- | --- |
| `dictionary.test.ts` | `altLangPath`-tabellen åt båda håll för alla nya sidor + fallback för okänd sökväg; kategoriöversättningen sv→en (mappningen bor i dictionaryn) |
| `publicera.test.ts` | `buildArticleEnMdx`: korrekt frontmatter, delad slug/datum/siffror, tomorrow/bild-hantering |
| `route.test.ts` | EN-validering: allt-eller-inget (400 vid delvis ifyllt), `.en.mdx`-tree-entry vid komplett EN, ingen entry vid tomt |

Felhantering: partiell EN-ifyllnad ger begripligt svenskt felmeddelande i admin;
GitHub-fel hanteras som idag (502, texten kvar i formuläret).

Verifiering före "klart": `npm test`, `npm run build` (aldrig samtidigt med dev
— OneDrive-regeln), dev-server-genomgång av alla sex nya routes, språkväxlaren
på varje sida i båda riktningar, `/en/news` med och utan `.en.mdx`-fil, samt
admin-publicering med och utan EN-sektion mot testbranch.

## Utanför scope

- Eget engelskt RSS-flöde
- Fler språk / i18n-ramverk
- Översättning av admin-gränssnittet (förblir svenskt — bara Rickard använder det)
- Ändringar i `feed.xml`, `robots.ts` eller nyhetsbrevsflödet
