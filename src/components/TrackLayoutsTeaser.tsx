import Image from "next/image";
import Link from "next/link";
import { DICT, type Lang } from "@/lib/dictionary";
import { TRACK_LAYOUTS } from "@/lib/nations-cup";
import { Reveal } from "./Reveal";

/**
 * Banteasern på startsidan: de två VM-layouterna med onboard-varven.
 * Hela kortet länkar till respektive YouTube-klipp — det är filmerna
 * besökarna är ute efter. Bilder och länkar bor i TRACK_LAYOUTS.
 */
export function TrackLayoutsTeaser({ lang }: { lang: Lang }) {
  const t = DICT[lang].home;
  const moreHref = lang === "sv" ? "/vm-2026/nations-cup" : "/en/vm-2026";

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
      aria-labelledby="tracks-heading"
    >
      <h2 id="tracks-heading" className="heading-caps mb-3 text-2xl font-bold text-snow">
        {t.tracksHeading}
      </h2>
      <p className="mb-8 max-w-3xl leading-relaxed text-mist">{t.tracksIntro}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {TRACK_LAYOUTS.map((layout, index) => (
          <Reveal key={layout.id} delayMs={index * 60}>
            {layout.youtubeUrl ? (
              <a
                href={layout.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-line bg-midnight-800 p-4 transition-colors duration-200 hover:border-flagyellow"
              >
                <Image
                  src={layout.image}
                  alt={layout.alt}
                  width={layout.width}
                  height={layout.height}
                  className="w-full border border-line"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="heading-caps text-lg text-snow">{layout.name}</span>
                  <span className="heading-caps flex items-center gap-2 text-xs tracking-[0.12em] text-flagyellow">
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 fill-flagyellow"
                      aria-hidden="true"
                    >
                      <path d="M2 1l9 5-9 5z" />
                    </svg>
                    {t.tracksOnboard}
                  </span>
                </div>
              </a>
            ) : (
              <div className="border border-line bg-midnight-800 p-4">
                <Image
                  src={layout.image}
                  alt={layout.alt}
                  width={layout.width}
                  height={layout.height}
                  className="w-full border border-line"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <span className="heading-caps mt-4 block text-lg text-snow">
                  {layout.name}
                </span>
              </div>
            )}
          </Reveal>
        ))}
      </div>
      <p className="mt-6">
        <Link
          href={moreHref}
          className="text-flagblue-bright underline underline-offset-4 transition-colors duration-200 hover:text-snow"
        >
          {t.tracksMore}
        </Link>
      </p>
    </section>
  );
}
