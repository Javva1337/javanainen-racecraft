import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "News — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "News",
    subtitle: "Race reports, the campaign and the road to the 2026 Kart World Championship",
  });
}
