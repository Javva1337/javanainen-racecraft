import Link from "next/link";
import type { Article } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { DICT, type Lang } from "@/lib/dictionary";

/** Artikelkort för listor (nyhetssidan + startsidan). */
export function ArticleCard({ article, lang }: { article: Article; lang: Lang }) {
  const t = DICT[lang].article;
  const href = lang === "sv" ? `/nyheter/${article.slug}` : `/en/news/${article.slug}`;
  const { frontmatter } = article;

  return (
    <article className="group relative flex h-full flex-col border border-line bg-midnight-800 p-6 transition-colors duration-200 hover:border-flagblue">
      <div className="mb-3 flex items-center gap-3 text-[0.7rem]">
        <span className="heading-caps border border-flagblue px-2 py-0.5 tracking-[0.12em] text-flagblue-bright">
          {frontmatter.category}
        </span>
        {typeof frontmatter.day === "number" && (
          <span className="heading-caps tracking-[0.12em] text-flagyellow">
            {t.day(frontmatter.day)}
          </span>
        )}
      </div>
      <h3 className="heading-caps mb-2 text-lg leading-snug text-snow">
        <Link href={href} className="after:absolute after:inset-0">
          {frontmatter.title}
        </Link>
      </h3>
      {frontmatter.description && (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-mist">
          {frontmatter.description}
        </p>
      )}
      <p className="tabular mt-auto text-xs text-mist-dim">
        {formatDate(frontmatter.date, lang)} · {t.readingTime(article.readingTimeMin)}
      </p>
    </article>
  );
}
