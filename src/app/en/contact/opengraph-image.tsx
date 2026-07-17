import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Contact",
    subtitle: "Partnerships, press or anything else — I answer personally",
  });
}
