"use client";

/**
 * Ginetta G20 Cup 2011 som stat-pop: siffrorna räknas upp i gult medan
 * sektionen är pinnad (animationslagret läggs på i berättelsens scrub-steg).
 * Siffrorna är samma som i tidslinjedatan: vann 2 av 6 race, 8:a av 22 totalt
 * med bara hälften av racen körda.
 */
const GINETTA_STATS = [
  { value: 2, display: "2", label: "vinster" },
  { value: 6, display: "6", label: "race" },
  { value: 8, display: "8:a", label: "av 22 totalt" },
] as const;

export function GinettaStats() {
  return (
    <div data-ginetta className="border border-line bg-midnight-800 p-8 sm:p-12">
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Ginetta G20 Cup <span aria-hidden="true">·</span> 2011
      </p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist">
        Inhopp mitt i säsongen, som stand-in utan försäsong.
      </p>

      <dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-8">
        {GINETTA_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            <dd
              data-ginetta-value={stat.value}
              data-ginetta-display={stat.display}
              className="heading-caps tabular order-first text-5xl font-extrabold text-flagyellow sm:text-7xl"
            >
              {stat.display}
            </dd>
            <dt className="heading-caps text-[0.65rem] tracking-[0.16em] text-mist-dim sm:text-xs">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm leading-relaxed text-mist" data-ginetta-note>
        8:a av 22 förare totalt — med bara hälften av racen körda.
      </p>
    </div>
  );
}
