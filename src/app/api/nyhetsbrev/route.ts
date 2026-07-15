import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Nyhetsbrevsanmälan.
 * 1. BUTTONDOWN_API_KEY satt → prenumerant skapas i Buttondown (dubbel opt-in
 *    sköts av Buttondown).
 * 2. Annars RESEND_API_KEY satt → adressen mejlas till Rickard.
 * 3. Annars → adressen loggas på servern.
 */
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return NextResponse.json({ ok: false, error: "Ogiltig JSON" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Ogiltig e-postadress" }, { status: 400 });
  }

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
        text: `Ny prenumerant: ${email}\n\nLägg till adressen manuellt i nyhetsbrevslistan.`,
      }),
    });
    if (!res.ok) {
      console.error("[nyhetsbrev] Resend-fel:", res.status, await res.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  console.log("[nyhetsbrev] Ny anmälan (ingen e-postnyckel konfigurerad):", email);
  return NextResponse.json({ ok: true });
}
