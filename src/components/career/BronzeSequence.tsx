"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Lang } from "@/lib/dictionary";
import { STORY_FACTS } from "@/lib/results";
import { ImageReveal } from "./ImageReveal";
import { StartFieldGrid, heroTravelDelta } from "./StartFieldGrid";
import { DESKTOP_MOTION, MOBILE_MOTION } from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COPY = {
  sv: {
    act1Kicker: "Finalen",
    act1Event: "VM Italien 2016",
    heading: "Vinst i finalen",
    body: "Med samma kartar för alla avgörs finalen på det man själv gör bakom ratten. Den här gången räckte det hela vägen.",
    imgAlt: "Prispallen i VM 2016 — Rickard Javanainen överst med svenska flaggan",
    figcaption: "Italien, 2016",
    fieldLabel: "Hela startfältet",
    drivers: "förare",
    result: "3:e",
    of: "av",
    medal: "VM-brons",
    note: "VM avgörs på hela veckans sammanlagda poäng, så trots vinsten i finalracet räckte det till tredje totalt. Samma vecka: 5:a med Sverige i lagtävlingen Nations Cup, där en miss vid ett förarbyte i depån kostade chansen till segern.",
  },
  en: {
    act1Kicker: "The final",
    act1Event: "Worlds, Italy 2016",
    heading: "Won the final",
    body: "With the same karts for everyone, the final comes down to what you do behind the wheel. This time it went all the way.",
    imgAlt: "The 2016 Worlds podium — Rickard Javanainen on top with the Swedish flag",
    figcaption: "Italy, 2016",
    fieldLabel: "The full field",
    drivers: "drivers",
    result: "3rd",
    of: "of",
    medal: "Worlds bronze",
    note: "The same championship: 5th with Sweden in the Nations Cup, where a pit-stop mistake cost the team a shot at the win.",
  },
} as const;

/**
 * Berättelsens klimax i två akter.
 *  Desktop: sektionen pinnas och scrollen driver hela förloppet — understryk-
 *  ningen ritas, akt 1 lämnar, startfältet tänds rad för rad, den gula punkten
 *  vandrar till P3 och "3:e av 102" tar över.
 *  Mobil: inga pins — in-view-reveals i förenklad form.
 *  Reduced motion/utan JS: båda akterna statiska och fullt läsbara (server-
 *  renderade slutlägen; alla startlägen sätts av JS inuti matchMedia).
 */
export function BronzeSequence({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const act1 = root.querySelector<HTMLElement>("[data-bronze-act1]");
      const act2 = root.querySelector<HTMLElement>("[data-bronze-act2]");
      const underline = root.querySelector<HTMLElement>("[data-bronze-underline]");
      const rows = root.querySelectorAll<SVGGElement>("[data-field-row]");
      const heroDot = root.querySelector<SVGCircleElement>("[data-field-hero]");
      const result = root.querySelector<HTMLElement>("[data-bronze-result]");
      const medal = root.querySelector<HTMLElement>("[data-bronze-medal]");
      const note = root.querySelector<HTMLElement>("[data-bronze-note]");
      if (!act1 || !act2 || !underline || !heroDot || !result || !medal || !note) return;

      const travel = heroTravelDelta();
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        // Scenläge: akt 2 bär höjden, akt 1 ligger ovanpå tills scrubben växlar
        gsap.set(root, {
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        });
        gsap.set(act1, { position: "absolute", left: 0, right: 0, top: "50%", yPercent: -50 });
        gsap.set(act2, { autoAlpha: 0, y: 48, marginTop: 0 });
        gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(rows, { opacity: 0.12 });
        gsap.set(heroDot, { x: travel.x, y: travel.y });
        gsap.set([result, medal, note], { autoAlpha: 0, y: 28 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onToggle: (self) =>
              gsap.set([act1, act2], {
                willChange: self.isActive ? "transform, opacity" : "auto",
              }),
          },
        });

        tl
          // Akt 1: understrykningen ritas ut, sekvensen vilar på finalbilden
          .to(underline, { scaleX: 1, duration: 0.16, ease: "power2.out" })
          .to({}, { duration: 0.12 })
          // Växling akt 1 → akt 2
          .to(act1, { autoAlpha: 0, y: -44, duration: 0.14 })
          .to(act2, { autoAlpha: 1, y: 0, duration: 0.14 }, "<0.05")
          // Startfältet tänds rad för rad medan den gula punkten vandrar
          .to(rows, { opacity: 0.7, duration: 0.28, stagger: 0.05 })
          .to(heroDot, { x: 0, y: 0, duration: 0.34 }, "<")
          .to(heroDot, { attr: { r: 7 }, duration: 0.04, ease: "power1.out" })
          .to(heroDot, { attr: { r: 4.5 }, duration: 0.05, ease: "power1.inOut" })
          // Facit: 3:e av 102 — VM-brons
          .to(result, { autoAlpha: 1, y: 0, duration: 0.13, ease: "power2.out" }, "-=0.02")
          .to(medal, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, "<0.05")
          .to(note, { autoAlpha: 1, y: 0, duration: 0.1 }, "<0.05");
      });

      mm.add(MOBILE_MOTION, () => {
        // Förenklad form: korta in-view-reveals, ingen pinning
        gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(rows, { opacity: 0.12 });
        gsap.set(heroDot, { x: travel.x, y: travel.y });
        gsap.set([result, medal], { autoAlpha: 0, y: 20 });

        gsap.to(underline, {
          scaleX: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: act1, start: "top 72%" },
        });

        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: act2, start: "top 75%" },
          })
          .to(rows, { opacity: 0.7, duration: 0.5, stagger: 0.06 })
          .to(heroDot, { x: 0, y: 0, duration: 0.7, ease: "power2.inOut" }, "<")
          .to(result, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.2")
          .to(medal, { autoAlpha: 1, y: 0, duration: 0.35 }, "<0.1");
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mt-14 sm:mt-20">
      {/* Akt 1 — finalen */}
      <div data-bronze-act1 className="grid items-center gap-10 sm:grid-cols-2 sm:gap-14">
        <div>
          <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
            {t.act1Kicker} <span aria-hidden="true">·</span> {t.act1Event}
          </p>
          <h3 className="heading-caps mt-4 inline-block text-4xl font-extrabold leading-[0.95] text-snow sm:text-6xl">
            {t.heading}
            <span
              data-bronze-underline
              className="mt-3 block h-1 w-full bg-flagyellow"
              aria-hidden="true"
            />
          </h3>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            {t.body}
          </p>
        </div>
        <figure>
          <ImageReveal className="aspect-[4/3] border border-line">
            <Image
              src="/images/gallery-3.jpg"
              alt={t.imgAlt}
              width={1230}
              height={816}
              sizes="(max-width: 640px) 92vw, 45vw"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
          <figcaption className="heading-caps mt-3 text-[0.65rem] tracking-[0.18em] text-mist-dim">
            {t.figcaption}
          </figcaption>
        </figure>
      </div>

      {/* Akt 2 — startfältet och facit */}
      <div data-bronze-act2 className="mt-24 sm:mt-32">
        <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
          {t.fieldLabel} <span aria-hidden="true">·</span> {STORY_FACTS.field2016} {t.drivers}
        </p>
        <StartFieldGrid lang={lang} className="mt-8 w-full max-w-3xl" />

        <p data-bronze-result className="mt-10 flex flex-wrap items-baseline gap-x-5">
          <span className="heading-caps tabular text-[clamp(4.5rem,15vw,10rem)] font-extrabold leading-none text-flagyellow">
            {t.result}
          </span>
          <span className="heading-caps tabular text-2xl font-bold text-mist sm:text-4xl">
            {t.of} {STORY_FACTS.field2016}
          </span>
        </p>
        <p
          data-bronze-medal
          className="heading-caps mt-3 text-xl font-bold tracking-[0.08em] text-snow sm:text-3xl"
        >
          {t.medal}
        </p>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-mist" data-bronze-note>
          {t.note}
        </p>
      </div>
    </div>
  );
}
