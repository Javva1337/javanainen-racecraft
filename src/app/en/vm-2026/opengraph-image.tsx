import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Worlds 2026 — Kart World Championship, Vandel, Denmark";

export default async function Image() {
  return buildOgImage({
    title: "Worlds 2026",
    subtitle:
      "Kart World Championship · Vandel, Denmark · 22 July–1 August · Nations Cup 25–26 July · 180 drivers",
  });
}
