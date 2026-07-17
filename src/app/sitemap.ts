import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/vm-2026",
    "/nyheter",
    "/karriar",
    "/om",
    "/partners",
    "/media",
    "/kontakt",
    "/press",
    "/en",
    "/en/vm-2026",
    "/en/news",
    "/en/career",
    "/en/about",
    "/en/partners",
    "/en/media",
    "/en/contact",
    "/en/press",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" || route === "/vm-2026" ? 1 : 0.7,
  }));

  const articles = getAllArticles("sv").flatMap((article) => [
    {
      url: `${SITE_URL}/nyheter/${article.slug}`,
      lastModified: article.frontmatter.date,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/en/news/${article.slug}`,
      lastModified: article.frontmatter.date,
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
  ]);

  return [...staticPages, ...articles];
}
