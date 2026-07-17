import type { VmStatus } from "./vm-status";

/**
 * Ren logik för publiceringsflödet i /admin: slug, MDX-fil och vm-status.
 * Ingen I/O här — API-routen står för GitHub-anropen.
 */
export type RapportFalt = {
  title: string;
  description: string;
  /** ISO-datum, t.ex. 2026-07-24 */
  date: string;
  /** VM-dag 1–11 */
  day: number;
  heatsRaced: number;
  bestFinish: string;
  standing: string;
  nationsCup: string;
  tomorrow: string;
  body: string;
  /** Publik sökväg, t.ex. /images/vm/vm-dag-3.jpg */
  imagePath?: string;
};

/** JSON-strängar är giltiga YAML-skalärer — citattecken/kolon/radbrytningar blir ofarliga. */
function yamlStr(value: string): string {
  return JSON.stringify(value);
}

/** `vm-dag-3-fran-p12-till-p5` av dag + rubrik (ledande "Dag N:" skalas bort). */
export function buildSlug(day: number, title: string): string {
  const krok = title.replace(/^dag\s*\d+\s*[:.–—-]?\s*/i, "");
  const slug = krok
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `vm-dag-${day}-${slug}` : `vm-dag-${day}`;
}

/** Hela MDX-filen: frontmatter enligt _mall-vm-rapport.mdx + brödtext. */
export function buildArticleMdx(falt: RapportFalt): string {
  const rader = [
    `title: ${yamlStr(falt.title)}`,
    `description: ${yamlStr(falt.description)}`,
    `date: ${yamlStr(falt.date)}`,
    `category: "VM 2026"`,
    `day: ${falt.day}`,
    `heatsRaced: ${falt.heatsRaced}`,
    `bestFinish: ${yamlStr(falt.bestFinish)}`,
    `standing: ${yamlStr(falt.standing)}`,
    `nationsCup: ${yamlStr(falt.nationsCup)}`,
  ];
  if (falt.tomorrow.trim()) {
    rader.push(`tomorrow: ${yamlStr(falt.tomorrow)}`);
  }
  if (falt.imagePath) {
    rader.push(`image: ${yamlStr(falt.imagePath)}`);
  }
  return `---\n${rader.join("\n")}\n---\n\n${falt.body.trim()}\n`;
}

/** Nytt innehåll för content/vm-status.json — samma siffror som rapporten. */
export function buildVmStatus(falt: RapportFalt): VmStatus {
  return {
    heatsRaced: falt.heatsRaced,
    bestFinish: falt.bestFinish,
    standing: falt.standing,
    nationsCupPosition: falt.nationsCup,
    updatedAt: falt.date,
  };
}

export type RapportFaltEn = {
  title: string;
  description: string;
  tomorrow: string;
  body: string;
};

/**
 * Engelska parallellfilen `<slug>.en.mdx`: samma datum, kategori, dag,
 * siffror och ev. bild som svenska rapporten — bara texten byts.
 */
export function buildArticleEnMdx(falt: RapportFalt, en: RapportFaltEn): string {
  return buildArticleMdx({
    ...falt,
    title: en.title,
    description: en.description,
    tomorrow: en.tomorrow,
    body: en.body,
  });
}
