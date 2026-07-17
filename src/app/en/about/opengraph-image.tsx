import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About Rickard — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "About Rickard",
    subtitle: "From Dalarna to the world stage — the story in six chapters",
  });
}
