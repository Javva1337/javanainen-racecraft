import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Kontakt — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Kontakt",
    subtitle: "Partnerskap, press eller frågor — rickard@rickardjavanainen.se",
  });
}
