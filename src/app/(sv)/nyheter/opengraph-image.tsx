import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Nyheter — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Nyheter",
    subtitle: "Racerapporter, satsningen och vägen till hyrkart-VM 2026 — skrivna av föraren själv",
  });
}
