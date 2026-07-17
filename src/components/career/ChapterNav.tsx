"use client";

import { useEffect, useRef, useState } from "react";
import type { ChapterDef } from "@/lib/career-story";
import type { Lang } from "@/lib/dictionary";
import { useLenis, useScrollToChapter } from "./CareerStoryProvider";

const COPY = {
  sv: {
    progression: "Kapitelprogression",
    chapterAria: (num: string, title: string) => `Kapitel ${num}: ${title}`,
    button: "Kapitel",
    choose: "Välj kapitel",
    close: "Stäng",
  },
  en: {
    progression: "Chapter progression",
    chapterAria: (num: string, title: string) => `Chapter ${num}: ${title}`,
    button: "Chapters",
    choose: "Choose a chapter",
    close: "Close",
  },
} as const;

/**
 * Navigationslagret för berättelsen:
 *  - tunn progressionsrail i högerkanten med en nod per kapitel (aria-current)
 *  - "Kapitel"-knapp i nedre vänstra hörnet som öppnar kapitelmenyn
 *  - kapitelmeny som overlay ("Välj kapitel") med fokusfälla och Escape
 * Allt är progressiv förbättring — innehållet nås alltid via vanlig scroll.
 */
export function ChapterNav({ chapters, lang }: { chapters: ChapterDef[]; lang: Lang }) {
  const t = COPY[lang];
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const railFillRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /** true medan ett kapitelhopp pågår — fokus ska då INTE återgå till knappen */
  const isNavigatingRef = useRef(false);
  const lenis = useLenis();
  const scrollToChapter = useScrollToChapter();

  // Aktivt kapitel: sektionen som korsar mittzonen av viewporten
  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  // Progressionslinjen: fyllnad = hur långt ner på sidan man är
  useEffect(() => {
    let ticking = false;
    // scrollHeight läses inte varje frame (forcerad layout under scrubben) —
    // cachas och mäts om högst en gång per sekund eller vid överskjutning
    let cachedMax = 0;
    let lastMeasure = 0;
    const update = () => {
      ticking = false;
      const fill = railFillRef.current;
      if (!fill) return;
      const now = performance.now();
      if (cachedMax <= 0 || now - lastMeasure > 1000 || window.scrollY > cachedMax) {
        cachedMax = document.documentElement.scrollHeight - window.innerHeight;
        lastMeasure = now;
      }
      const progress = cachedMax > 0 ? Math.min(1, window.scrollY / cachedMax) : 0;
      fill.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Menyn: scroll-lås + Escape + fokusfälla
  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusables = dialog?.querySelectorAll<HTMLElement>("a[href], button");
    // Fokus efter nästa frame — dialogen är visibility:hidden tills klassbytet målats
    const focusFrame = requestAnimationFrame(() => {
      (dialog?.querySelector<HTMLElement>("[aria-current='true']") ?? focusables?.[0])?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lenis?.start();
      // Vid kapitelhopp ska fokus landa på målsektionen, inte på knappen
      if (!isNavigatingRef.current) toggleRef.current?.focus();
    };
  }, [isOpen, lenis]);

  const goTo = (id: string) => {
    isNavigatingRef.current = true;
    setIsOpen(false);
    // Släpp Lenis direkt (idempotent — cleanupen gör det också): rAF:en kan
    // annars hinna före Reacts effekt-cleanup, och lenis.scrollTo är no-op
    // medan instansen är stoppad → hoppet skulle utebli
    lenis?.start();
    requestAnimationFrame(() => {
      scrollToChapter(id);
      isNavigatingRef.current = false;
    });
  };

  return (
    <>
      {/* Rail — tunn progressionslinje med kapitelnoder */}
      <nav
        aria-label={t.progression}
        className="fixed right-2 top-1/2 z-40 -translate-y-1/2 sm:right-5"
      >
        <div className="relative flex flex-col items-center gap-3 py-2">
          <div className="absolute bottom-2 top-2 w-px bg-line" aria-hidden="true" />
          <div
            ref={railFillRef}
            className="absolute bottom-2 top-2 w-px origin-top bg-flagblue-bright"
            style={{ transform: "scaleY(0)" }}
            aria-hidden="true"
          />
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeId;
            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                aria-current={isActive ? "true" : undefined}
                aria-label={
                  chapter.num
                    ? t.chapterAria(chapter.num, chapter.title[lang])
                    : chapter.title[lang]
                }
                onClick={(event) => {
                  event.preventDefault();
                  goTo(chapter.id);
                }}
                className="group relative flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-[transform,background-color] duration-200 ${
                    isActive
                      ? "h-2.5 w-2.5 scale-100 bg-flagyellow"
                      : "h-1.5 w-1.5 bg-mist-dim group-hover:bg-snow"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className="heading-caps pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 whitespace-nowrap bg-midnight-800 px-2 py-1 text-[0.6rem] tracking-[0.14em] text-snow opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                  aria-hidden="true"
                >
                  {chapter.num ? `${chapter.num} · ${chapter.title[lang]}` : chapter.title[lang]}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Kapitel-knappen — nedre vänstra hörnet (ljudknappen bor nere till höger) */}
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="heading-caps fixed bottom-4 left-4 z-40 flex items-center gap-2 border border-line bg-midnight/80 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-snow backdrop-blur-sm transition-[border-color,transform] duration-150 hover:border-flagblue-bright active:scale-[0.97] sm:bottom-6 sm:left-6"
      >
        <span className="flex flex-col gap-[3px]" aria-hidden="true">
          <span className="block h-px w-4 bg-flagyellow" />
          <span className="block h-px w-4 bg-snow" />
          <span className="block h-px w-4 bg-snow" />
        </span>
        {t.button}
      </button>

      {/* Kapitelmenyn — helskärmsoverlay */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.choose}
        className={`fixed inset-0 z-[60] flex flex-col bg-midnight/95 backdrop-blur-md ${
          isOpen
            ? "visible opacity-100 [transition:opacity_200ms]"
            : "invisible opacity-0 [transition:opacity_200ms,visibility_0s_200ms]"
        }`}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-5 sm:px-8">
          <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">{t.choose}</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="heading-caps border border-line px-3 py-2 text-xs tracking-[0.12em] text-snow transition-colors duration-150 hover:border-flagblue-bright"
          >
            {t.close}
          </button>
        </div>
        <ol className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-4 py-6 sm:px-8">
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeId;
            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(chapter.id);
                  }}
                  className={`group flex items-baseline gap-4 border-b border-line/60 py-3 transition-colors duration-150 sm:gap-6 sm:py-4 ${
                    isActive ? "text-flagyellow" : "text-snow hover:text-flagyellow"
                  }`}
                >
                  <span
                    className="heading-caps tabular w-10 shrink-0 text-sm font-bold text-mist-dim group-hover:text-mist"
                    aria-hidden="true"
                  >
                    {chapter.num ?? "—"}
                  </span>
                  <span className="heading-caps text-2xl font-extrabold leading-none sm:text-4xl">
                    {chapter.title[lang]}
                  </span>
                  {chapter.years && (
                    <span className="tabular ml-auto shrink-0 text-xs text-mist-dim sm:text-sm">
                      {chapter.years}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
