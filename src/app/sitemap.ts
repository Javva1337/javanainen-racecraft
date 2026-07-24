import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Hreflang-par för sidor som finns på båda språken. Next lägger INTE till
 * någon självrefererande <xhtml:link> automatiskt — därför anges båda
 * språken (plus x-default) explicit för varje URL.
 */
function bilingualAlternates(svPath: string, enPath: string) {
  return {
    languages: {
      "sv-SE": `${SITE_URL}${svPath}`,
      en: `${SITE_URL}${enPath}`,
      "x-default": `${SITE_URL}${svPath}`,
    },
  };
}

const BILINGUAL_PAIRS: Array<[sv: string, en: string]> = [
  ["", "/en"],
  ["/vm-2026", "/en/vm-2026"],
  ["/nyheter", "/en/news"],
  ["/karriar", "/en/career"],
  ["/om", "/en/about"],
  ["/partners", "/en/partners"],
  ["/media", "/en/media"],
  ["/kontakt", "/en/contact"],
  ["/press", "/en/press"],
];

const SV_ONLY_PAGES: string[] = ["/vm-2026/nations-cup"];

export default function sitemap(): MetadataRoute.Sitemap {
  const bilingualPages = BILINGUAL_PAIRS.flatMap(([sv, en]) =>
    [sv, en].map((route) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" || route === "/vm-2026" ? 1 : 0.7,
      alternates: bilingualAlternates(sv, en),
    })),
  );

  const svOnlyPages = SV_ONLY_PAGES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articles = getAllArticles("sv").flatMap((article) => {
    const sv = `/nyheter/${article.slug}`;
    const en = `/en/news/${article.slug}`;
    return [
      {
        url: `${SITE_URL}${sv}`,
        lastModified: article.frontmatter.date,
        changeFrequency: "daily" as const,
        priority: 0.9,
        alternates: bilingualAlternates(sv, en),
      },
      {
        url: `${SITE_URL}${en}`,
        lastModified: article.frontmatter.date,
        changeFrequency: "daily" as const,
        priority: 0.6,
        alternates: bilingualAlternates(sv, en),
      },
    ];
  });

  return [...bilingualPages, ...svOnlyPages, ...articles];
}
