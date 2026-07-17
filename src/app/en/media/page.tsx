import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { MEDIA_ITEMS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Media — images from the track",
  description:
    "Images from the SRKC and the rental kart Worlds: action, podiums and preparation. Original press images are on the press page.",
  alternates: {
    canonical: "/en/media",
    languages: { "sv-SE": "/media", en: "/en/media", "x-default": "/media" },
  },
  openGraph: { locale: "en_US" },
};

export default function EnglishMediaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="heading-caps text-4xl font-extrabold text-snow sm:text-5xl">Media</h1>
        <p className="mt-3 max-w-2xl text-mist">
          From the track, the paddock and the podium. High-resolution press images are on the{" "}
          <a href="/en/press" className="text-flagblue-bright underline underline-offset-4">
            press page
          </a>
          .
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {MEDIA_ITEMS.map((item, index) => (
          <Reveal key={item.src} delayMs={Math.min(index * 50, 250)} className={item.span ?? ""}>
            <figure className="group relative aspect-square h-full w-full overflow-hidden border border-line">
              <Image
                src={item.src}
                alt={item.alt.en}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 to-transparent px-3 pb-2 pt-8 text-xs text-snow">
                {item.caption.en}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
