import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Press — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Press",
    subtitle: "Downloadable images, bio in English and Swedish, and a fact sheet",
  });
}
