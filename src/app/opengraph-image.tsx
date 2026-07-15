import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { TAGLINE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Rickard Javanainen · SWE — hyrkart-VM 2026";

export default async function Image() {
  return buildOgImage({
    title: "Rickard Javanainen",
    subtitle: TAGLINE.sv,
  });
}
