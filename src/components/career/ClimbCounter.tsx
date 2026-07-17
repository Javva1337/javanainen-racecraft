"use client";

/**
 * Finalracet i VM Polen 2018: från 16:e till 9:e. Scrub-räknaren P16 → P9
 * läggs på av animationslagret; statiskt/utan JS visas slutläget P9.
 * Siffrorna är samma som i resultattabellen (lib/results.ts).
 */
export function ClimbCounter() {
  return (
    <div data-climb className="border border-line bg-midnight-800 p-8 sm:p-12">
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Finalracet <span aria-hidden="true">·</span> VM Polen 2018
      </p>
      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span
          data-climb-display
          data-climb-from="16"
          data-climb-to="9"
          className="heading-caps tabular text-[clamp(4rem,13vw,8.5rem)] font-extrabold leading-none text-flagyellow"
        >
          P9
        </span>
        <span className="heading-caps text-sm tracking-[0.12em] text-mist sm:text-lg">
          Från 16:e till 9:e i finalracet.
        </span>
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mist">
        14:e av 131 i mästerskapet totalt. 6:a med Sverige i Nations Cup.
      </p>
    </div>
  );
}
