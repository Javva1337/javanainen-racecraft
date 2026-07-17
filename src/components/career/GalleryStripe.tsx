"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Horisontell galleristripe: på mobil (och utan JS) native swipe med
 * scroll-snap; på desktop pinnas sektionen och fortsatt scroll driver
 * stripen horisontellt ("Scrolla för att utforska").
 * Bildtexter i formatet "Plats, År" — verifierade i lib/media.ts.
 */
export type StripeItem =
  | {
      kind: "image";
      src: string;
      alt: string;
      caption: string;
    }
  | {
      kind: "stat";
      years: string;
      value: string;
      label: string;
    };

export function GalleryStripe({ items, hint }: {
  items: StripeItem[];
  hint: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = root?.querySelector<HTMLElement>("[data-stripe-track]");
      if (!root || !track) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const getDistance = () => track.scrollWidth - track.clientWidth;
        if (getDistance() <= 0) return;

        // Native swipe stängs av — scrubben tar över horisontalrörelsen
        gsap.set(track, { overflowX: "visible", scrollSnapType: "none" });
        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 15%",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) =>
              gsap.set(track, { willChange: self.isActive ? "transform" : "auto" }),
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mt-14 sm:mt-20 sm:overflow-x-clip">
      <p className="heading-caps mb-6 flex items-center gap-3 text-[0.65rem] tracking-[0.2em] text-mist-dim">
        {hint}
        <span aria-hidden="true">→</span>
      </p>
      <ul
        data-stripe-track
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-6 sm:px-6"
      >
        {items.map((item) => (
          <li
            key={item.kind === "image" ? item.src : item.value}
            className="w-[78vw] max-w-[540px] shrink-0 snap-start sm:w-[44vw]"
          >
            {item.kind === "image" ? (
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden border border-line">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, 44vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="heading-caps mt-3 text-[0.65rem] tracking-[0.18em] text-mist-dim">
                  {item.caption}
                </figcaption>
              </figure>
            ) : (
              <div className="flex aspect-[4/3] flex-col justify-center gap-3 border border-line bg-midnight-800 p-8">
                <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">{item.years}</p>
                <p className="heading-caps tabular text-5xl font-extrabold text-flagyellow sm:text-6xl">
                  {item.value}
                </p>
                <p className="text-sm leading-relaxed text-mist">{item.label}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
