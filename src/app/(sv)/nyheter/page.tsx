import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CATEGORIES, getAllArticles } from "@/lib/content";
import { DICT } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Nyheter — racerapporter och vägen till VM",
  description: DICT.sv.news.description,
  alternates: {
    canonical: "/nyheter",
    languages: { "sv-SE": "/nyheter", en: "/en/news", "x-default": "/nyheter" },
  },
};

type Props = { searchParams: Promise<{ kategori?: string }> };

export default async function NewsPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const t = DICT.sv.news;
  const articles = getAllArticles("sv");
  const activeCategory = CATEGORIES.find((c) => c === kategori) ?? null;
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

      {/* Kategorifilter — länkar, inte JS-state, så listan är delbar och SSR:ad */}
      <nav aria-label="Kategorifilter" className="mb-10 flex flex-wrap gap-2">
        <Link href="/nyheter" className={filterLinkClass(activeCategory === null)}>
          {t.all}
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/nyheter?kategori=${encodeURIComponent(category)}`}
            className={filterLinkClass(activeCategory === category)}
          >
            {category}
          </Link>
        ))}
      </nav>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} lang="sv" />
          ))}
        </div>
      ) : (
        <p className="text-mist">{t.empty}</p>
      )}
    </div>
  );
}
