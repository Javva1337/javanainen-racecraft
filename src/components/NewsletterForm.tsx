"use client";

import { useState } from "react";
import { DICT, type Lang } from "@/lib/dictionary";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = "idle" | "pending" | "success" | "error";

export function NewsletterForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const t = DICT[lang].newsletter;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("pending");
    try {
      const res = await fetch("/api/nyhetsbrev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={t.placeholder}
          aria-label={t.ariaLabel}
          className="min-w-0 flex-1 border border-line bg-midnight-800 px-3 py-2.5 text-sm text-snow placeholder:text-mist-dim transition-colors duration-200 focus:border-flagblue-bright focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="btn btn-primary shrink-0 !px-4 !py-2.5 text-xs disabled:opacity-60"
        >
          {status === "pending" ? t.pending : t.button}
        </button>
      </div>
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
