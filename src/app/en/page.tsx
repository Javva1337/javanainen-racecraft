import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Hero } from "@/components/Hero";
import { KurbitsDivider } from "@/components/Kurbits";
import { Reveal } from "@/components/Reveal";
import { getAllArticles } from "@/lib/content";
import { getSiteMode } from "@/lib/mode";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, PARTNERS } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE.en },
  description: DEFAULT_DESCRIPTION.en,
  alternates: {
    canonical: "/en",
    languages: { "sv-SE": "/", en: "/en", "x-default": "/" },
  },
  openGraph: { locale: "en_US" },
};

const MERITS = [
  {
    title: "Top 3 at the Worlds",
    text: "World Championship bronze medalist 2016. Won the final, 3rd of 102. Worlds finalist in 2015, 2017 and 2018.",
    highlight: true,
  },
  {
    title: "Strategic racecraft",
    text: "Strong tactical decisions in race conditions, consistent when it counts. Decisive in a format that rewards it.",
    highlight: false,
  },
  {
    title: "Worlds — Vandel 2026",
    text: "Kart World Championship, Vandel Kart, Denmark. 22 July–1 August 2026 · Nations Cup 25–26 July · 180 drivers.",
    highlight: false,
  },
];

export default function EnglishHomePage() {
  const mode = getSiteMode();
  const articles = getAllArticles("en");
  const latest = articles[0] ?? null;

  return (
    <>
      <Hero lang="en" mode={mode} latestArticle={latest} />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Highlights">
        <div className="grid gap-4 md:grid-cols-3">
          {MERITS.map((merit, index) => (
            <Reveal key={merit.title} delayMs={index * 60}>
              <div
                className={`h-full border bg-midnight-800 p-6 transition-colors duration-200 hover:border-flagblue ${
                  merit.highlight ? "border-flagyellow/40" : "border-line"
                }`}
              >
                <h2
                  className={`heading-caps mb-3 text-lg ${
                    merit.highlight ? "text-flagyellow" : "text-snow"
                  }`}
                >
                  {merit.title}
                </h2>
                <p className="text-sm leading-relaxed text-mist">{merit.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <KurbitsDivider className="mx-auto max-w-6xl px-4 sm:px-6" />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Latest news">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="heading-caps text-2xl font-bold text-snow">Latest news</h2>
          <Link
            href="/en/news"
            className="heading-caps text-xs tracking-[0.14em] text-mist transition-colors duration-200 hover:text-snow"
          >
            All news →
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {articles.slice(0, 3).map((article, index) => (
              <Reveal key={article.slug} delayMs={index * 60}>
                <ArticleCard article={article} lang="en" />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-mist">The first report is coming shortly.</p>
        )}
      </section>

      <KurbitsDivider className="mx-auto max-w-6xl px-4 sm:px-6" />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Partners">
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="heading-caps text-xs tracking-[0.16em] text-mist-dim">
            The Worlds campaign is made possible by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-sm px-6 py-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                  partner.chip === "light" ? "bg-snow" : "border border-line"
                }`}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
