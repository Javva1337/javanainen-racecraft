import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Lang } from "./dictionary";

export const CATEGORIES = ["VM 2026", "SRKC", "Satsningen", "Partners"] as const;
export type Category = (typeof CATEGORIES)[number];

export type ArticleFrontmatter = {
  title: string;
  description: string;
  /** ISO-datum, t.ex. 2026-07-25 */
  date: string;
  category: Category;
  /** VM-dag (1–11) för dagsrapporter — styr OG-bilden */
  day?: number;
  heatsRaced?: string | number;
  bestFinish?: string;
  standing?: string;
  nationsCup?: string;
  image?: string;
  /** En mening om vad som väntar imorgon (visas i eget block) */
  tomorrow?: string;
};

export type Article = {
  slug: string;
  lang: Lang;
  /** true när engelsk version saknas och svenska visas i stället */
  isFallback: boolean;
  frontmatter: ArticleFrontmatter;
  body: string;
  readingTimeMin: number;
};

const DEFAULT_DIR = path.join(process.cwd(), "content", "nyheter");

export function readingTimeMin(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Alla artikel-sluggar (utkast med ledande "_" och .en-varianter exkluderas). */
export function getArticleSlugs(dir: string = DEFAULT_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_") && !f.endsWith(".en.mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function parseFile(filePath: string, slug: string, lang: Lang, isFallback: boolean): Article {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;
  if (!fm.title || !fm.date || !fm.category) {
    throw new Error(`Ogiltig frontmatter i ${filePath}: title, date och category krävs.`);
  }
  // gray-matter parsar oquotade YAML-datum till Date-objekt — normalisera till ISO-sträng
  const rawDate = fm.date as string | Date;
  const isoDate =
    rawDate instanceof Date
      ? rawDate.toISOString().slice(0, 10)
      : String(rawDate).slice(0, 10);
  return {
    slug,
    lang,
    isFallback,
    frontmatter: { ...fm, description: fm.description ?? "", date: isoDate },
    body: content.trim(),
    readingTimeMin: readingTimeMin(content),
  };
}

/**
 * Hämta en artikel. För lang="en" används parallellfilen `<slug>.en.mdx` om den
 * finns; annars returneras den svenska med isFallback=true.
 */
export function getArticle(
  slug: string,
  lang: Lang = "sv",
  dir: string = DEFAULT_DIR,
): Article | null {
  const svPath = path.join(dir, `${slug}.mdx`);
  if (lang === "en") {
    const enPath = path.join(dir, `${slug}.en.mdx`);
    if (fs.existsSync(enPath)) return parseFile(enPath, slug, "en", false);
    if (fs.existsSync(svPath)) return parseFile(svPath, slug, "en", true);
    return null;
  }
  if (!fs.existsSync(svPath)) return null;
  return parseFile(svPath, slug, "sv", false);
}

/** Alla artiklar, nyast först. */
export function getAllArticles(lang: Lang = "sv", dir: string = DEFAULT_DIR): Article[] {
  return getArticleSlugs(dir)
    .map((slug) => getArticle(slug, lang, dir))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

const MONTHS_SV = [
  "januari", "februari", "mars", "april", "maj", "juni",
  "juli", "augusti", "september", "oktober", "november", "december",
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-07-25" → "25 juli 2026" / "25 July 2026" */
export function formatDate(isoDate: string, lang: Lang = "sv"): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const months = lang === "sv" ? MONTHS_SV : MONTHS_EN;
  return `${d} ${months[m - 1]} ${y}`;
}
