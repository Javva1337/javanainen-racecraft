import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Partners — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Partners",
    subtitle: "Möjliggjorde vägen till VM 2026 tillsammans med Primab och Labatus",
    showPartners: true,
  });
}
