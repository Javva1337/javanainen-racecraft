import type { Metadata } from "next";
import { Chapters } from "@/components/home/Chapters";
import { HeroCyborg } from "@/components/home/HeroCyborg";
import { HomeScroll } from "@/components/home/HomeScroll";
import { StickyField } from "@/components/home/StickyField";
import { getAllArticles } from "@/lib/content";
import { DICT } from "@/lib/dictionary";
import { getSiteMode } from "@/lib/mode";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE.sv },
  description: DEFAULT_DESCRIPTION.sv,
  alternates: {
    canonical: "/",
    languages: { "sv-SE": "/", en: "/en", "x-default": "/" },
  },
};

export default function HomePage() {
  const mode = getSiteMode();
  const latest = getAllArticles("sv")[0] ?? null;
  const t = DICT.sv.home;
  const vmHref = "/vm-2026";
  const cta =
    mode === "after"
      ? { href: vmHref, label: t.afterBanner }
      : mode === "during"
        ? { href: latest ? `/nyheter/${latest.slug}` : vmHref, label: t.liveBanner }
        : { href: "/vm-2026/nations-cup", label: t.heroNc };

  return (
    <HomeScroll>
      <StickyField />
      <HeroCyborg
        ctaHref={cta.href}
        ctaLabel={cta.label}
        secondaryHref="#laser-racet"
        secondaryLabel="Läs racecraft"
        micro="41:a av 180 · Vandel 2026 · VM-brons 2016"
      />
      <Chapters latest={latest} vmHref={vmHref} />
    </HomeScroll>
  );
}
