import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { formatDate, getArticle, getArticleSlugs } from "@/lib/content";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Rickard Javanainen · SWE";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug, "sv");
  if (!article) {
    return buildOgImage({ title: "Rickard Javanainen" });
  }
  const { frontmatter } = article;
  const isRaceReport = typeof frontmatter.day === "number";
  return buildOgImage({
    title: frontmatter.title,
    subtitle: frontmatter.description,
    day: frontmatter.day,
    keyStat: isRaceReport ? frontmatter.standing : undefined,
    date: formatDate(frontmatter.date, "sv"),
    showPartners: isRaceReport,
  });
}
