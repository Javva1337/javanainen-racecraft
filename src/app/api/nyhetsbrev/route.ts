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
