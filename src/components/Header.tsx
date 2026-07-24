"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { altLangPath, DICT, type Lang } from "@/lib/dictionary";
import type { SiteMode } from "@/lib/mode";
import { HeaderCta } from "./HeaderCta";

type Props = {
  lang: Lang;
  /** SSR-läget från layouten — HeaderCta håller det färskt på klienten */
  mode: SiteMode;
};

export function Header({ lang, mode }: Props) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = DICT[lang].nav;
  const otherLang: Lang = lang === "sv" ? "en" : "sv";
  const switchHref = altLangPath(pathname ?? "/", otherLang);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stäng mobilmenyn vid navigering
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" || href === "/en"
      ? pathname === href
      : (pathname ?? "").startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        isScrolled || isMenuOpen
          ? "border-b border-line bg-midnight/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={lang === "sv" ? "/" : "/en"}
          className="heading-caps text-sm font-bold tracking-[0.18em] text-snow"
        >
          Rickard Javanainen
        </Link>

        <nav aria-label={lang === "sv" ? "Huvudmeny" : "Main navigation"} className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-6">
            {t.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`heading-caps relative py-2 text-xs tracking-[0.12em] transition-colors duration-200 ${
                    isActive(item.href) ? "text-snow" : "text-mist hover:text-snow"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-flagblue" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <HeaderCta lang={lang} initialMode={mode} variant="bar" />
          <Link
            href={switchHref}
            className="heading-caps text-xs tracking-[0.14em] text-mist transition-colors duration-200 hover:text-snow"
            aria-label={t.switchTo}
          >
            <span className={lang === "sv" ? "text-snow" : ""}>SV</span>
            <span className="mx-1 text-mist-dim">/</span>
            <span className={lang === "en" ? "text-snow" : ""}>EN</span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-snow transition-transform duration-150 active:scale-95 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
              {isMenuOpen ? (
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobilmeny */}
      {isMenuOpen && (
        <nav
          aria-label={lang === "sv" ? "Mobilmeny" : "Mobile navigation"}
          className="border-t border-line bg-midnight/95 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto max-w-6xl px-4 pt-4 sm:hidden sm:px-6">
            <HeaderCta lang={lang} initialMode={mode} variant="menu" />
          </div>
          <ul className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {t.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`heading-caps block py-3 text-sm tracking-[0.12em] transition-colors duration-200 ${
                    isActive(item.href) ? "text-snow" : "text-mist"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
