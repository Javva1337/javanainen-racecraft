import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Article } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { DICT, type Lang } from "@/lib/dictionary";
import { SITE_URL } from "@/lib/site";
import { FactBox } from "./FactBox";
import { NewsArticleJsonLd } from "./JsonLd";
import { PartnerFooter } from "./PartnerFooter";
import { ShareButtons } from "./ShareButtons";

/** Artikelvyn enligt rapportens mall 5.2 — delas av sv- och en-routerna. */
export function ArticleView({ article, lang }: { article: Article; lang: Lang }) {
  const t = DICT[lang].article;
  const { frontmatter } = article;
  const basePath = lang === "sv" ? "/nyheter" : "/en/news";
  const url = `${SITE_URL}${basePath}/${article.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="heading-caps border border-flagblue px-2 py-0.5 tracking-[0.12em] text-flagblue-bright">
            {frontmatter.category}
          </span>
          {typeof frontmatter.day === "number" && (
            <span className="heading-caps tracking-[0.12em] text-flagyellow">
              {t.day(frontmatter.day)}
            </span>
          )}
          <span className="tabular text-mist-dim">
            {formatDate(frontmatter.date, lang)} · {t.readingTime(article.readingTimeMin)}
          </span>
        </div>
        <h1 className="heading-caps text-3xl font-bold leading-tight text-snow sm:text-4xl">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="mt-4 text-lg leading-relaxed text-mist">{frontmatter.description}</p>
        )}
        {article.isFallback && t.fallbackNotice && (
          <p className="mt-4 border-l-2 border-flagblue py-1 pl-4 text-sm text-mist-dim">
            {t.fallbackNotice}
          </p>
        )}
      </header>

      {frontmatter.image && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-line">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <FactBox frontmatter={frontmatter} lang={lang} />

      <div className="prose-rj">
        <MDXRemote
          source={article.body}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      {frontmatter.tomorrow && (
        <aside className="mt-10 border-l-2 border-flagyellow py-1 pl-5">
          <p className="heading-caps mb-1 text-xs tracking-[0.14em] text-flagyellow">
            {t.tomorrowHeading}
          </p>
          <p className="text-mist">{frontmatter.tomorrow}</p>
        </aside>
      )}

      <ShareButtons url={url} title={frontmatter.title} lang={lang} />

      <PartnerFooter lang={lang} />

      <p className="mt-10">
        <Link
          href={basePath}
          className="heading-caps text-xs tracking-[0.14em] text-mist transition-colors duration-200 hover:text-snow"
        >
          ← {t.backToList}
        </Link>
      </p>

      <NewsArticleJsonLd
        title={frontmatter.title}
        description={frontmatter.description}
        date={frontmatter.date}
        url={url}
        image={`${url}/opengraph-image`}
      />
    </article>
  );
}
