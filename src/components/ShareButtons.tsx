"use client";

import { useState } from "react";
import { DICT, type Lang } from "@/lib/dictionary";

/** Dela-knappar: kopiera länk, LinkedIn, Facebook, X. */
export function ShareButtons({
  url,
  title,
  lang,
}: {
  url: string;
  title: string;
  lang: Lang;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const t = DICT[lang].article.share;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X",
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Klipp­bords-API blockerat — visa länken så den kan kopieras manuellt
      window.prompt(t.copy, url);
    }
  }

  const linkClass =
    "heading-caps border border-line px-3 py-2 text-[0.7rem] tracking-[0.12em] text-mist transition-all duration-200 hover:border-flagblue-bright hover:text-snow active:scale-[0.97]";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      <span className="heading-caps mr-2 text-xs tracking-[0.14em] text-mist-dim">
        {t.heading}
      </span>
      <button type="button" onClick={handleCopy} className={linkClass}>
        {isCopied ? t.copied : t.copy}
      </button>
      {targets.map((target) => (
        <a
          key={target.name}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {target.name}
        </a>
      ))}
    </div>
  );
}
