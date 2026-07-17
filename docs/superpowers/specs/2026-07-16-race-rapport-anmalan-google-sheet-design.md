# Design: Samla in mailadresser för race-rapporten till Google Sheet

**Datum:** 2026-07-16
**Branch:** nextjs-rebuild
**Status:** Godkänd design, redo för implementationsplan

## Mål

Samla in e-postadresser (+ namn) från besökare som vill ha race-rapporten under
VM-veckan, på ett smidigt sätt, så att Rickard kan skicka rapporten **manuellt
från sin egen mail** (BCC) — inte via Resend/Buttondown/automatiskt utskick.

Adresserna ska landa i ett Google Sheet som Rickard äger, så att han kan öppna
arket, kopiera e-postkolumnen och klistra in i BCC.

**Målark:** https://docs.google.com/spreadsheets/d/DITT_ARK_ID/edit
(ark-ID `DITT_ARK_ID`)

## Beslut

| Fråga | Val |
| --- | --- |
| Var landar adresserna? | Google Sheet (ovan) |
| Fält som samlas in | Namn + e-post (+ språk auto-fångat, dolt) |
| Skrivmekanism | Google Apps Script-webhook (ingen service account/OAuth i sajten) |
| Notis vid anmälan | Apps Script skickar mejl till Rickard via eget Gmail (`MailApp`) |
| Utskick av rapport | Manuellt av Rickard, utanför sajten |
| Spamskydd | Honeypot-fält (ingen CAPTCHA) |

## Vald arkitektur: Apps Script-webhook

Rickard skapar ett skript bundet till målarket (Tillägg → Apps Script),
publicerar det som "webbapp" och får en URL. Sajten POST:ar varje anmälan till
den URL:en; skriptet lägger till en rad i arket.

Fördelar: inga Google-credentials, service accounts eller `googleapis`-beroende i
sajten — bara en hemlig URL i miljövariabeln `SHEETS_WEBHOOK_URL`. Skriptet är
bundet till just detta ark, så inget ark-ID behöver hårdkodas i sajten.

**Förkastade alternativ:**
- **Google Sheets API + service account** — robustare men kräver nyckelfil, delat
  ark med robotkonto och extra beroende. Overkill för en person.
- **Behåll Buttondown/Resend** — motsäger målet om manuellt utskick.

## Dataflöde

```
Besökare fyller i namn + e-post i NewsletterForm
  → POST /api/nyhetsbrev  { name, email, lang, company (honeypot) }
    → routen validerar (e-post giltig, namn icke-tomt) + honeypot-koll
      → POST SHEETS_WEBHOOK_URL { timestamp, name, email, lang }
        → Apps Script gör sheet.appendRow([...])
        → Apps Script MailApp.sendEmail(...) → notis till Rickards egen mail
          → ny rad i Google Sheet + notismejl i inkorgen
  → { ok: true } → formuläret visar success
```

## Kodändringar

### 1. `src/components/NewsletterForm.tsx`
- Lägg till **namn-fält** (required) ovanför e-post.
- Lägg till dolt **honeypot-fält** (t.ex. `company`), visuellt gömt + `tabIndex={-1}`
  + `autoComplete="off"` + `aria-hidden`. Fylls det i → bot.
- Skicka med **`lang`** (komponenten känner redan sitt språk via `lang`-propen) —
  dolt, ingen extra friktion för besökaren.
- Payload: `{ name, email, lang, company }`.

### 2. `src/app/api/nyhetsbrev/route.ts`
- Ny **första gren**: om `SHEETS_WEBHOOK_URL` är satt → POST dit och returnera.
- Validering serverside: `email` matchar `EMAIL_RE`, `name` är icke-tom sträng
  (trimmad). Ogiltigt → 400.
- **Honeypot:** om `company` är ifyllt → returnera `{ ok: true }` utan att skriva
  (tyst för boten).
- Behåll befintliga grenar (Buttondown → Resend → logg) som fallback så inget
  slutar fungera om webhooken saknas.
- Webhook-fel (icke-2xx) → logga + 502.

### 3. `src/lib/dictionary.ts`
- Uppdatera `newsletter`-copy för **både SV och EN**:
  - Ta bort omnämnandet av "dubbel opt-in / bekräftelsemejl" (stämmer inte längre).
  - Ny `success`-text, t.ex. SV: "Tack, du är anmäld! Rapporten kommer under
    VM-veckan." EN: "Thanks, you're signed up! The report lands during
    championship week."
  - Lägg till `namePlaceholder` + `nameAriaLabel` (SV/EN).
  - Ev. finstilt samtyckesrad `consent` (SV/EN): kort text om att adressen sparas
    för att skicka rapporten och att man avanmäler genom att mejla Rickard.

### 4. Finstilt samtycke under formuläret
- Rendera `consent`-texten (liten, dämpad) under formuläret med en mailto-länk
  till `CONTACT_EMAIL` för avanmälan. Lätt GDPR-täckning; själva anmälan =
  samtycke.

## Apps Script som Rickard klistrar in (i specen för referens)

I målarket: **Tillägg → Apps Script**, ersätt allt med (byt `NOTIFY_TO` mot den
adress du vill få notisen till):

```javascript
var NOTIFY_TO = "rickard@rickardjavanainen.se"; // dit notisen skickas

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    // Skapa rubrikrad om arket är tomt
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Tidsstämpel", "Namn", "E-post", "Språk"]);
    }
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.lang || "",
    ]);

    // Notis till Rickards egen mail (skickas från det Google-konto som äger arket)
    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: "Ny anmälan till race-rapporten: " + (data.name || data.email),
      body:
        "Ny person vill ha race-rapporten:\n\n" +
        "Namn: " + (data.name || "") + "\n" +
        "E-post: " + (data.email || "") + "\n" +
        "Språk: " + (data.lang || "") + "\n\n" +
        "Adressen finns nu i arket.",
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Publicera: **Deploy → New deployment → Web app**, "Execute as: Me", "Who has
access: Anyone". Kopiera webbapp-URL:en. Första gången kör Google en
behörighetsdialog (skriptet vill både skriva till arket och skicka mejl som du) —
godkänn den.

**Notis-mejlets kvot:** `MailApp` har en daglig gräns (100 mejl/dygn för vanligt
Gmail, 1500 för Workspace) — gott och väl för anmälningsnotiser.

## Manuella steg för Rickard (en gång)

1. Öppna målarket → Tillägg → Apps Script → klistra in skriptet ovan → sätt
   `NOTIFY_TO` till din egen mail → spara.
2. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone) →
   godkänn behörighetsdialogen (skriva ark + skicka mejl) → kopiera URL.
3. I Vercel-projektet `rickardjavanainen-se`: lägg till miljövariabel
   `SHEETS_WEBHOOK_URL` = den kopierade URL:en. Redeploy.
4. (Lokalt: samma variabel i `.env.local` för att testa mot arket.)

## Felhantering

- Ogiltig JSON / e-post / tomt namn → 400 med felmeddelande.
- Honeypot ifyllt → 200 `{ ok: true }` utan skrivning.
- Webhook svarar icke-2xx → logga serverside + 502; formuläret visar sitt
  felmeddelande med mailto-fallback (finns redan).

## Test

Enhetstest för `/api/nyhetsbrev` (vitest, mönster som `content.test.ts`), med
`fetch` och `process.env.SHEETS_WEBHOOK_URL` mockade:
- Giltig anmälan → POST till webhook med rätt payload, svar `{ ok: true }`.
- Ogiltig e-post → 400, ingen webhook-anrop.
- Tomt namn → 400.
- Honeypot ifyllt → `{ ok: true }`, ingen webhook-anrop.
- Webhook 500 → route svarar 502.

## Utanför scope (YAGNI)

- Dubbel opt-in / bekräftelsemejl (manuellt utskick behöver det inte).
- Adminsida / CSV-export (arket ÄR gränssnittet).
- Avanmälningsflöde i appen (sker via mejl).
- Automatiskt utskick av rapporten (görs manuellt från Rickards mail).
