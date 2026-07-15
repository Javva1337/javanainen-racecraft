import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CATEGORIES, getAllArticles } from "@/lib/content";
import { DICT } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "News — race reports and the road to the Worlds",
  description: DICT.en.news.description,
  alternates: {
    canonical: "/en/news",
    languages: { "sv-SE": "/nyheter", en: "/en/news", "x-default": "/nyheter" },
  },
  openGraph: { locale: "en_US" },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function EnglishNewsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const t = DICT.en.news;
  const articles = getAllArticles("en");
  const activeCategory = CATEGORIES.find((c) => c === category) ?? null;
  const filtered = activeCategory
    ? articles.filter((a) => a.frontmatter.category === activeCategory)
    : articles;

  const filterLinkClass = (isActive: boolean) =>
    `heading-caps border px-3 py-1.5 text-xs tracking-[0.12em] transition-colors duration-200 ${
      isActive
        ? "border-flagblue bg-flagblue text-snow"
        : "border-line text-mist hover:border-flagblue-bright hover:text-snow"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-mist">{t.description}</p>
      </header>

      <nav aria-label="Category filter" className="mb-10 flex flex-wrap gap-2">
        <Link href="/en/news" className={filterLinkClass(activeCategory === null)}>
          {t.all}
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/en/news?category=${encodeURIComponent(cat)}`}
            className={filterLinkClass(activeCategory === cat)}
          >
            {cat}
          </Link>
        ))}
      </nav>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} lang="en" />
          ))}
        </div>
      ) : (
        <p className="text-mist">{t.empty}</p>
      )}
    </div>
  );
}
