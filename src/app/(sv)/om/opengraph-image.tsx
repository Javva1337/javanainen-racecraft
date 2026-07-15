import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Om Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Om Rickard",
    subtitle: "Från gokart i Dalarna till VM-brons i hyrkart — storyn i sex kapitel",
  });
}
