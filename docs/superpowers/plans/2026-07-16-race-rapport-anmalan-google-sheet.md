# Race-rapport-anmälan till Google Sheet — Implementationsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Samla in namn + e-post från besökare som vill ha race-rapporten till ett Google Sheet, och mejla Rickard vid varje anmälan — så han kan skicka rapporten manuellt via BCC.

**Architecture:** Befintliga `NewsletterForm` + `/api/nyhetsbrev` byggs ut. Routen POST:ar varje giltig anmälan till en Google Apps Script-webhook (`SHEETS_WEBHOOK_URL`) som lägger till en rad i arket och skickar ett notismejl via Rickards eget Gmail (`MailApp`). Buttondown/Resend/logg behålls som fallback. Inga Google-credentials i sajten.

**Tech Stack:** Next.js 15 (App Router, route handlers), React 19 client component, TypeScript, Tailwind v4, Vitest (node-miljö), Google Apps Script (webhook, klistras in av Rickard).

## Global Constraints

- All UI-copy skrivs på svenska OCH engelska — `DICT.sv` och `DICT.en` måste ha identiska nycklar (annars bryts `Dictionary`-uniontypen).
- Miljövariabelns namn är exakt `SHEETS_WEBHOOK_URL`.
- Ingen service account, ingen `googleapis`, inga API-nycklar i sajten — bara webhook-URL:en.
- Behåll befintliga Buttondown → Resend → logg-grenar som fallback.
- Serverfel loggas med `console.error` (som befintlig kod). Den enda `console.log` som behålls är fallback-grenens info-logg när INGEN kanal är konfigurerad (kör bara lokalt utan env-nycklar; i produktion är `SHEETS_WEBHOOK_URL` satt) — bevarat befintligt beteende, inte ny debug-kod.
- Testmiljö: vitest `node`, testfiler `src/**/*.test.ts`, `@`-alias resolvas.
- **Commit-regel:** Rickards globala regel är att committa ENDAST när han uttryckligen ber om det. Commit-stegen nedan beskriver normal rytm men är gatade — utför `git commit` först på Rickards klartecken, jobba aldrig direkt på `main` (vi är på `nextjs-rebuild`).

## Filstruktur

- **Modify** `src/lib/dictionary.ts` — ny copy (namn-fält, samtycke, uppdaterad success-text) för SV + EN.
- **Modify** `src/app/api/nyhetsbrev/route.ts` — Sheets-webhook-gren, namn-validering, honeypot.
- **Create** `src/app/api/nyhetsbrev/route.test.ts` — enhetstester för routen.
- **Modify** `src/components/NewsletterForm.tsx` — namn-fält, honeypot, lang, samtyckesrad.
- **Create** `docs/anmalan-google-sheet-setup.md` — Apps Script + steg för Rickard.

---

### Task 1: Uppdatera dictionary-copy (SV + EN)

**Files:**
- Modify: `src/lib/dictionary.ts:31-39` (SV `newsletter`) och `:108-116` (EN `newsletter`)

**Interfaces:**
- Produces: `DICT[lang].newsletter` får nya nycklar `namePlaceholder: string`, `nameAriaLabel: string`, `consent: string`, och ändrad `success: string`. Konsumeras av `NewsletterForm` i Task 3.

- [ ] **Step 1: Ersätt SV `newsletter`-blocket**

I `src/lib/dictionary.ts`, ersätt det svenska `newsletter`-objektet (rad 31–39) med:

```ts
    newsletter: {
      placeholder: "din@epost.se",
      namePlaceholder: "Ditt namn",
      button: "Prenumerera",
      pending: "Skickar …",
      success:
        "Tack, du är anmäld! Race-rapporten kommer direkt i inkorgen under VM-veckan.",
      error: "Något gick fel. Prova igen, eller mejla",
      ariaLabel: "E-postadress för nyhetsbrevet",
      nameAriaLabel: "Ditt namn",
      consent:
        "Genom att anmäla dig sparar vi ditt namn och din e-post för att skicka rapporten. Avanmäl när som helst genom att mejla",
    },
```

- [ ] **Step 2: Ersätt EN `newsletter`-blocket**

Ersätt det engelska `newsletter`-objektet (rad 108–116) med:

```ts
    newsletter: {
      placeholder: "you@email.com",
      namePlaceholder: "Your name",
      button: "Subscribe",
      pending: "Sending …",
      success:
        "Thanks, you're signed up! The race report lands in your inbox during championship week.",
      error: "Something went wrong. Try again, or email",
      ariaLabel: "Email address for the newsletter",
      nameAriaLabel: "Your name",
      consent:
        "By signing up you let us store your name and email to send the report. Unsubscribe anytime by emailing",
    },
```

- [ ] **Step 3: Verifiera typcheck**

Run: `cd "C:/Users/Ricka/OneDrive/Skrivbord/javanainen-racecraft-main" && npx tsc --noEmit`
Expected: PASS, inga fel. (Bekräftar att SV/EN har samma nycklar och att `Dictionary`-uniontypen håller.)

- [ ] **Step 4: Commit** _(gatad — invänta Rickards klartecken)_

```bash
git add src/lib/dictionary.ts
git commit -m "content: uppdatera anmälnings-copy (namn + samtycke, ta bort dubbel opt-in-text)"
```

---

### Task 2: Bygg ut API-routen med Sheets-webhook, namn-validering och honeypot

**Files:**
- Modify: `src/app/api/nyhetsbrev/route.ts`
- Test: `src/app/api/nyhetsbrev/route.test.ts` (skapas)

**Interfaces:**
- Consumes: `process.env.SHEETS_WEBHOOK_URL` (webhook-URL), global `fetch`.
- Produces: `POST(request: Request): Promise<Response>`. Läser JSON `{ name, email, lang, company }`. Vid satt `SHEETS_WEBHOOK_URL` POST:ar den `{ timestamp, name, email, lang }` dit. Svarar `{ ok: true }` (200), `{ ok: false, error }` (400) vid ogiltig input, `{ ok: false }` (502) vid webhook-fel. Honeypot (`company` ifyllt) → `{ ok: true }` utan skrivning.

- [ ] **Step 1: Skriv de fallerande testerna**

Skapa `src/app/api/nyhetsbrev/route.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";

function req(body: unknown): Request {
  return new Request("http://localhost/api/nyhetsbrev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const OLD_ENV = process.env;

beforeEach(() => {
  process.env = { ...OLD_ENV, SHEETS_WEBHOOK_URL: "https://script.example/exec" };
});

afterEach(() => {
  process.env = OLD_ENV;
  vi.unstubAllGlobals();
});

describe("POST /api/nyhetsbrev", () => {
  test("giltig anmälan → POST till webhook med rätt payload", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(req({ name: "Anna", email: "anna@example.com", lang: "en" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("https://script.example/exec");
    const sent = JSON.parse((opts as RequestInit).body as string);
    expect(sent.name).toBe("Anna");
    expect(sent.email).toBe("anna@example.com");
    expect(sent.lang).toBe("en");
    expect(typeof sent.timestamp).toBe("string");
  });

  test("okänt språk normaliseras till sv", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await POST(req({ name: "Bo", email: "bo@example.com", lang: "xx" }));
    const sent = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.lang).toBe("sv");
  });

  test("ogiltig e-post → 400, ingen webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ name: "Anna", email: "trasig" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("tomt namn → 400, ingen webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ name: "   ", email: "anna@example.com" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("honeypot ifyllt → ok utan webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(
      req({ name: "Anna", email: "anna@example.com", company: "Spammer AB" }),
    );
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("webhook 500 → 502", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(req({ name: "Anna", email: "anna@example.com" }));
    expect(res.status).toBe(502);
  });
});
```

- [ ] **Step 2: Kör testerna och se dem faila**

Run: `cd "C:/Users/Ricka/OneDrive/Skrivbord/javanainen-racecraft-main" && npx vitest run src/app/api/nyhetsbrev/route.test.ts`
Expected: FAIL — routen läser ännu inte `name`/`company`/`lang` och saknar Sheets-grenen (t.ex. "tomt namn"-testet får inte 400, honeypot-testet anropar ändå ingen webhook men payloaden saknar `name`).

- [ ] **Step 3: Skriv om routen**

Ersätt hela `src/app/api/nyhetsbrev/route.ts` med:

```ts
import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  email?: unknown;
  name?: unknown;
  lang?: unknown;
  company?: unknown; // honeypot
};

/**
 * Anmälan till race-rapporten.
 * 1. SHEETS_WEBHOOK_URL satt → Apps Script lägger till rad i Google Sheet + mejlar Rickard.
 * 2. Annars BUTTONDOWN_API_KEY → prenumerant i Buttondown.
 * 3. Annars RESEND_API_KEY → adressen mejlas till Rickard.
 * 4. Annars → loggas på servern.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Ogiltig JSON" }, { status: 400 });
  }

  const { email, name, lang, company } = body;

  // Honeypot: en bot fyllde i det dolda fältet → låtsas lyckas, skriv inget.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Ogiltig e-postadress" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ ok: false, error: "Namn saknas" }, { status: 400 });
  }

  const cleanName = name.trim();
  const langValue = lang === "en" ? "en" : "sv";

  // 1. Google Sheet-webhook (Apps Script) — skriver rad + mejlar Rickard.
  const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
  if (sheetsUrl) {
    const res = await fetch(sheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: cleanName,
        email,
        lang: langValue,
      }),
    });
    if (!res.ok) {
      console.error("[nyhetsbrev] Sheets-webhook-fel:", res.status, await res.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  // 2. Buttondown
  const buttondownKey = process.env.BUTTONDOWN_API_KEY;
  if (buttondownKey) {
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${buttondownKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });
    // 400 = redan prenumerant — behandla som lyckat för användaren
    if (!res.ok && res.status !== 400) {
      console.error("[nyhetsbrev] Buttondown-fel:", res.status, await res.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  // 3. Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? `Rickard Javanainen <onboarding@resend.dev>`,
        to: [CONTACT_EMAIL],
        subject: "Ny nyhetsbrevsanmälan — rickardjavanainen.se",
        text: `Ny prenumerant: ${cleanName} <${email}>\n\nLägg till adressen manuellt i listan.`,
      }),
    });
    if (!res.ok) {
      console.error("[nyhetsbrev] Resend-fel:", res.status, await res.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  // 4. Ingen kanal konfigurerad → logga.
  console.log("[nyhetsbrev] Ny anmälan (ingen kanal konfigurerad):", cleanName, email);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Kör testerna och se dem passera**

Run: `cd "C:/Users/Ricka/OneDrive/Skrivbord/javanainen-racecraft-main" && npx vitest run src/app/api/nyhetsbrev/route.test.ts`
Expected: PASS — alla 6 testerna gröna.

- [ ] **Step 5: Commit** _(gatad — invänta Rickards klartecken)_

```bash
git add src/app/api/nyhetsbrev/route.ts src/app/api/nyhetsbrev/route.test.ts
git commit -m "feat(anmalan): skriv anmälan till Google Sheet-webhook med namn + honeypot"
```

---

### Task 3: Bygg ut NewsletterForm med namn-fält, honeypot och samtycke

**Files:**
- Modify: `src/components/NewsletterForm.tsx`

**Interfaces:**
- Consumes: `DICT[lang].newsletter.{namePlaceholder, nameAriaLabel, consent, success, ...}` (Task 1), `POST /api/nyhetsbrev` med `{ name, email, lang, company }` (Task 2), `CONTACT_EMAIL` från `@/lib/site`.

- [ ] **Step 1: Ersätt komponenten**

Ersätt hela `src/components/NewsletterForm.tsx` med:

```tsx
"use client";

import { useState } from "react";
import { DICT, type Lang } from "@/lib/dictionary";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = "idle" | "pending" | "success" | "error";

const INPUT_CLASS =
  "w-full min-w-0 border border-line bg-midnight-800 px-3 py-2.5 text-sm text-snow placeholder:text-mist-dim transition-colors duration-200 focus:border-flagblue-bright focus:outline-none";

export function NewsletterForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const t = DICT[lang].newsletter;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const company = data.get("company"); // honeypot
    setStatus("pending");
    try {
      const res = await fetch("/api/nyhetsbrev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, lang, company }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-sm leading-relaxed text-mist">{t.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        name="name"
        required
        placeholder={t.namePlaceholder}
        aria-label={t.nameAriaLabel}
        className={INPUT_CLASS}
      />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={t.placeholder}
          aria-label={t.ariaLabel}
          className={INPUT_CLASS}
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="btn btn-primary shrink-0 !px-4 !py-2.5 text-xs disabled:opacity-60"
        >
          {status === "pending" ? t.pending : t.button}
        </button>
      </div>

      {/* Honeypot — dolt för människor, lockar bots. Fylls det i skrivs inget. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <p className="text-xs leading-relaxed text-mist-dim">
        {t.consent}{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-flagblue-bright underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      {status === "error" && (
        <p className="text-sm text-mist" role="alert">
          {t.error}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-flagblue-bright underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Verifiera typcheck + produktionsbygge**

Run: `cd "C:/Users/Ricka/OneDrive/Skrivbord/javanainen-racecraft-main" && npx tsc --noEmit && npm run build`
Expected: PASS — inga typfel, bygget lyckas. (OBS enligt projektets OneDrive-regel: kör inte `next dev` och `next build` samtidigt.)

- [ ] **Step 3: Visuell rök-verifiering (valfritt men rekommenderat)**

Starta dev-servern och kontrollera att formuläret i footern nu visar namn-fält + samtyckesrad, och att honeypot-fältet inte syns. Följ projektets dev-loop (puppeteer i stället för browserpanelen enligt minnet). Skicka en testanmälan när `SHEETS_WEBHOOK_URL` pekar på ett testark och bekräfta att raden + notismejlet kommer.

- [ ] **Step 4: Commit** _(gatad — invänta Rickards klartecken)_

```bash
git add src/components/NewsletterForm.tsx
git commit -m "feat(anmalan): namn-fält, honeypot och samtyckesrad i NewsletterForm"
```

---

### Task 4: Skriv setup-dokument för Apps Script (Rickards engångssteg)

**Files:**
- Create: `docs/anmalan-google-sheet-setup.md`

**Interfaces:**
- Produces: dokumentation. Inget kodberoende, men beskriver hur `SHEETS_WEBHOOK_URL` skapas — utan den faller routen tillbaka på Buttondown/Resend/logg.

- [ ] **Step 1: Skapa dokumentet**

Skapa `docs/anmalan-google-sheet-setup.md`:

````markdown
# Anmälan till race-rapporten — Google Sheet-setup

Så kopplar du anmälningsformuläret till ditt Google Sheet. Görs en gång.

**Målark:** https://docs.google.com/spreadsheets/d/DITT_ARK_ID/edit

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
````

- [ ] **Step 2: Commit** _(gatad — invänta Rickards klartecken)_

```bash
git add docs/anmalan-google-sheet-setup.md
git commit -m "docs: setup-guide för Google Sheet-anmälan (Apps Script + Vercel)"
```

---

## Slutverifiering (efter alla tasks)

- [ ] `npx vitest run` — alla test gröna (inkl. de nya route-testerna).
- [ ] `npx tsc --noEmit` — inga typfel.
- [ ] `npm run build` — produktionsbygget lyckas.
- [ ] Manuell rök: med `SHEETS_WEBHOOK_URL` satt mot ett testark, skicka en anmälan → rad dyker upp i arket + notismejl kommer.
