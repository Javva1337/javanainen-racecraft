import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Career — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Career",
    subtitle: "Worlds bronze 2016 · 5 Worlds starts · 2 SRKC titles · the timeline 2002–2026",
  });
}
