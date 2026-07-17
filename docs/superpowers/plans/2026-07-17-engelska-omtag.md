# Engelska omtaget — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bygg ut engelska delen av sajten med sex saknade sidor och gör nyheterna tvåspråkiga (inkl. valfria EN-fält i admin-publiceringen och översättning av de tre befintliga artiklarna).

**Architecture:** Spegelmönstret — varje ny `/en`-sida är en egen fil med samma komponenter som den svenska motsvarigheten och engelsk copy inline. Nyheternas `.en.mdx`-konvention finns redan i `lib/content.ts`; admin-flödet utökas så att en valfri engelsk parallellfil commitas atomiskt i samma GitHub-commit.

**Tech Stack:** Next.js 15 (App Router, RSC), Tailwind 4, MDX via next-mdx-remote, Vitest 3, GitHub Git Data API.

**Spec:** `docs/superpowers/specs/2026-07-17-engelska-omtag-design.md`

## Global Constraints

- **OneDrive-regeln:** kör ALDRIG `npm run dev` och `npm run build` samtidigt.
- **Test:** `npm test` (= `vitest run`). **Build:** `npm run build`.
- **Gren:** allt arbete sker på `feat/engelska-omtag` (skapas från `feat/admin-publicering` i Task 1). Aldrig på `main`.
- **Commits:** conventional commits på svenska (`feat:`, `fix:`, `content:`, `test:`). INGA `Co-Authored-By`-rader (attribution avstängd globalt).
- **Kategorinycklar:** frontmatter-kategorier förblir de svenska nycklarna `"VM 2026" | "SRKC" | "Satsningen" | "Partners"` — även i `.en.mdx`-filer. Endast visningen översätts.
- **Ton i engelsk copy:** ödmjuk, fritt formulerad engelska — aldrig skrytig. Partners-copy får inte lova mätbar exponering.
- **Admin-UI:** förblir på svenska. Endast innehållsfälten för engelsk version tillkommer.
- **hreflang-konvention:** `x-default` pekar alltid på den svenska sökvägen (befintligt mönster).
- Filerna i `src/app/en/**` importerar `.en`-fälten ur redan tvåspråkiga datakällor (`lib/results.ts`, `lib/media.ts`, `lib/site.ts`) — hårdkoda aldrig om siffror/fakta.

---

### Task 1: Dictionary-grund — `categoryLabel` + `contactForm`-sektion (TDD)

**Files:**
- Modify: `src/lib/dictionary.ts`
- Test: `src/lib/dictionary.test.ts`

**Interfaces:**
- Consumes: `Category`-typen från `src/lib/content.ts` (type-only import — ofarlig cirkularitet, `content.ts` importerar redan `type Lang` härifrån).
- Produces: `categoryLabel(category: string, lang: Lang): string` samt `DICT.sv.contactForm` / `DICT.en.contactForm` med nycklarna `name`, `namePlaceholder`, `email`, `emailPlaceholder`, `message`, `messagePlaceholder`, `send`, `pending`, `success`, `error`, `mailtoSubject(name: string)`. Task 2 använder `categoryLabel`; Task 3 använder `contactForm`.

- [ ] **Step 1: Skapa grenen**

```bash
git checkout feat/admin-publicering
git checkout -b feat/engelska-omtag
```

- [ ] **Step 2: Skriv failande test**

Lägg till i `src/lib/dictionary.test.ts` (ändra import-raden + nytt describe-block sist i filen):

```ts
import { altLangPath, categoryLabel, DICT } from "./dictionary";

describe("categoryLabel", () => {
  test("svenska returnerar nyckeln oförändrad", () => {
    expect(categoryLabel("VM 2026", "sv")).toBe("VM 2026");
    expect(categoryLabel("Satsningen", "sv")).toBe("Satsningen");
  });

  test("engelska översätter visningsnamnen", () => {
    expect(categoryLabel("VM 2026", "en")).toBe("Worlds 2026");
    expect(categoryLabel("Satsningen", "en")).toBe("The campaign");
    expect(categoryLabel("SRKC", "en")).toBe("SRKC");
    expect(categoryLabel("Partners", "en")).toBe("Partners");
  });

  test("okänd kategori faller tillbaka på nyckeln", () => {
    expect(categoryLabel("Okänd", "en")).toBe("Okänd");
  });
});

describe("contactForm-copy", () => {
  test("båda språken har alla nycklar", () => {
    for (const lang of ["sv", "en"] as const) {
      const t = DICT[lang].contactForm;
      expect(t.name).toBeTruthy();
      expect(t.send).toBeTruthy();
      expect(t.success).toBeTruthy();
      expect(t.mailtoSubject("Anna")).toContain("Anna");
    }
  });
});
```

- [ ] **Step 3: Kör testet — ska faila**

Kör: `npm test -- src/lib/dictionary.test.ts`
Förväntat: FAIL — `categoryLabel` exporteras inte / `contactForm` saknas.

- [ ] **Step 4: Implementera i `src/lib/dictionary.ts`**

Överst i filen (efter `export type Lang`-raden):

```ts
import type { Category } from "./content";

/** Kategorinycklarna i frontmatter är svenska — bara visningen översätts. */
const CATEGORY_LABELS_EN: Record<Category, string> = {
  "VM 2026": "Worlds 2026",
  SRKC: "SRKC",
  Satsningen: "The campaign",
  Partners: "Partners",
};

export function categoryLabel(category: string, lang: Lang): string {
  if (lang === "sv") return category;
  return CATEGORY_LABELS_EN[category as Category] ?? category;
}
```

I `DICT.sv`, efter `newsletter`-objektet, lägg till:

```ts
    contactForm: {
      name: "Namn",
      namePlaceholder: "Ditt namn",
      email: "E-post",
      emailPlaceholder: "din@epost.se",
      message: "Meddelande",
      messagePlaceholder: "Ditt meddelande...",
      send: "Skicka",
      pending: "Skickar …",
      success: "Tack för ditt meddelande! Jag återkommer så snart jag kan.",
      error: "Något gick fel. Prova igen, eller mejla",
      mailtoSubject: (name: string) => `Kontakt från ${name}`,
    },
```

I `DICT.en`, efter `newsletter`-objektet, lägg till:

```ts
    contactForm: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      message: "Message",
      messagePlaceholder: "Your message...",
      send: "Send",
      pending: "Sending …",
      success: "Thanks for your message! I'll get back to you as soon as I can.",
      error: "Something went wrong. Try again, or email",
      mailtoSubject: (name: string) => `Contact from ${name}`,
    },
```

- [ ] **Step 5: Kör testet — ska passera**

Kör: `npm test -- src/lib/dictionary.test.ts`
Förväntat: PASS (alla, även befintliga altLangPath-test).

- [ ] **Step 6: Commit**

```bash
git add src/lib/dictionary.ts src/lib/dictionary.test.ts
git commit -m "feat(i18n): categoryLabel + contactForm-copy i dictionaryn"
```

---

### Task 2: Kategorivisning på engelska

**Files:**
- Modify: `src/components/ArticleCard.tsx`
- Modify: `src/components/ArticleView.tsx`
- Modify: `src/app/en/news/page.tsx`

**Interfaces:**
- Consumes: `categoryLabel(category, lang)` från Task 1.
- Produces: inget nytt API — `/en/news` och engelska artikelsidor visar "Worlds 2026"/"The campaign" i stället för råa svenska nycklar. Filterlänkarnas `?category=`-värden förblir de svenska nycklarna.

- [ ] **Step 1: ArticleCard**

I `src/components/ArticleCard.tsx`, byt importraden:

```ts
import { categoryLabel, DICT, type Lang } from "@/lib/dictionary";
```

och byt `{frontmatter.category}` (i kategori-chippen) mot:

```tsx
          {categoryLabel(frontmatter.category, lang)}
```

- [ ] **Step 2: ArticleView**

I `src/components/ArticleView.tsx`, byt importraden:

```ts
import { categoryLabel, DICT, type Lang } from "@/lib/dictionary";
```

och byt `{frontmatter.category}` (i kategori-chippen i headern) mot:

```tsx
            {categoryLabel(frontmatter.category, lang)}
```

- [ ] **Step 3: Filterknapparna på /en/news**

I `src/app/en/news/page.tsx`, byt importraden:

```ts
import { categoryLabel, DICT } from "@/lib/dictionary";
```

och i filternavet, byt `{cat}` (länktexten inuti `CATEGORIES.map`) mot:

```tsx
            {categoryLabel(cat, "en")}
```

- [ ] **Step 4: Verifiera med test + build**

Kör: `npm test`
Förväntat: PASS.
Kör: `npm run build`
Förväntat: bygget lyckas utan typfel.

- [ ] **Step 5: Commit**

```bash
git add src/components/ArticleCard.tsx src/components/ArticleView.tsx "src/app/en/news/page.tsx"
git commit -m "feat(i18n): oversatta kategorinamn pa engelska nyhetssidor"
```

---

### Task 3: ContactForm får `lang`-prop

**Files:**
- Modify: `src/components/ContactForm.tsx`
- Modify: `src/app/(sv)/kontakt/page.tsx`

**Interfaces:**
- Consumes: `DICT[lang].contactForm` från Task 1.
- Produces: `<ContactForm lang={Lang} />` — Task 8 (`/en/contact`) renderar den med `lang="en"`.

- [ ] **Step 1: Skriv om ContactForm**

Ersätt hela `src/components/ContactForm.tsx` med:

```tsx
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
```

- [ ] **Step 2: Svenska kontaktsidan skickar lang**

I `src/app/(sv)/kontakt/page.tsx`, byt `<ContactForm />` mot:

```tsx
        <ContactForm lang="sv" />
```

- [ ] **Step 3: Verifiera**

Kör: `npm test` → PASS. Kör: `npm run build` → lyckas (typfel här hade avslöjat missad prop).

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactForm.tsx "src/app/(sv)/kontakt/page.tsx"
git commit -m "feat(i18n): ContactForm tar lang-prop med copy ur dictionaryn"
```

---

### Task 4: `/en/career`

**Files:**
- Create: `src/app/en/career/page.tsx`
- Create: `src/app/en/career/opengraph-image.tsx`
- Modify: `src/app/(sv)/karriar/page.tsx` (endast metadata)

**Interfaces:**
- Consumes: `RESULTS`, `STATS`, `TIMELINE` (`.en`-fält) från `src/lib/results.ts`; `DICT.en.common.soundOn/soundOff`; komponenterna `CountUp`, `KurbitsDivider`, `NationBadge`, `Reveal`, `Timeline`, `VideoBackdrop`.
- Produces: route `/en/career`. Task 10 länkar hit från menyn och `altLangPath`.

- [ ] **Step 1: Skapa `src/app/en/career/page.tsx`**

```tsx
import type { Metadata } from "next";
import { CountUp } from "@/components/CountUp";
import { KurbitsDivider } from "@/components/Kurbits";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { VideoBackdrop } from "@/components/VideoBackdrop";
import { DICT } from "@/lib/dictionary";
import { RESULTS, STATS, TIMELINE } from "@/lib/results";

export const metadata: Metadata = {
  title: "Career — results and timeline 2002–2026",
  description:
    "Rickard Javanainen's career in numbers: Worlds bronze in 2016 (3rd of 102), two SRKC titles, and the road from karting in Dalarna to the rental kart World Championship in Vandel 2026.",
  alternates: {
    canonical: "/en/career",
    languages: { "sv-SE": "/karriar", en: "/en/career", "x-default": "/karriar" },
  },
  openGraph: { locale: "en_US" },
};

export default function EnglishCareerPage() {
  return (
    <>
      {/* Hero: prispallsceremonin som video-loop, samma mönster som svenska sidan */}
      <section className="relative flex min-h-[64svh] items-end overflow-hidden">
        <VideoBackdrop
          video="/videos/karriar-podium.mp4"
          poster="/images/karriar-poster.jpg"
          imageAlt="Podium ceremony — Rickard Javanainen in the middle of the podium"
          soundOnLabel={DICT.en.common.soundOn}
          soundOffLabel={DICT.en.common.soundOff}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/20"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-36 sm:px-6">
          <NationBadge className="mb-4" />
          <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl lg:text-6xl">
            Career
          </h1>
          <p className="mt-3 max-w-2xl text-mist sm:text-lg">
            From karting in Dalarna in 2002 to the rental kart Worlds in Vandel 2026. The whole
            road, with the numbers to back it up.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Javanainen in numbers */}
      <section className="mb-20" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Javanainen in numbers
        </h2>
        <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label.en} className="flex flex-col gap-2 bg-midnight-800 p-6">
              <CountUp
                value={stat.value}
                suffix={"suffix" in stat ? stat.suffix.en : ""}
                className="heading-caps text-4xl font-bold text-flagyellow sm:text-5xl"
              />
              <span className="text-xs leading-snug text-mist-dim">{stat.label.en}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-mist-dim">
          Inducted into the{" "}
          <a
            href="https://srkc.nu/results/hall-of-fame/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-flagblue-bright underline underline-offset-2"
          >
            SRKC Hall of Fame
          </a>
          , so far as the only driver.
        </p>
      </section>

      {/* Results table — canonical values from lib/results.ts */}
      <section className="mb-20" aria-labelledby="results-heading">
        <h2 id="results-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Results
        </h2>
        <div className="overflow-x-auto border border-line">
          <table className="tabular w-full min-w-[640px] text-sm">
            <caption className="sr-only">
              Race results for R. Javanainen (SWE), 2015–2026
            </caption>
            <thead>
              <tr className="bg-midnight-800 text-left">
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Event
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Location
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Year
                </th>
                <th scope="col" className="heading-caps px-4 py-3 text-xs tracking-[0.12em] text-mist-dim">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((row) => (
                <tr
                  key={`${row.competition}-${row.year}`}
                  className="border-t border-line transition-colors duration-150 hover:bg-midnight-800"
                >
                  <td className="px-4 py-3 text-snow">{row.competition}</td>
                  <td className="px-4 py-3 text-mist">{row.place.en}</td>
                  <td className="px-4 py-3 text-mist">{row.year}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      {row.podium && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-flagyellow"
                          title="Podium"
                          aria-label="Podium"
                        />
                      )}
                      <span className={row.podium ? "font-semibold text-snow" : "text-mist"}>
                        {row.result.en}
                      </span>
                      {row.note && <span className="text-xs text-mist-dim">— {row.note.en}</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-mist-dim">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-flagyellow" aria-hidden="true" />
          Podium · Official KWC results are available from the{" "}
          <a
            href="https://kartworldchampionship.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-flagblue-bright underline underline-offset-2"
          >
            organiser
          </a>
        </p>
      </section>

      <KurbitsDivider className="mb-20" />

      {/* Timeline — same numbers as the table (lib/results.ts) */}
      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="heading-caps mb-10 text-2xl font-bold text-snow">
          The timeline 2002–2026
        </h2>
        <Reveal>
          <Timeline entries={TIMELINE} lang="en" />
        </Reveal>
      </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Skapa `src/app/en/career/opengraph-image.tsx`**

```tsx
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Career — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Career",
    subtitle: "Worlds bronze 2016 · 5 Worlds starts · 2 SRKC titles · the timeline 2002–2026",
  });
}
```

- [ ] **Step 3: hreflang på svenska sidan**

I `src/app/(sv)/karriar/page.tsx`, byt:

```ts
  alternates: { canonical: "/karriar" },
```

mot:

```ts
  alternates: {
    canonical: "/karriar",
    languages: { "sv-SE": "/karriar", en: "/en/career", "x-default": "/karriar" },
  },
```

- [ ] **Step 4: Verifiera**

Kör: `npm run build`
Förväntat: lyckas, `/en/career` listas bland genererade routes.

- [ ] **Step 5: Commit**

```bash
git add src/app/en/career "src/app/(sv)/karriar/page.tsx"
git commit -m "feat(en): karriarsidan pa engelska (/en/career)"
```

---

### Task 5: `/en/about`

**Files:**
- Create: `src/app/en/about/page.tsx`
- Create: `src/app/en/about/opengraph-image.tsx`
- Modify: `src/app/(sv)/om/page.tsx` (endast metadata)

**Interfaces:**
- Consumes: `KurbitsDivider`, `NationBadge`, `Reveal`; `next/image`.
- Produces: route `/en/about`. Task 10 länkar hit.

- [ ] **Step 1: Skapa `src/app/en/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { KurbitsDivider } from "@/components/Kurbits";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Rickard — from Dalarna to the world stage",
  description:
    "The story in chapters: karting in Dalarna at the age of ten, racing school in Mjölby, circuit racing in Ginetta, a Worlds bronze in rental karting and the comeback aiming for Vandel 2026.",
  alternates: {
    canonical: "/en/about",
    languages: { "sv-SE": "/om", en: "/en/about", "x-default": "/om" },
  },
  openGraph: { locale: "en_US" },
};

/** Samma kapitelstruktur som svenska /om — copy fritt formulerad på engelska. */
const CHAPTERS = [
  {
    label: "Dalarna",
    title: "The ten-year-old and the go-kart",
    text: [
      "I grew up in Dalarna. In 2002, ten years old, I took my first step into motorsport: karting. The years that followed went through several karting classes, with a number of wins and podiums along the way.",
    ],
  },
  {
    label: "Mjölby",
    title: "Racing school",
    text: [
      "The racing school in Mjölby came next. In 2007 I finished 2nd overall in the Renault Junior Cup, and from 2008 to 2010 I raced in the JTCC (Junior Touring Car Championship) with several podiums.",
      "It was also during these years that rental karting took over for real. What started as practice between race weekends turned out to be racing in its purest form.",
    ],
  },
  {
    label: "Circuit racing",
    title: "Ginetta — the stand-in who won",
    text: [
      "In 2011 I got a mid-season drive in the Ginetta G20 Cup. The result: wins in 2 of 6 races and 8th overall of 22 drivers, having raced only half the season.",
    ],
  },
  {
    label: "Rental karting",
    title: "The purest form of racing",
    text: [
      "In rental karting the equipment is equalised and the karts are drawn by lot. No budget in the world makes you faster — only the driver counts. In 2015 I won the inaugural SRKC in Linköping, and the same year came my Worlds debut in Italy: 11th of 127 individually, a semifinal podium, and a place in the final. In the Nations Cup I drove a stint from last to first before the team finished fifth overall.",
      "2016 in Italy: a win in the final and 3rd place overall — a Worlds bronze. 2017 in Spain: 12th of 172, the biggest field to date. In 2018 I won the SRKC in Gothenburg after a close final against Max Sjölander, and at the Worlds in Poland that year I went from 16th to 9th in the final race, 14th of 131 overall.",
    ],
  },
  {
    label: "The comeback",
    title: "Back for real",
    text: [
      "After the Worlds in Poland 2018, life took over in the best possible way: our first son was born in 2020, and his little brother arrived in 2024. In between, the pandemic put a stop to most of the racing, so it took a few years before I was properly back. But the itch never went away.",
      "In 2021 I finished 6th overall in the SRKC final, second-best Swede, and in 2026 I was the 3rd-best Swede. The SRKC, the qualifier for the rental kart Worlds, has inducted me into its Hall of Fame, so far as the only driver. A fine receipt for the years gone by. Now I feel ready to pick up the dream of the world title again, and what counts is the form in Denmark.",
    ],
  },
  {
    label: "Vandel",
    title: "Worlds 2026",
    text: [
      "Next up is the rental kart World Championship at Vandel Kart in Denmark, 22 July–1 August 2026. I race both the KWC Individual championship and the Nations Cup for Sweden, and I report here on the site every evening.",
    ],
  },
];

export default function EnglishAboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">
          About Rickard
        </h1>
        <p className="mt-3 max-w-2xl text-mist">
          From Dalarna to the world stage. The story in six chapters.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr]">
        {/* Pokalbilden */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              <Image
                src="/images/portrait.jpg"
                alt="Rickard Javanainen with a trophy"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </Reveal>
        </div>

        {/* Kapitlen */}
        <div className="space-y-12">
          {CHAPTERS.map((chapter, index) => (
            <Reveal key={chapter.label}>
              <section aria-labelledby={`chapter-${index + 1}`}>
                <p className="heading-caps tabular mb-1 text-xs tracking-[0.16em] text-flagblue-bright">
                  Chapter {String(index + 1).padStart(2, "0")} — {chapter.label}
                </p>
                <h2 id={`chapter-${index + 1}`} className="heading-caps mb-3 text-2xl text-snow">
                  {chapter.title}
                </h2>
                {chapter.text.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mb-3 leading-relaxed text-mist">
                    {paragraph}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}

          <KurbitsDivider />

          {/* Citat som avslutning */}
          <Reveal>
            <blockquote className="border-l-2 border-flagyellow pl-6">
              <p className="heading-caps text-xl leading-relaxed text-snow sm:text-2xl">
                "With the same equipment for everyone, there is nowhere to hide. It's the driver
                that counts — every heat, all week."
              </p>
              <cite className="mt-3 block text-sm not-italic text-mist-dim">
                Rickard Javanainen
              </cite>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Skapa `src/app/en/about/opengraph-image.tsx`**

```tsx
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About Rickard — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "About Rickard",
    subtitle: "From Dalarna to the world stage — the story in six chapters",
  });
}
```

- [ ] **Step 3: hreflang på svenska sidan**

I `src/app/(sv)/om/page.tsx`, byt:

```ts
  alternates: { canonical: "/om" },
```

mot:

```ts
  alternates: {
    canonical: "/om",
    languages: { "sv-SE": "/om", en: "/en/about", "x-default": "/om" },
  },
```

- [ ] **Step 4: Verifiera**

Kör: `npm run build` → lyckas, `/en/about` listas.

- [ ] **Step 5: Commit**

```bash
git add src/app/en/about "src/app/(sv)/om/page.tsx"
git commit -m "feat(en): om-sidan pa engelska (/en/about)"
```

---

### Task 6: `/en/partners`

**Files:**
- Create: `src/app/en/partners/page.tsx`
- Create: `src/app/en/partners/opengraph-image.tsx`
- Modify: `src/app/(sv)/partners/page.tsx` (endast metadata)

**Interfaces:**
- Consumes: `PARTNERS` från `src/lib/site.ts`; `KurbitsDivider`, `Reveal`.
- Produces: route `/en/partners` med CTA-länk till `/en/contact` (byggs i Task 8 — länken är död tills dess, OK inom grenen).

- [ ] **Step 1: Skapa `src/app/en/partners/page.tsx`**

OBS tonregeln: ingen copy som lovar mätbar exponering.

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KurbitsDivider } from "@/components/Kurbits";
import { Reveal } from "@/components/Reveal";
import { PARTNERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners — join the road to the Worlds",
  description:
    "Primab and Labatus make the Worlds campaign possible. Exposure on the race suit, digital channels, the roof box and helmet livery.",
  alternates: {
    canonical: "/en/partners",
    languages: { "sv-SE": "/partners", en: "/en/partners", "x-default": "/partners" },
  },
  openGraph: { locale: "en_US" },
};

const PARTNER_INTROS: Record<string, string> = {
  Primab:
    "Primab has been a partner through every year of this campaign, from the first Worlds seasons to the comeback. Support we are very grateful for.",
  Labatus:
    "Labatus is a new partner this year, on board all the way to the 2026 Worlds. Thank you for the trust.",
};

const PACKAGES = [
  {
    title: "Race suit",
    text: "Your logo on the race suit, visible in every photo and every TV frame, from the paddock to the podium.",
  },
  {
    title: "Digital channels",
    text: "Exposure on the site, in the newsletter and on social channels throughout the campaign.",
  },
  {
    title: "Roof box",
    text: "The roof box on the car that takes us to and from the races. Rolling exposure across Europe.",
  },
  {
    title: "Helmet livery",
    text: "For those who want to go all in, there is the option of a custom helmet livery — the most personal surface in motorsport.",
  },
];

export default function EnglishPartnersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Partners</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Partnerships built on visibility, credibility and shared value.
        </p>
      </header>

      {/* Current partners */}
      <section className="mb-20" aria-labelledby="partners-heading">
        <h2 id="partners-heading" className="sr-only">
          Current partners
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PARTNERS.map((partner, index) => (
            <Reveal key={partner.name} delayMs={index * 60}>
              <div className="flex h-full flex-col border border-line bg-midnight-800 p-8">
                <div
                  className={`mb-6 inline-flex w-fit items-center rounded-sm px-5 py-3 ${
                    partner.chip === "light" ? "bg-snow" : "border border-line"
                  }`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={150}
                    height={44}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <p className="mb-6 text-sm leading-relaxed text-mist">
                  {PARTNER_INTROS[partner.name]}
                </p>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="heading-caps mt-auto text-xs tracking-[0.14em] text-flagblue-bright transition-colors duration-200 hover:text-snow"
                >
                  {partner.url.replace("https://", "")} →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <KurbitsDivider className="mb-20" />

      {/* Exposure */}
      <section className="mb-20" aria-labelledby="packages-heading">
        <h2 id="packages-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Exposure
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PACKAGES.map((pkg, index) => (
            <Reveal key={pkg.title} delayMs={index * 50}>
              <div className="h-full border border-line bg-midnight-800 p-6">
                <h3 className="heading-caps mb-2 text-lg text-snow">{pkg.title}</h3>
                <p className="text-sm leading-relaxed text-mist">{pkg.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border border-line bg-midnight-800 p-10 text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="heading-caps mb-3 text-2xl font-bold text-snow">
          Want to be seen here?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-mist">
          Join the campaign alongside Primab and Labatus. Your logo, your brand, visible at every
          race and in every channel.
        </p>
        <Link href="/en/contact" className="btn btn-primary">
          Become a partner
        </Link>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Skapa `src/app/en/partners/opengraph-image.tsx`**

```tsx
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Partners — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Partners",
    subtitle: "Primab and Labatus make the Worlds campaign possible",
  });
}
```

- [ ] **Step 3: hreflang på svenska sidan**

I `src/app/(sv)/partners/page.tsx`, byt:

```ts
  alternates: { canonical: "/partners" },
```

mot:

```ts
  alternates: {
    canonical: "/partners",
    languages: { "sv-SE": "/partners", en: "/en/partners", "x-default": "/partners" },
  },
```

- [ ] **Step 4: Verifiera**

Kör: `npm run build` → lyckas, `/en/partners` listas.

- [ ] **Step 5: Commit**

```bash
git add src/app/en/partners "src/app/(sv)/partners/page.tsx"
git commit -m "feat(en): partnersidan pa engelska (/en/partners)"
```

---

### Task 7: `/en/media`

**Files:**
- Create: `src/app/en/media/page.tsx`
- Create: `src/app/en/media/opengraph-image.tsx`
- Modify: `src/app/(sv)/media/page.tsx` (endast metadata)

**Interfaces:**
- Consumes: `MEDIA_ITEMS` från `src/lib/media.ts` — `alt.en`/`caption.en` finns redan (verifierade plats/år-uppgifter, ändra ALDRIG innehållet).
- Produces: route `/en/media`.

- [ ] **Step 1: Skapa `src/app/en/media/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { MEDIA_ITEMS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Media — images from the track",
  description:
    "Images from the SRKC and the rental kart Worlds: action, podiums and preparation. Original press images are on the press page.",
  alternates: {
    canonical: "/en/media",
    languages: { "sv-SE": "/media", en: "/en/media", "x-default": "/media" },
  },
  openGraph: { locale: "en_US" },
};

export default function EnglishMediaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Media</h1>
        <p className="mt-3 max-w-2xl text-mist">
          From the track, the paddock and the podium. High-resolution press images are on the{" "}
          <a href="/en/press" className="text-flagblue-bright underline underline-offset-4">
            press page
          </a>
          .
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {MEDIA_ITEMS.map((item, index) => (
          <Reveal key={item.src} delayMs={Math.min(index * 50, 250)} className={item.span ?? ""}>
            <figure className="group relative aspect-square h-full w-full overflow-hidden border border-line">
              <Image
                src={item.src}
                alt={item.alt.en}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 to-transparent px-3 pb-2 pt-8 text-xs text-snow">
                {item.caption.en}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Skapa `src/app/en/media/opengraph-image.tsx`**

```tsx
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Media — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Media",
    subtitle: "Images from the track, the paddock and the podium",
  });
}
```

- [ ] **Step 3: hreflang på svenska sidan**

I `src/app/(sv)/media/page.tsx`, byt:

```ts
  alternates: { canonical: "/media" },
```

mot:

```ts
  alternates: {
    canonical: "/media",
    languages: { "sv-SE": "/media", en: "/en/media", "x-default": "/media" },
  },
```

- [ ] **Step 4: Verifiera**

Kör: `npm run build` → lyckas, `/en/media` listas.

- [ ] **Step 5: Commit**

```bash
git add src/app/en/media "src/app/(sv)/media/page.tsx"
git commit -m "feat(en): mediasidan pa engelska (/en/media)"
```

---

### Task 8: `/en/contact`

**Files:**
- Create: `src/app/en/contact/page.tsx`
- Create: `src/app/en/contact/opengraph-image.tsx`
- Modify: `src/app/(sv)/kontakt/page.tsx` (endast metadata)

**Interfaces:**
- Consumes: `<ContactForm lang="en" />` från Task 3; `CONTACT_EMAIL` från `src/lib/site.ts`.
- Produces: route `/en/contact` (CTA-målet från `/en/partners`).

- [ ] **Step 1: Skapa `src/app/en/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Rickard Javanainen about partnerships, press or questions about the 2026 rental kart World Championship. Email: rickard@rickardjavanainen.se",
  alternates: {
    canonical: "/en/contact",
    languages: { "sv-SE": "/kontakt", en: "/en/contact", "x-default": "/kontakt" },
  },
  openGraph: { locale: "en_US" },
};

export default function EnglishContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Contact</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Partnerships, press or anything else? Get in touch — I answer personally.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
        <ContactForm lang="en" />
        <aside>
          <p className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Email</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-lg text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-6 text-sm leading-relaxed text-mist">
            Press material (original images, bio and fact sheet) is available on the{" "}
            <a href="/en/press" className="text-flagblue-bright underline underline-offset-4">
              press page
            </a>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Skapa `src/app/en/contact/opengraph-image.tsx`**

```tsx
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Contact",
    subtitle: "Partnerships, press or anything else — I answer personally",
  });
}
```

- [ ] **Step 3: hreflang på svenska sidan**

I `src/app/(sv)/kontakt/page.tsx`, byt:

```ts
  alternates: { canonical: "/kontakt" },
```

mot:

```ts
  alternates: {
    canonical: "/kontakt",
    languages: { "sv-SE": "/kontakt", en: "/en/contact", "x-default": "/kontakt" },
  },
```

- [ ] **Step 4: Verifiera**

Kör: `npm run build` → lyckas, `/en/contact` listas.

- [ ] **Step 5: Commit**

```bash
git add src/app/en/contact "src/app/(sv)/kontakt/page.tsx"
git commit -m "feat(en): kontaktsidan pa engelska (/en/contact)"
```

---

### Task 9: `lib/press.ts` + `/en/press` + Footer-pressänken

**Files:**
- Create: `src/lib/press.ts`
- Create: `src/app/en/press/page.tsx`
- Create: `src/app/en/press/opengraph-image.tsx`
- Modify: `src/app/(sv)/press/page.tsx` (importera ur lib/press + metadata)
- Modify: `src/components/Footer.tsx` (språkriktig pressänk)

**Interfaces:**
- Consumes: `CONTACT_EMAIL`, `KWC`, `SITE_URL` från `src/lib/site.ts`.
- Produces: `src/lib/press.ts` exporterar `PRESS_IMAGES: { src: string; label: { sv: string; en: string }; filename: string }[]` samt `BIO_SHORT_SV`, `BIO_LONG_SV`, `BIO_SHORT_EN`, `BIO_LONG_EN` (strängar). Route `/en/press`.

- [ ] **Step 1: Skapa `src/lib/press.ts`**

Bio-texterna flyttas OFÖRÄNDRADE från `src/app/(sv)/press/page.tsx` (klipp ut dem därifrån i Step 2 — texterna nedan är exakt samma):

```ts
/**
 * Kanoniskt pressmaterial — delas av /press och /en/press så att
 * bios och bildlista aldrig glider isär mellan språken.
 */

export type PressImage = {
  src: string;
  label: { sv: string; en: string };
  filename: string;
};

export const PRESS_IMAGES: PressImage[] = [
  {
    src: "/press/rickard-javanainen-regnrace.jpg",
    label: { sv: "Regnrace (liggande)", en: "Rain race (landscape)" },
    filename: "rickard-javanainen-regnrace.jpg",
  },
  {
    src: "/press/rickard-javanainen-portratt.jpg",
    label: { sv: "Porträtt med pokal (stående)", en: "Portrait with trophy (portrait)" },
    filename: "rickard-javanainen-portratt.jpg",
  },
  {
    src: "/press/rickard-javanainen-podium.jpg",
    label: { sv: "Podium", en: "Podium" },
    filename: "rickard-javanainen-podium.jpg",
  },
];

export const BIO_SHORT_SV =
  "Rickard Javanainen är en svensk hyrkartförare från Dalarna med VM-brons 2016 som främsta merit. Han tävlar för Sverige i Kart World Championship 2026 på Vandel Kart i Danmark, 22 juli–1 augusti, både individuellt och i Nations Cup.";

export const BIO_LONG_SV =
  "Rickard Javanainen (född 1992) började köra gokart i Dalarna 2002, tio år gammal. Efter Racinggymnasiet i Mjölby, en andraplats totalt i Renault Junior Cup 2007, JTCC 2008–2010 och två segrar av sex möjliga som inhoppare i Ginetta G20 Cup 2011, tog hyrkarten över. 2015 vann han första upplagan av SRKC i Linköping och gjorde VM-debut i Italien med en 11:e plats av 127, och körde i Nations Cup en stint från sist till först innan laget gick i mål som femma totalt. 2016 vann han VM-finalen i Italien och tog brons totalt (3:e av 102). Ytterligare VM-finaler följde 2017 i Spanien (12:e av 172) och 2018 i Polen (14:e av 131, från 16:e till 9:e i finalracet), samt en andra SRKC-titel i Göteborg 2018. Efter en comeback med en 6:e plats totalt i SRKC 2021 (näst bästa svensk) och 3:e bästa svensk 2026 tävlar han nu i den 20:e upplagan av Kart World Championship på Vandel Kart i Danmark, 22 juli–1 augusti 2026, med 180 förare, i både KWC Individual och Nations Cup för Sverige, lagtävlingen han kört i samtliga sina VM. Satsningen möjliggörs av Primab, partner sedan starten, och Labatus, ny partner för 2026.";

export const BIO_SHORT_EN =
  "Rickard Javanainen is a Swedish rental kart racer from Dalarna whose top achievement is a World Championship bronze in 2016. He races for Sweden at the 2026 Kart World Championship at Vandel Kart, Denmark, 22 July–1 August, both individually and in the Nations Cup.";

export const BIO_LONG_EN =
  "Rickard Javanainen started karting in Dalarna, Sweden, in 2002 at the age of ten. After racing school in Mjölby, a runner-up season in the 2007 Renault Junior Cup, JTCC 2008–2010 and two wins from six races as a mid-season stand-in in the 2011 Ginetta G20 Cup, rental karting took over. In 2015 he won the inaugural SRKC in Linköping and made his Worlds debut in Italy, finishing 11th of 127, and in the Nations Cup drove a stint from last to first before the team finished fifth overall. In 2016 he won the World Championship final in Italy, taking bronze overall (3rd of 102). Further Worlds finals followed in Spain 2017 (12th of 172) and Poland 2018 (14th of 131, climbing from 16th to 9th in the final race), plus a second SRKC title in Gothenburg 2018. After a comeback with 6th overall in the 2021 SRKC (second-best Swede) and 3rd-best Swede in 2026, he now races the 20th edition of the Kart World Championship at Vandel Kart, Denmark, 22 July–1 August 2026, against a field of 180 drivers, in both the KWC Individual championship and the Nations Cup for Sweden, a team event he has raced at every Worlds he has entered. The campaign is made possible by Primab, a partner since the start, and Labatus, new for 2026.";
```

- [ ] **Step 2: Refaktorera svenska `src/app/(sv)/press/page.tsx`**

1. Ta bort de lokala konstanterna `PRESS_IMAGES`, `BIO_SHORT_SV`, `BIO_LONG_SV`, `BIO_SHORT_EN`, `BIO_LONG_EN`.
2. Lägg till importen:

```ts
import { BIO_LONG_EN, BIO_LONG_SV, BIO_SHORT_EN, BIO_SHORT_SV, PRESS_IMAGES } from "@/lib/press";
```

3. I bildlistan, byt `alt={image.label}` mot `alt={image.label.sv}` och `<span className="text-xs text-mist">{image.label}</span>` mot `<span className="text-xs text-mist">{image.label.sv}</span>`.
4. Byt metadata-alternates:

```ts
  alternates: {
    canonical: "/press",
    languages: { "sv-SE": "/press", en: "/en/press", "x-default": "/press" },
  },
```

Allt annat (rubriker, FACTS, layout) lämnas orört.

- [ ] **Step 3: Skapa `src/app/en/press/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { BIO_LONG_EN, BIO_LONG_SV, BIO_SHORT_EN, BIO_SHORT_SV, PRESS_IMAGES } from "@/lib/press";
import { CONTACT_EMAIL, KWC, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Press — images, bio and fact sheet",
  description:
    "Press material for Rickard Javanainen: downloadable high-resolution images, short and long bios in English and Swedish, and a fact sheet for the 2026 Kart World Championship.",
  alternates: {
    canonical: "/en/press",
    languages: { "sv-SE": "/press", en: "/en/press", "x-default": "/press" },
  },
  openGraph: { locale: "en_US" },
};

const FACTS = [
  ["Name", "Rickard Javanainen"],
  ["Nationality", "Swedish (SWE)"],
  ["Grew up in", "Dalarna"],
  ["Best Worlds result", "3rd of 102 (Italy 2016, won the final)"],
  ["Worlds starts", "5 (2015, 2016, 2017, 2018, 2026)"],
  ["SRKC titles", "2 (Linköping 2015, Gothenburg 2018)"],
  ["Next event", `Kart World Championship 2026 · ${KWC.venue}, Denmark · ${KWC.datesLabel.en}`],
  ["Competing in", "KWC Individual + Nations Cup (Sweden)"],
  ["Partners", "Primab (since the start of the campaign), Labatus (new for 2026)"],
  ["Contact", CONTACT_EMAIL],
  ["Web", SITE_URL.replace("https://", "")],
];

export default function EnglishPressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Press</h1>
        <p className="mt-3 max-w-2xl text-mist">
          Original images, bios in English and Swedish, and a fact sheet. The material may be used
          freely in editorial contexts, with photo credit where stated. Questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-flagblue-bright underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      </header>

      {/* Press images */}
      <section className="mb-16" aria-labelledby="images-heading">
        <h2 id="images-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Press images
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRESS_IMAGES.map((image) => (
            <figure key={image.src} className="border border-line bg-midnight-800">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.label.en}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="text-xs text-mist">{image.label.en}</span>
                <a
                  href={image.src}
                  download={image.filename}
                  className="heading-caps shrink-0 text-[0.65rem] tracking-[0.12em] text-flagblue-bright transition-colors duration-200 hover:text-snow"
                >
                  Download ↓
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Bio */}
      <section className="mb-16 grid gap-10 lg:grid-cols-2" aria-labelledby="bio-heading">
        <div>
          <h2 id="bio-heading" className="heading-caps mb-4 text-2xl font-bold text-snow">
            Bio — English
          </h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Short</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_EN}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Long</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_EN}</p>
        </div>
        <div>
          <h2 className="heading-caps mb-4 text-2xl font-bold text-snow">Bio — Swedish</h2>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Short</h3>
          <p className="mb-6 text-sm leading-relaxed text-mist">{BIO_SHORT_SV}</p>
          <h3 className="heading-caps mb-2 text-xs tracking-[0.14em] text-mist-dim">Long</h3>
          <p className="text-sm leading-relaxed text-mist">{BIO_LONG_SV}</p>
        </div>
      </section>

      {/* Fact sheet */}
      <section aria-labelledby="facts-heading">
        <h2 id="facts-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Fact sheet
        </h2>
        <dl className="divide-y divide-line border border-line">
          {FACTS.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 bg-midnight-800 px-5 py-3 sm:flex-row sm:gap-8">
              <dt className="heading-caps w-44 shrink-0 text-xs tracking-[0.12em] text-mist-dim sm:pt-0.5">
                {label}
              </dt>
              <dd className="tabular text-sm text-snow">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Skapa `src/app/en/press/opengraph-image.tsx`**

```tsx
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Press — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Press",
    subtitle: "Downloadable images, bio in English and Swedish, and a fact sheet",
  });
}
```

- [ ] **Step 5: Footer-pressänken blir språkriktig**

I `src/components/Footer.tsx`, byt (i nav-listan):

```tsx
                <Link
                  href="/press"
```

mot:

```tsx
                <Link
                  href={lang === "sv" ? "/press" : "/en/press"}
```

- [ ] **Step 6: Verifiera**

Kör: `npm test` → PASS. Kör: `npm run build` → lyckas, `/en/press` listas, `/press` byggs fortfarande.

- [ ] **Step 7: Commit**

```bash
git add src/lib/press.ts src/app/en/press "src/app/(sv)/press/page.tsx" src/components/Footer.tsx
git commit -m "feat(en): pressida pa engelska (/en/press) + delat pressmaterial i lib/press"
```

---

### Task 10: EN-menyn + `altLangPath`-tabellen (TDD)

**Files:**
- Modify: `src/lib/dictionary.ts`
- Test: `src/lib/dictionary.test.ts`

**Interfaces:**
- Consumes: routes från Task 4–9 (alla `/en/*`-sidor finns nu — menyn får inga döda länkar).
- Produces: `DICT.en.nav.items` med 8 poster; `altLangPath()` mappar alla statiska sidor åt båda håll. Header/Footer konsumerar automatiskt.

- [ ] **Step 1: Skriv failande test**

Ersätt hela `describe("altLangPath", …)` i `src/lib/dictionary.test.ts` med:

```ts
describe("altLangPath", () => {
  test("sv → en, alla statiska sidor", () => {
    expect(altLangPath("/", "en")).toBe("/en");
    expect(altLangPath("/vm-2026", "en")).toBe("/en/vm-2026");
    expect(altLangPath("/nyheter", "en")).toBe("/en/news");
    expect(altLangPath("/karriar", "en")).toBe("/en/career");
    expect(altLangPath("/om", "en")).toBe("/en/about");
    expect(altLangPath("/partners", "en")).toBe("/en/partners");
    expect(altLangPath("/media", "en")).toBe("/en/media");
    expect(altLangPath("/kontakt", "en")).toBe("/en/contact");
    expect(altLangPath("/press", "en")).toBe("/en/press");
    expect(altLangPath("/nyheter/vm-dag-3", "en")).toBe("/en/news/vm-dag-3");
  });

  test("en → sv, alla statiska sidor", () => {
    expect(altLangPath("/en", "sv")).toBe("/");
    expect(altLangPath("/en/vm-2026", "sv")).toBe("/vm-2026");
    expect(altLangPath("/en/news", "sv")).toBe("/nyheter");
    expect(altLangPath("/en/career", "sv")).toBe("/karriar");
    expect(altLangPath("/en/about", "sv")).toBe("/om");
    expect(altLangPath("/en/partners", "sv")).toBe("/partners");
    expect(altLangPath("/en/media", "sv")).toBe("/media");
    expect(altLangPath("/en/contact", "sv")).toBe("/kontakt");
    expect(altLangPath("/en/press", "sv")).toBe("/press");
    expect(altLangPath("/en/news/vm-dag-3", "sv")).toBe("/nyheter/vm-dag-3");
  });

  test("okänd sökväg faller tillbaka på respektive startsida", () => {
    expect(altLangPath("/admin", "en")).toBe("/en");
    expect(altLangPath("/en/okand", "sv")).toBe("/");
  });
});
```

- [ ] **Step 2: Kör testet — ska faila**

Kör: `npm test -- src/lib/dictionary.test.ts`
Förväntat: FAIL — `/karriar` ger `/en` i stället för `/en/career`.

- [ ] **Step 3: Implementera**

I `src/lib/dictionary.ts`, ersätt hela `altLangPath`-funktionen med:

```ts
/** Statiska sidpar (sv ↔ en). Artikelsidor hanteras med regex nedan. */
const PATH_MAP: ReadonlyArray<readonly [string, string]> = [
  ["/", "/en"],
  ["/vm-2026", "/en/vm-2026"],
  ["/nyheter", "/en/news"],
  ["/karriar", "/en/career"],
  ["/om", "/en/about"],
  ["/partners", "/en/partners"],
  ["/media", "/en/media"],
  ["/kontakt", "/en/contact"],
  ["/press", "/en/press"],
];

/** Motsvarande sida på det andra språket (för språkväxlaren + hreflang). */
export function altLangPath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (target === "en") {
    const pair = PATH_MAP.find(([sv]) => sv === clean);
    if (pair) return pair[1];
    const article = clean.match(/^\/nyheter\/([^/]+)$/);
    if (article) return `/en/news/${article[1]}`;
    return "/en";
  }
  const pair = PATH_MAP.find(([, en]) => en === clean);
  if (pair) return pair[0];
  const article = clean.match(/^\/en\/news\/([^/]+)$/);
  if (article) return `/nyheter/${article[1]}`;
  return "/";
}
```

Ersätt sedan `DICT.en.nav.items` med:

```ts
      items: [
        { href: "/en", label: "Home" },
        { href: "/en/vm-2026", label: "Worlds 2026" },
        { href: "/en/news", label: "News" },
        { href: "/en/career", label: "Career" },
        { href: "/en/about", label: "About" },
        { href: "/en/partners", label: "Partners" },
        { href: "/en/media", label: "Media" },
        { href: "/en/contact", label: "Contact" },
      ],
```

- [ ] **Step 4: Kör testerna — ska passera**

Kör: `npm test`
Förväntat: PASS (alla filer).

- [ ] **Step 5: Commit**

```bash
git add src/lib/dictionary.ts src/lib/dictionary.test.ts
git commit -m "feat(i18n): full engelsk meny + altLangPath-tabell for alla sidor"
```

---

### Task 11: Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: routes från Task 4–9.
- Produces: sitemap med samtliga engelska sidor.

- [ ] **Step 1: Lägg till EN-routerna**

I `src/app/sitemap.ts`, byt static-listan mot:

```ts
  const staticPages = [
    "",
    "/vm-2026",
    "/nyheter",
    "/karriar",
    "/om",
    "/partners",
    "/media",
    "/kontakt",
    "/press",
    "/en",
    "/en/vm-2026",
    "/en/news",
    "/en/career",
    "/en/about",
    "/en/partners",
    "/en/media",
    "/en/contact",
    "/en/press",
  ].map((route) => ({
```

- [ ] **Step 2: Verifiera**

Kör: `npm run build` → lyckas.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): engelska sidorna i sitemap"
```

---

### Task 12: Översätt de tre artiklarna + engelsk rapportmall

**Files:**
- Create: `content/nyheter/sa-funkar-hyrkart-vm.en.mdx`
- Create: `content/nyheter/sveriges-lag-i-nations-cup.en.mdx`
- Create: `content/nyheter/vagen-till-vandel.en.mdx`
- Create: `content/_mall-vm-rapport.en.mdx`

**Interfaces:**
- Consumes: `.en.mdx`-konventionen i `lib/content.ts` (befintlig — inga kodändringar).
- Produces: `/en/news` visar tre riktiga översättningar utan fallback-notis. Frontmatter: `category` behåller svenska nyckeln, `date` identiskt med originalet.

- [ ] **Step 1: Skapa `content/nyheter/sa-funkar-hyrkart-vm.en.mdx`**

```mdx
---
title: "How the rental kart Worlds works — the format explained"
description: "8 qualifying heats, one semifinal, 18 finalists and up to 10 races in one week. This is how the Kart World Championship is decided, and why the most consistent driver wins — not the one with the fastest equipment."
date: 2026-07-16
category: "VM 2026"
---

On 22 July, the 20th edition of the **Kart World Championship** starts at Vandel Kart in Denmark, just outside Billund. 180 drivers from all over the world make it one of the biggest international championships in rental karting. I race both the individual championship and the Nations Cup for Sweden. Since the format differs quite a bit from most other motorsport, here is the full explanation.

## The basic idea: the same equipment for everyone

The championship is decided on equal terms. Everyone drives equivalent rental karts in the same weight class, and the karts are drawn by lot between heats. You cannot buy speed. The only things separating the drivers are decisions, pace and the ability to perform race after race.

That is why I like to call rental karting the purest form of racing. With equalised equipment, the differences between drivers become visible. The KWC is a test of racecraft, strategy and consistency.

## The road to the final

The format of the individual championship looks like this:

| Stage | What happens |
| --- | --- |
| 8 qualifying heats | Every driver races eight heats, with karts drawn by lot and varying starting positions |
| Dropped score | One result is discarded, so a single bad draw doesn't decide a whole week |
| Semifinal | The best drivers from qualifying go through |
| Final | 18 finalists settle the title |

In total, each driver races up to **10 races during the week**. Points are added up, and the championship goes to whoever collects the most across the entire event. The occasional strong result is not enough.

## What actually decides it

The format rewards four things:

- **Stable performance across several days.** A week is long, and the tiredness arrives.
- **Handling different starting positions.** Sometimes you start first, sometimes last.
- **Decision-making in traffic.** With equal karts, overtakes become chess moves rather than tests of power.
- **Adapting to different karts.** The draw means you never drive the same kart two heats in a row. Quickly reading what this particular kart can do is a skill of its own.

The most complete driver over time ends up as the winner. That is exactly the kind of racing I have trained for.

## The Nations Cup — a Worlds for national teams

Alongside the individual championship runs the **Nations Cup on 25–26 July**, a separate team event where the drivers represent their country. Every result counts towards the nation's overall position. It adds a completely different dimension: you are not just racing for yourself, but for the team and the flag.

Sweden has some history here. In Italy 2015 I drove a stint from last to first, but the team crossed the line fifth overall. That story gets an article of its own.

## The schedule in short

- **22 July–1 August:** Kart World Championship 2026, Vandel Kart, Denmark
- **25–26 July:** Nations Cup
- **28 July–1 August:** KWC Individual

Throughout race week I publish one report per day here on the site — the numbers on top, the story underneath. The newsletter in the footer delivers every report straight to your inbox.
```

- [ ] **Step 2: Skapa `content/nyheter/sveriges-lag-i-nations-cup.en.mdx`**

```mdx
---
title: "Nations Cup for Sweden — and the stint from Italy 2015"
description: "On 25–26 July, Sweden races the Nations Cup at the rental kart Worlds. I have raced the team event at every Worlds I have entered — often close to the podium, never quite on it. This year, that is where we are aiming."
date: 2026-07-18
category: "VM 2026"
---

On 25–26 July, before the individual championship has even begun, the **Nations Cup** is decided. It is the team event, where the drivers race for their country. The same equalised karts and the same track as always, but suddenly nothing is about you. It is about the team.

## The stint I will never forget

My strongest Worlds memory is not the bronze from 2016. It is a stint in the Nations Cup in Italy 2015.

We were last when I got in the kart. Then everything clicked at once: the kart worked, the gaps opened up, and the field came closer with every lap. When I handed over, we were leading. My teammates did the job for the rest of the race, and when the chequered flag fell, Sweden was fifth overall. I don't remember those laps for the position — I remember them for the feeling of everything coming together exactly when the team needed it.

It taught me something I have carried ever since: with equalised equipment, the field is so tight that one good stint can move an entire team through the order. The margins are small, in both directions.

## Close to the podium, time and again

I have raced the Nations Cup at every Worlds I have entered. In 2016 we were fifth again, and that time there was a genuine chance to win — but a mistake in one of the pit stops cost us it. 2017 brought another fifth place, and in 2018 the team finished sixth. Sweden has been just outside the podium year after year.

That is the gap we want to close this summer.

## Sweden's 2026 squad

This year I race the Nations Cup together with **Robin Fredriksson**, **Daniel Fredriksson** and **Philip Karlsson**. Four drivers, one team, the same flag on the suit.

## What the Nations Cup demands

The team event runs on a different logic than the individual championship:

- **Every result counts for the nation.** There are no dropped scores to hide behind. Everyone in the team has to deliver.
- **The handovers decide.** The right driver in the right stint, and a plan for when things don't go to plan. In 2016 it was a pit stop that decided it, so that lesson sits deep.
- **The team perspective changes the decisions.** A risk that is reasonable for yourself can be wrong for the team, and the other way around.

## For Sweden

Racing with three crowns on the suit is something different from racing for yourself. No F1 driver races for their country. At the rental kart Worlds, we do — literally. On 25 July I am on the grid again, together with the team, and this time the goal is to take Sweden onto the podium.

Throughout championship week I write one report per evening here on the site. If you would like them straight to your inbox, the newsletter is in the footer.
```

- [ ] **Step 3: Skapa `content/nyheter/vagen-till-vandel.en.mdx`**

```mdx
---
title: "The road to Vandel — inside the campaign"
description: "The comeback, the SRKC qualifier and the goal for the 2026 rental kart Worlds. This is what the road back has looked like, and why I believe in it."
date: 2026-07-17
category: "Satsningen"
---

One week from now I roll out at Vandel Kart in Denmark for my fifth Worlds start. This is the story of the road there, and of why this campaign feels different from the ones before.

## The comeback

After the Worlds in Poland 2018 came a few quieter years. The comeback started properly in the 2021 SRKC final: 6th overall and second-best Swede. This year, 2026, I finished as the 3rd-best Swede in the SRKC, and the sights were set on Vandel.

The results from the earlier Worlds years are still there: bronze in 2016 with a win in the final, finals in 2015, 2017 and 2018, and a Nations Cup stint in Italy 2015 where I drove Sweden from last to first before the team finished fifth. But what decides things in Denmark is the form now, not the medals then.

## The training

The rental kart Worlds is an endurance test disguised as sprint racing. Up to ten races in one week, karts drawn by lot, and starting positions that vary. It takes a body that lasts the whole week, the ability to quickly read a new kart, and a head that doesn't start making worse decisions just because the body is tired.

The preparation has been about exactly that. Plenty of seat time to keep the feeling sharp, physical training for neck, arms and stamina, and mental routines to reset between heats. A bad heat is allowed to cost exactly one heat, never two.

## The goal

I am not going to Denmark just to take part. With 180 drivers on the entry list, the goal is clear: get through the qualifying heats with margin, get the semifinal right, and stand on the grid among the 18 in the final. Once there, I have shown before that things can move quickly.

In the Nations Cup I race for Sweden, and there is a bit of history to defend. More about that in the next article.

## Thank you to everyone who makes it possible

A Worlds campaign is not built alone. **Labatus** and **Primab** are part of making this journey happen. Throughout championship week I write one report per evening here on the site, so that you who follow and support get to come along the whole way. The newsletter is in the footer.
```

- [ ] **Step 4: Skapa `content/_mall-vm-rapport.en.mdx`**

```mdx
---
# ============================================================
# TEMPLATE: ENGLISH PARALLEL VERSION OF A DAILY REPORT
# 1. Copy to content/nyheter/<samma-slug-som-svenska>.en.mdx
#    (the slug MUST match the Swedish file — only ".en" is added)
# 2. date, category, day and the numbers stay IDENTICAL to the
#    Swedish file. Only title, description, tomorrow and the body
#    are written in English.
# 3. Written from /admin? The English section there generates
#    this file automatically — this template is for manual use.
# ============================================================

title: "Day N: [THE HOOK — the most important thing that happened]"
description: "[Sum up the day in one sentence — the number + the feeling.]"

date: 2026-07-XX
category: "VM 2026"
day: 0

heatsRaced: 0
bestFinish: "P–"
standing: "P–"
nationsCup: "P–"

tomorrow: "[Tomorrow brings ...]"

# Optional image — same path as the Swedish file:
# image: "/images/vm/dag-N.jpg"
---

[**Paragraph 1 — the story of the day starts here.** One key moment per heat:
the start, an overtake, a tactical call, the kart draw.]

[**Paragraph 2** — the next heat or the next turning point.]

[**Paragraph 3** — how it feels physically and mentally, the mood in the
paddock, something a reader without a racing background understands.]
```

- [ ] **Step 5: Verifiera**

Kör: `npm test` → PASS (content-testen är opåverkade — de kör mot tempkataloger).
Kör: `npm run build` → lyckas.
Starta INTE dev-servern samtidigt som bygget. Efter build, kör `npx next dev` kort och kontrollera att `http://localhost:3000/en/news/vagen-till-vandel` visar engelsk text UTAN fallback-notis, och att kategorichippen visar "The campaign". Stäng dev-servern.

- [ ] **Step 6: Commit**

```bash
git add content/nyheter/*.en.mdx content/_mall-vm-rapport.en.mdx
git commit -m "content: engelska oversattningar av de tre artiklarna + EN-mall"
```

---

### Task 13: `buildArticleEnMdx` i lib/publicera (TDD)

**Files:**
- Modify: `src/lib/publicera.ts`
- Test: `src/lib/publicera.test.ts`

**Interfaces:**
- Consumes: befintliga `RapportFalt`, `buildArticleMdx`.
- Produces: `export type RapportFaltEn = { title: string; description: string; tomorrow: string; body: string }` och `export function buildArticleEnMdx(falt: RapportFalt, en: RapportFaltEn): string`. Task 14 (API-routen) anropar den med `{ ...falt, imagePath }` som första argument.

- [ ] **Step 1: Skriv failande test**

Lägg till sist i `src/lib/publicera.test.ts` (uppdatera även importraden):

```ts
import {
  buildArticleEnMdx,
  buildArticleMdx,
  buildSlug,
  buildVmStatus,
  type RapportFalt,
  type RapportFaltEn,
} from "./publicera";

const enFalt: RapportFaltEn = {
  title: "Day 3: From P12 to P5 in the rain",
  description: "Two heats, one downpour, and a feeling that things are turning.",
  tomorrow: "Two more heats on a drier track tomorrow.",
  body: "The start in heat one was the best I have done all year.\n\nSecond paragraph here.",
};

describe("buildArticleEnMdx", () => {
  test("engelska fält ersätter svenska — datum, kategori och siffror delas", () => {
    const { data, content } = matter(buildArticleEnMdx(falt, enFalt));
    expect(data.title).toBe(enFalt.title);
    expect(data.description).toBe(enFalt.description);
    expect(data.tomorrow).toBe(enFalt.tomorrow);
    expect(content.trim()).toBe(enFalt.body);
    // Delat med svenska rapporten:
    expect(data.date).toBe("2026-07-24");
    expect(data.category).toBe("VM 2026");
    expect(data.day).toBe(3);
    expect(data.standing).toBe("P5");
  });

  test("tom engelsk tomorrow utelämnas", () => {
    const { data } = matter(buildArticleEnMdx(falt, { ...enFalt, tomorrow: " " }));
    expect(data.tomorrow).toBeUndefined();
  });

  test("bildsökvägen följer med när den finns i falt", () => {
    const medBild = buildArticleEnMdx({ ...falt, imagePath: "/images/vm/vm-dag-3.jpg" }, enFalt);
    expect(matter(medBild).data.image).toBe("/images/vm/vm-dag-3.jpg");
  });
});
```

- [ ] **Step 2: Kör testet — ska faila**

Kör: `npm test -- src/lib/publicera.test.ts`
Förväntat: FAIL — `buildArticleEnMdx` finns inte.

- [ ] **Step 3: Implementera**

Lägg till sist i `src/lib/publicera.ts`:

```ts
export type RapportFaltEn = {
  title: string;
  description: string;
  tomorrow: string;
  body: string;
};

/**
 * Engelska parallellfilen `<slug>.en.mdx`: samma datum, kategori, dag,
 * siffror och ev. bild som svenska rapporten — bara texten byts.
 */
export function buildArticleEnMdx(falt: RapportFalt, en: RapportFaltEn): string {
  return buildArticleMdx({
    ...falt,
    title: en.title,
    description: en.description,
    tomorrow: en.tomorrow,
    body: en.body,
  });
}
```

- [ ] **Step 4: Kör testet — ska passera**

Kör: `npm test -- src/lib/publicera.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/publicera.ts src/lib/publicera.test.ts
git commit -m "feat(admin): buildArticleEnMdx for engelsk parallellrapport"
```

---

### Task 14: API-routen — EN-validering + extra tree-entry (TDD)

**Files:**
- Modify: `src/app/api/admin/publicera/route.ts`
- Test: `src/app/api/admin/publicera/route.test.ts`

**Interfaces:**
- Consumes: `buildArticleEnMdx`, `RapportFaltEn` från Task 13.
- Produces: API:t accepterar valfria fält `titleEn`, `descriptionEn`, `bodyEn`, `tomorrowEn` i POST-payloaden. Allt-eller-inget: är något av dem ifyllt krävs titleEn+descriptionEn+bodyEn, annars 400. Vid komplett EN läggs `content/nyheter/<slug>.en.mdx` i samma atomiska commit. Task 15 (AdminForm) skickar fälten.

- [ ] **Step 1: Skriv failande test**

Lägg till sist i `src/app/api/admin/publicera/route.test.ts`:

```ts
const engelskaFalt = {
  titleEn: "Day 3: From P12 to P5 in the rain",
  descriptionEn: "Two heats, one downpour.",
  tomorrowEn: "Two more heats tomorrow.",
  bodyEn: "The start in heat one was the best I have done all year.",
};

describe("POST /api/admin/publicera — engelsk version", () => {
  test("delvis ifylld engelska → 400 med begripligt fel, inget GitHub-anrop", async () => {
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);
    const res = await POST(req({ ...giltigPayload, titleEn: "Day 3" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/engelsk/i);
    expect(mock).not.toHaveBeenCalled();
  });

  test("bara tomorrowEn ifyllt räknas också som delvis → 400", async () => {
    vi.stubGlobal("fetch", githubMock());
    const res = await POST(req({ ...giltigPayload, tomorrowEn: "Tomorrow ..." }));
    expect(res.status).toBe(400);
  });

  test("komplett engelska → .en.mdx som tredje tree-entry i samma commit", async () => {
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);

    const res = await POST(req({ ...giltigPayload, ...engelskaFalt }));
    expect(res.status).toBe(200);

    const [treeCall] = anrop(mock, "/git/trees", "POST");
    const tree = JSON.parse((treeCall[1] as RequestInit).body as string);
    const paths = tree.tree.map((e: { path: string }) => e.path);
    expect(paths).toContain("content/nyheter/vm-dag-3-fran-p12-till-p5-i-regnet.mdx");
    expect(paths).toContain("content/nyheter/vm-dag-3-fran-p12-till-p5-i-regnet.en.mdx");
    expect(paths).toContain("content/vm-status.json");
    expect(paths).toHaveLength(3);

    const enEntry = tree.tree.find((e: { path: string }) => e.path.endsWith(".en.mdx"));
    expect(enEntry.content).toContain("Day 3: From P12 to P5 in the rain");
    expect(enEntry.content).toContain('standing: "P5"');

    // Svenska filen är opåverkad av EN-fälten
    const svEntry = tree.tree.find(
      (e: { path: string }) => e.path.endsWith(".mdx") && !e.path.endsWith(".en.mdx"),
    );
    expect(svEntry.content).toContain("Dag 3: Från P12 till P5 i regnet");
    expect(svEntry.content).not.toContain("Day 3:");
  });

  test("engelska + bild → en.mdx innehåller samma bildsökväg", async () => {
    const mock = githubMock();
    vi.stubGlobal("fetch", mock);
    const bild = Buffer.from("låtsas-jpeg").toString("base64");
    const res = await POST(req({ ...giltigPayload, ...engelskaFalt, imageBase64: bild }));
    expect(res.status).toBe(200);

    const [treeCall] = anrop(mock, "/git/trees", "POST");
    const tree = JSON.parse((treeCall[1] as RequestInit).body as string);
    const enEntry = tree.tree.find((e: { path: string }) => e.path.endsWith(".en.mdx"));
    expect(enEntry.content).toContain("/images/vm/vm-dag-3-fran-p12-till-p5-i-regnet.jpg");
  });
});
```

- [ ] **Step 2: Kör testet — ska faila**

Kör: `npm test -- src/app/api/admin/publicera/route.test.ts`
Förväntat: FAIL — delvis engelska ger 200 i stället för 400, `.en.mdx` saknas i trädet.

- [ ] **Step 3: Implementera i `src/app/api/admin/publicera/route.ts`**

1. Byt importraden från lib/publicera:

```ts
import {
  buildArticleEnMdx,
  buildArticleMdx,
  buildSlug,
  buildVmStatus,
  type RapportFalt,
  type RapportFaltEn,
} from "@/lib/publicera";
```

2. Byt `Validerat`-typen:

```ts
type Validerat = { falt: RapportFalt; enFalt: RapportFaltEn | null; imageBase64: string | null };
```

3. I `validera()`, före `return`-satsen, lägg till:

```ts
  const titleEn = strang(body.titleEn, 200);
  const descriptionEn = strang(body.descriptionEn, 500);
  const bodyEn = strang(body.bodyEn, MAX_BODY_LEN);
  const tomorrowEn =
    typeof body.tomorrowEn === "string" ? body.tomorrowEn.trim().slice(0, 300) : "";
  let enFalt: RapportFaltEn | null = null;
  if (titleEn || descriptionEn || bodyEn || tomorrowEn) {
    if (!titleEn || !descriptionEn || !bodyEn) {
      return {
        error:
          "Engelsk version: fyll i titel, beskrivning och brödtext — eller lämna alla engelska fält tomma.",
      };
    }
    enFalt = { title: titleEn, description: descriptionEn, tomorrow: tomorrowEn, body: bodyEn };
  }
```

och ändra `return`-satsen så att `enFalt` följer med:

```ts
  return {
    falt: {
      title,
      description,
      date,
      day,
      heatsRaced,
      bestFinish,
      standing,
      nationsCup,
      tomorrow,
      body: artikeltext,
    },
    enFalt,
    imageBase64,
  };
```

4. I `publiceraTillGitHub`, byt destruktureringen i signaturen:

```ts
  { falt, enFalt, imageBase64 }: Validerat,
```

och lägg till direkt EFTER den befintliga svenska MDX-entryn (`entries.push({ path: \`content/nyheter/${slug}.mdx\`, … })`):

```ts
  if (enFalt) {
    entries.push({
      path: `content/nyheter/${slug}.en.mdx`,
      mode: "100644",
      type: "blob",
      content: buildArticleEnMdx({ ...falt, imagePath }, enFalt),
    });
  }
```

- [ ] **Step 4: Kör testerna — ska passera**

Kör: `npm test`
Förväntat: PASS — nya OCH gamla route-testen (t.ex. "utan bild: … `toHaveLength(2)`" bevisar att tomma EN-fält inte ger någon extra entry).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/publicera/route.ts src/app/api/admin/publicera/route.test.ts
git commit -m "feat(admin): valfri engelsk version publiceras atomiskt i samma commit"
```

---

### Task 15: AdminForm — engelsk sektion

**Files:**
- Modify: `src/app/admin/AdminForm.tsx`

**Interfaces:**
- Consumes: API-fälten `titleEn`, `descriptionEn`, `bodyEn`, `tomorrowEn` från Task 14.
- Produces: hopfällbar EN-sektion i formuläret, klientvalidering med samma allt-eller-inget-regel, EN-fälten ingår i det debouncade autosparet (`Utkast`-typen utökas — gamla utkast läses in felfritt eftersom återläsningen spridleker över `tomtUtkast()`).

- [ ] **Step 1: Utöka Utkast-typen och tomtUtkast**

I `src/app/admin/AdminForm.tsx`, lägg till fyra fält i `type Utkast`:

```ts
  titleEn: string;
  descriptionEn: string;
  tomorrowEn: string;
  bodyEn: string;
```

och i `tomtUtkast()`:

```ts
    titleEn: "",
    descriptionEn: "",
    tomorrowEn: "",
    bodyEn: "",
```

- [ ] **Step 2: Klientvalidering + payload**

Överst i `publicera()`-funktionen, direkt efter `event.preventDefault();`, lägg till:

```ts
    const harEngelska = Boolean(
      utkast.titleEn.trim() ||
        utkast.descriptionEn.trim() ||
        utkast.bodyEn.trim() ||
        utkast.tomorrowEn.trim(),
    );
    if (
      harEngelska &&
      !(utkast.titleEn.trim() && utkast.descriptionEn.trim() && utkast.bodyEn.trim())
    ) {
      setStatus({
        typ: "fel",
        meddelande:
          "Engelsk version: fyll i titel, beskrivning och brödtext — eller lämna alla engelska fält tomma.",
      });
      return;
    }
```

I `body: JSON.stringify({ … })`, lägg till efter `imageBase64`-raden:

```ts
          titleEn: utkast.titleEn.trim() || undefined,
          descriptionEn: utkast.descriptionEn.trim() || undefined,
          tomorrowEn: utkast.tomorrowEn.trim() || undefined,
          bodyEn: utkast.bodyEn.trim() || undefined,
```

- [ ] **Step 3: EN-sektionen i formuläret**

Direkt EFTER `tomorrow`-fältets `</div>` (och FÖRE `<Rubrik>Bild (valfri)</Rubrik>`), lägg till:

```tsx
      <Rubrik>English version (valfri)</Rubrik>

      <details className="border border-line bg-midnight-800">
        <summary className="cursor-pointer px-4 py-3 text-sm text-mist">
          Skriv en engelsk variant{utkast.titleEn.trim() ? " — påbörjad" : ""} (lämna tomt så
          visas svenska med notis på /en)
        </summary>
        <div className="space-y-6 border-t border-line p-4">
          <div>
            <Etikett htmlFor="admin-title-en">Title — English</Etikett>
            <input
              id="admin-title-en"
              maxLength={200}
              placeholder={'E.g. "Day 3: From P12 to P5 in the rain"'}
              className={faltKlass}
              value={utkast.titleEn}
              onChange={(e) => uppdatera("titleEn", e.target.value)}
            />
          </div>
          <div>
            <Etikett htmlFor="admin-description-en">Description — English</Etikett>
            <textarea
              id="admin-description-en"
              rows={2}
              maxLength={500}
              placeholder="Sum up the day in one sentence — the number + the feeling."
              className={faltKlass}
              value={utkast.descriptionEn}
              onChange={(e) => uppdatera("descriptionEn", e.target.value)}
            />
          </div>
          <div>
            <Etikett htmlFor="admin-body-en">Body — English</Etikett>
            <textarea
              id="admin-body-en"
              rows={12}
              maxLength={50000}
              placeholder={"The same report in English.\n\nBlank line between paragraphs."}
              className={faltKlass}
              value={utkast.bodyEn}
              onChange={(e) => uppdatera("bodyEn", e.target.value)}
            />
          </div>
          {utkast.tomorrow.trim() !== "" && (
            <div>
              <Etikett htmlFor="admin-tomorrow-en">Tomorrow — English (valfri)</Etikett>
              <input
                id="admin-tomorrow-en"
                maxLength={300}
                placeholder="Two more heats on a drier track tomorrow."
                className={faltKlass}
                value={utkast.tomorrowEn}
                onChange={(e) => uppdatera("tomorrowEn", e.target.value)}
              />
            </div>
          )}
        </div>
      </details>
```

- [ ] **Step 4: Verifiera**

Kör: `npm test` → PASS. Kör: `npm run build` → lyckas.
Kör sedan `npx next dev` (bygget är klart — aldrig samtidigt) och öppna `http://localhost:3000/admin`:
1. Fyll bara i engelsk titel + svenska obligatoriska fält → "Publicera" ska ge det svenska felmeddelandet om engelsk version, UTAN serveranrop.
2. Kontrollera att EN-fälten överlever en sidomladdning (autospar).
Stäng dev-servern.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/AdminForm.tsx
git commit -m "feat(admin): valfri engelsk sektion i publiceringsformularet"
```

---

### Task 16: Slutverifiering

**Files:** inga nya — verifiering av helheten.

- [ ] **Step 1: Hela testsviten**

Kör: `npm test`
Förväntat: PASS, 0 failade.

- [ ] **Step 2: Produktionsbygge**

Kör: `npm run build` (dev-servern AVSTÄNGD).
Förväntat: lyckas; routelistan innehåller `/en/career`, `/en/about`, `/en/partners`, `/en/media`, `/en/contact`, `/en/press`.

- [ ] **Step 3: Dev-genomgång**

Starta `npx next dev` (efter att bygget är klart) och gå igenom:

1. Alla sex nya sidor renderar med engelsk copy och utan konsolfel.
2. Språkväxlaren (SV/EN i headern) på VARJE sida landar på motsvarande sida åt båda håll (9 statiska par + en artikel).
3. Menyn på `/en` har 8 poster; footerns pressänk på EN-sidor går till `/en/press`.
4. `/en/news`: kategorifiltren visar "Worlds 2026" / "The campaign"; de tre artiklarna visas utan fallback-notis; kortens kategori-chip är översatta.
5. `/en/news/sa-funkar-hyrkart-vm`: engelsk brödtext, tabellen renderar, "Tomorrow"-blocket saknas (ej dagsrapport) — korrekt.
6. `/kontakt` ser ut och beter sig som innan (svenska etiketter).
7. `view-source` på `/en/career`: `hreflang`-länkar till `/karriar` finns; på `/karriar`: länk till `/en/career`.

Stäng dev-servern.

- [ ] **Step 4: Rapportera**

Visa testutdata + buildens routelista för Rickard. Committa INGET mer utan besked; fråga om PR ska öppnas (gstack `ship`).

---

## Self-Review (utförd vid planskrivning)

- **Spec-täckning:** §1 URL/nav → Task 10; §2 sex sidor + ContactForm + hreflang → Task 3–9; §3 översättningar + kategorivisning + mall → Task 1–2, 12; §4 admin → Task 13–15; §5 sitemap → Task 11; §6 test/verifiering → TDD i Task 1/10/13/14 + Task 16. Inga luckor.
- **Platshållare:** inga TBD/TODO; all copy och kod utskriven.
- **Typkonsistens:** `categoryLabel(category: string, lang: Lang)` används likadant i Task 1/2; `RapportFaltEn` fältnamn (`title`, `description`, `tomorrow`, `body`) matchar mellan Task 13 och 14; API-fältnamnen (`titleEn`, `descriptionEn`, `bodyEn`, `tomorrowEn`) matchar mellan Task 14 och 15; `ContactForm({ lang })` matchar mellan Task 3 och 8.
