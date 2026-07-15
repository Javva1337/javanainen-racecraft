import { getAllArticles } from "@/lib/content";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** RSS 2.0-flöde för nyheterna. */
export async function GET() {
  const articles = getAllArticles("sv");

  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/nyheter/${article.slug}`;
      const pubDate = new Date(`${article.frontmatter.date}T18:00:00+02:00`).toUTCString();
      return `    <item>
      <title>${escapeXml(article.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.frontmatter.category)}</category>
      <description>${escapeXml(article.frontmatter.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rickard Javanainen — Nyheter</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(DEFAULT_DESCRIPTION.sv)}</description>
    <language>sv-SE</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
