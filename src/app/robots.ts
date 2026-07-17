import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // AI-crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended m.fl.)
    // omfattas av "*" och är medvetet tillåtna — de behövs för citering i AI-sök.
    // /admin spärras INTE här: sidan har noindex i metadata, och robots-spärr
    // skulle hindra Google från att läsa den taggen.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
