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
