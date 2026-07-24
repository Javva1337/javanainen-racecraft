import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Nations Cup 2026 — lagtävlingen i hyrkart-VM, Vandel, Danmark";

export default async function Image() {
  return buildOgImage({
    title: "Nations Cup 2026",
    subtitle:
      "Lagtävlingen i hyrkart-VM · Vandel, Danmark · 25–26 juli · Sverige kör med fyra förare",
  });
}
