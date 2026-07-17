import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Press — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Press",
    subtitle: "Pressbilder i originalformat, biografi (sv/en) och faktablad inför hyrkart-VM 2026",
  });
}
