import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VM 2026 — Kart World Championship, Vandel, Danmark";

export default async function Image() {
  return buildOgImage({
    title: "VM 2026",
    subtitle:
      "Kart World Championship · Vandel, Danmark · 22 juli–1 augusti · Nations Cup 25–26 juli · 180 förare",
  });
}
