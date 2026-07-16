# Anmälan till race-rapporten — Google Sheet-setup

Så kopplar du anmälningsformuläret till ditt Google Sheet. Görs en gång.

**Målark:** https://docs.google.com/spreadsheets/d/1tg5jsPaNnWCp0jcNZxh4Cv0nU9fX3cS6UYqwySvIu2k/edit

## 1. Klistra in Apps Script

I arket: **Tillägg → Apps Script**. Radera allt och klistra in (byt `NOTIFY_TO`
mot adressen du vill få notisen till):

```javascript
var NOTIFY_TO = "rickard@rickardjavanainen.se"; // dit notisen skickas

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Tidsstämpel", "Namn", "E-post", "Språk"]);
    }
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.lang || "",
    ]);

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

Spara.

## 2. Publicera som webbapp

**Deploy → New deployment → Web app.** Välj:
- **Execute as:** Me
- **Who has access:** Anyone

Godkänn behörighetsdialogen (skriva till arket + skicka mejl som du) — det räcker
en gång. Kopiera **webbapp-URL:en** (slutar på `/exec`).

## 3. Lägg URL:en i Vercel

I Vercel-projektet `rickardjavanainen-se` → Settings → Environment Variables:
- **Name:** `SHEETS_WEBHOOK_URL`
- **Value:** den kopierade `/exec`-URL:en

Redeploy. (Lokalt: lägg samma rad i `.env.local` för att testa mot arket.)

## Så skickar du rapporten

Öppna arket, markera **E-post**-kolumnen, kopiera, klistra in i BCC i din mail.
Skriv rapporten och skicka. Du får ett notismejl varje gång någon anmäler sig.

## Kvot

`MailApp` skickar max 100 mejl/dygn (vanligt Gmail) / 1500 (Workspace) — gott och
väl för notiser.
