import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Countdown } from "@/components/Countdown";
import { CountUp } from "@/components/CountUp";
import { FaqJsonLd, SportsEventJsonLd } from "@/components/JsonLd";
import { KurbitsDivider } from "@/components/Kurbits";
import { LiveLinks } from "@/components/LiveLinks";
import { LiveStanding } from "@/components/LiveStanding";
import { NationBadge } from "@/components/NationBadge";
import { Reveal } from "@/components/Reveal";
import { getAllArticles } from "@/lib/content";
import { getSiteMode } from "@/lib/mode";
import { KWC, SOCIAL } from "@/lib/site";
import { getVmStatus } from "@/lib/vm-status";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Worlds 2026 — Kart World Championship at Vandel, Denmark",
  description:
    "Schedule, format and daily reports from the 2026 Kart World Championship at Vandel Kart, Denmark. Nations Cup 25–26 July, KWC Individual 28 July–1 August.",
  alternates: {
    canonical: "/en/vm-2026",
    languages: { "sv-SE": "/vm-2026", en: "/en/vm-2026", "x-default": "/vm-2026" },
  },
  openGraph: { locale: "en_US" },
};

const SCHEDULE = [
  { dates: "22 July", label: "Championship week begins", detail: "The 20th edition of the Kart World Championship opens at Vandel Kart" },
  { dates: "25–26 July", label: "Nations Cup", detail: "The team event, Rickard races for Sweden", highlight: true },
  { dates: "28 July–1 August", label: "KWC Individual", detail: "The individual world championship: qualifying heats, semifinal and final", highlight: true },
];

const FORMAT_STATS = [
  { value: 8, label: "qualifying heats" },
  { value: 1, label: "semifinal" },
  { value: 18, label: "finalists" },
];

/** Same text in the visible FAQ and the FAQPage schema — they must never drift apart. */
const FAQ_ITEMS = [
  {
    q: "What is the rental kart World Championship?",
    a: "The Kart World Championship (KWC) is the world championship of rental karting. Everyone races equal karts supplied by the organiser, so the driving decides the result, not the equipment. The 2026 edition is the 20th, with 180 drivers.",
  },
  {
    q: "When and where is the 2026 Worlds held?",
    a: "From 22 July to 1 August 2026 at Vandel Kart in the Billund area of Jutland, Denmark. The Nations Cup runs 25–26 July and the individual championship 28 July–1 August.",
  },
  {
    q: "How does the championship format work?",
    a: "Each driver races 8 qualifying heats, with one result dropped. Karts are drawn by lot between heats and the starting order is set by a one-lap time qualifying before each heat. The semifinal decides which 18 drivers race the final.",
  },
  {
    q: "How do I follow Rickard during the Worlds?",
    a: "A report is published here every race day, the same evening. The reports are also available as an RSS feed and newsletter, and between reports there are clips and photos on Instagram.",
  },
];

export default function EnglishVmPage() {
  const mode = getSiteMode();
  const status = getVmStatus();
  const articles = getAllArticles("en");
  const dayReports = articles.filter((a) => typeof a.frontmatter.day === "number");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14">
        <NationBadge className="mb-4" />
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-6xl">Worlds 2026</h1>
        <p className="mt-4 max-w-2xl text-lg text-mist">
          Kart World Championship · 20th edition · {KWC.venue}, Denmark ·{" "}
          <span className="tabular">{KWC.datesLabel.en}</span> ·{" "}
          <span className="tabular">180</span> drivers
        </p>
      </header>

      {mode === "before" && (
        <section className="mb-16 border border-line bg-midnight-800 p-5 sm:p-8" aria-label="Countdown">
          <p className="heading-caps mb-4 text-xs tracking-[0.16em] text-mist-dim">
            Nations Cup · {KWC.nationsCupLabel.en}
          </p>
          <Countdown target={KWC.nationsCupStart} lang="en" />
        </section>
      )}

      {mode === "during" && status && (
        <div className="mb-16">
          <h2 className="heading-caps mb-6 text-2xl font-bold text-snow">Right now</h2>
          <LiveStanding status={status} lang="en" />
        </div>
      )}

      {mode === "after" && (
        <section className="mb-16 border border-line bg-midnight-800 p-8">
          <h2 className="heading-caps mb-3 text-2xl font-bold text-snow">Worlds 2026 — how it went</h2>
          <p className="max-w-2xl text-mist">
            Championship week is over. All daily reports are collected below, and the full summary
            is published under News.
          </p>
        </section>
      )}

      {dayReports.length > 0 && (
        <section className="mb-16" aria-label="Race reports">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="heading-caps text-2xl font-bold text-snow">
              {mode === "during" ? "Today's reports" : "The race reports"}
            </h2>
            <Link
              href="/en/news"
              className="heading-caps text-xs tracking-[0.14em] text-mist transition-colors duration-200 hover:text-snow"
            >
              All →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {dayReports.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} lang="en" />
            ))}
          </div>
        </section>
      )}

      <section className="mb-16" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Schedule
        </h2>
        <ol className="divide-y divide-line border border-line">
          {SCHEDULE.map((row) => (
            <li key={row.dates} className="flex flex-col gap-1 bg-midnight-800 px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <span
                className={`heading-caps tabular w-48 shrink-0 text-sm font-bold ${
                  row.highlight ? "text-flagyellow" : "text-snow"
                }`}
              >
                {row.dates}
              </span>
              <span className="heading-caps text-sm text-snow">{row.label}</span>
              <span className="text-sm text-mist">{row.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <KurbitsDivider className="mb-16" />

      <section className="mb-16" aria-labelledby="format-heading">
        <h2 id="format-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          How the format works
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FORMAT_STATS.map((stat) => (
            <Reveal key={stat.label}>
              <div className="border border-line bg-midnight-800 p-6 text-center">
                <CountUp
                  value={stat.value}
                  className="heading-caps block text-5xl font-bold text-flagyellow sm:text-6xl"
                />
                <span className="heading-caps mt-2 block text-xs tracking-[0.14em] text-mist-dim">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="max-w-3xl space-y-4 leading-relaxed text-mist">
          <p>
            Everyone races equal equipment in the same weight class, and karts are drawn by lot
            between heats. Each driver runs <strong className="text-snow">8 qualifying heats</strong>,{" "}
            one result is dropped, before the semifinal decides which{" "}
            <strong className="text-snow">18 drivers</strong> contest the final.
          </p>
          <p>
            That adds up to <strong className="text-snow tabular">10 races</strong> in a week. The
            championship goes to whoever collects the most points across the entire event. It
            rewards consistency and the ability to deliver in every race, not one-off results.
          </p>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="events-heading">
        <h2 id="events-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Two championships in one week
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-line bg-midnight-800 p-6">
            <h3 className="heading-caps mb-2 text-lg text-snow">KWC Individual</h3>
            <p className="text-sm leading-relaxed text-mist">
              The individual world championship, {KWC.individualLabel.en}. 180 drivers, a field
              where every heat counts. Rickard's best Worlds result: 3rd of 102 (2016).
            </p>
          </div>
          <div className="border border-line bg-midnight-800 p-6">
            <h3 className="heading-caps mb-2 text-lg text-snow">Nations Cup</h3>
            <p className="text-sm leading-relaxed text-mist">
              The team event where drivers represent their country, {KWC.nationsCupLabel.en}.
              Every result counts toward the nation's total. Rickard has raced the Nations Cup at
              every Worlds he has entered: fifth in 2015–2017 and sixth in 2018. This year the
              goal is the podium, for Sweden.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="track-heading">
        <h2 id="track-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          The track: Vandel Kart
        </h2>
        <p className="max-w-3xl leading-relaxed text-mist">
          {KWC.venue} is located in the {KWC.area.en} in Jutland, Denmark, and hosts the 20th
          edition of the Kart World Championship. Track facts and corner-by-corner driver notes
          will be published here after the practice days, straight from the paddock.
        </p>
      </section>

      <KurbitsDivider className="mb-16" />

      <section aria-labelledby="follow-heading">
        <h2 id="follow-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          How to follow the Worlds
        </h2>
        <LiveLinks lang="en" className="mb-8 max-w-3xl" />
        <ul className="max-w-3xl space-y-3 text-mist">
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Daily reports on this site.</strong> One report per
              race day, published the same evening. The numbers first, the story underneath.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">The newsletter.</strong> Every report straight to
              your inbox, sign up in the footer.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Social channels.</strong>{" "}
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-flagblue-bright underline underline-offset-4">
                Instagram
              </a>{" "}
              and{" "}
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="text-flagblue-bright underline underline-offset-4">
                Facebook
              </a>{" "}
              for clips and photos between reports.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-flagyellow" aria-hidden="true">→</span>
            <span>
              <strong className="text-snow">Official results.</strong> The organiser's channels
              at{" "}
              <a href="https://kartworldchampionship.com" target="_blank" rel="noopener noreferrer" className="text-flagblue-bright underline underline-offset-4">
                kartworldchampionship.com
              </a>
              .
            </span>
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-16" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="heading-caps mb-6 text-2xl font-bold text-snow">
          Frequently asked questions
        </h2>
        <dl className="max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="border border-line bg-midnight-800 p-6">
              <dt className="heading-caps mb-2 text-lg text-snow">{item.q}</dt>
              <dd className="text-sm leading-relaxed text-mist">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SportsEventJsonLd lang="en" />
      <FaqJsonLd items={FAQ_ITEMS} />
    </div>
  );
}
