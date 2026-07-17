"use client";

import { useState } from "react";
import { DICT, type Lang } from "@/lib/dictionary";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = "idle" | "pending" | "success" | "error";

/**
 * Kontaktformulär. Skickar via /api/kontakt (Resend). Om servern saknar
 * e-postnyckel (503) faller formuläret tillbaka på en mailto-länk med
 * ifyllt innehåll. All copy kommer ur dictionaryn (sv + en).
 */
export function ContactForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const t = DICT[lang].contactForm;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    setStatus("pending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.status === 503) {
        // Ingen e-postnyckel på servern — öppna mejlklienten i stället
        const subject = encodeURIComponent(t.mailtoSubject(name));
        const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="border border-line bg-midnight-800 p-6 text-mist" role="status">
        {t.success}
      </p>
    );
  }

  const fieldClass =
    "w-full border border-line bg-midnight-800 px-4 py-3 text-sm text-snow placeholder:text-mist-dim transition-colors duration-200 focus:border-flagblue-bright focus:outline-none";
  const labelClass = "heading-caps mb-1.5 block text-xs tracking-[0.12em] text-mist";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {t.name}
        </label>
        <input
          id="contact-name"
          name="name"
          required
          maxLength={200}
          placeholder={t.namePlaceholder}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          {t.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder={t.emailPlaceholder}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder={t.messagePlaceholder}
          className={fieldClass}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-mist" role="alert">
          {t.error}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-flagblue-bright underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      )}
      <button type="submit" disabled={status === "pending"} className="btn btn-primary disabled:opacity-60">
        {status === "pending" ? t.pending : t.send}
      </button>
    </form>
  );
}
