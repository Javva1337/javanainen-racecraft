import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Karriär — Rickard Javanainen";

export default async function Image() {
  return buildOgImage({
    title: "Karriär",
    subtitle: "VM-brons 2016 · 5 VM-starter · 2 SRKC-titlar · tidslinjen 2002–2026",
  });
}
