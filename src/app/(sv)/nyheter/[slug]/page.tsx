import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { getArticle, getArticleSlugs } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug, "sv");
  if (!article) return {};
  const { frontmatter } = article;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: `/nyheter/${slug}`,
      languages: {
        "sv-SE": `/nyheter/${slug}`,
        "en": `/en/news/${slug}`,
        "x-default": `/nyheter/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      publishedTime: frontmatter.date,
      url: `/nyheter/${slug}`,
      locale: "sv_SE",
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug, "sv");
  if (!article) notFound();
  return <ArticleView article={article} lang="sv" />;
}
