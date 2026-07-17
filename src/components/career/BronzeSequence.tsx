"use client";

import Image from "next/image";
import { ImageReveal } from "./ImageReveal";
import { StartFieldGrid } from "./StartFieldGrid";

/**
 * Berättelsens klimax i två akter (pinnad scrub-sekvens läggs på i
 * animationssteget):
 *  Akt 1 — "Vinst i finalen" med finalbilden och gul understrykning.
 *  Akt 2 — startfältsvisualiseringen: 102 punkter, den gula vandrar till P3.
 * Statiskt/utan JS visas båda akterna i följd, fullt läsbara.
 */
export function BronzeSequence() {
  return (
    <div data-bronze className="mt-14 sm:mt-20">
      {/* Akt 1 — finalen */}
      <div data-bronze-act1 className="grid items-center gap-10 sm:grid-cols-2 sm:gap-14">
        <div>
          <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
            Finalen <span aria-hidden="true">·</span> VM Italien 2016
          </p>
          <h3 className="heading-caps mt-4 inline-block text-4xl font-extrabold leading-[0.95] text-snow sm:text-6xl">
            Vinst i finalen
            <span
              data-bronze-underline
              className="mt-3 block h-1 w-full origin-left bg-flagyellow"
              aria-hidden="true"
            />
          </h3>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Med samma kartar för alla avgörs finalen på det man själv gör bakom ratten. Den här
            gången räckte det hela vägen.
          </p>
        </div>
        <figure>
          <ImageReveal className="aspect-[4/3] border border-line">
            <Image
              src="/images/gallery-3.jpg"
              alt="Prispallen i VM 2016 — Rickard Javanainen överst med svenska flaggan"
              width={1230}
              height={816}
              sizes="(max-width: 640px) 92vw, 45vw"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
          <figcaption className="heading-caps mt-3 text-[0.65rem] tracking-[0.18em] text-mist-dim">
            Italien, 2016
          </figcaption>
        </figure>
      </div>

      {/* Akt 2 — startfältet och facit */}
      <div data-bronze-act2 className="mt-24 sm:mt-32">
        <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
          Hela startfältet <span aria-hidden="true">·</span> 102 förare
        </p>
        <StartFieldGrid className="mt-8 w-full max-w-3xl" />

        <p data-bronze-result className="mt-10 flex flex-wrap items-baseline gap-x-5">
          <span className="heading-caps tabular text-[clamp(4.5rem,15vw,10rem)] font-extrabold leading-none text-flagyellow">
            3:e
          </span>
          <span className="heading-caps tabular text-2xl font-bold text-mist sm:text-4xl">
            av 102
          </span>
        </p>
        <p
          data-bronze-medal
          className="heading-caps mt-3 text-xl font-bold tracking-[0.08em] text-snow sm:text-3xl"
        >
          VM-brons
        </p>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-mist" data-bronze-note>
          Samma mästerskap: 5:a med Sverige i Nations Cup, där en miss i ett depåstopp kostade
          chansen till segern.
        </p>
      </div>
    </div>
  );
}
