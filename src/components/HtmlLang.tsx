"use client";

import { useEffect } from "react";

/** Sätter <html lang> för de engelska sidorna (en rot-layout kan inte ha två html-taggar). */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "sv";
    };
  }, [lang]);
  return null;
}
