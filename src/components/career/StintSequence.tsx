"use client";

/**
 * Nations Cup-stinten 2015: från sist till först. Pinnad scrub-sekvens där
 * positionsmarkören klättrar genom fältet till P1 (animationslagret läggs på
 * i scrub-steget). Statiskt/utan JS visas slutläget: P1.
 *
 * TODO(Rickard): exakt startposition (antal lag i fältet) är inte verifierad —
 * därför klättrar en abstrakt stege från "sist" i stället för en numerisk
 * räknare. Kan bytas till P<antal>→P1 när siffran är bekräftad.
 */
const LADDER_STEPS = 14;

export function StintSequence() {
  return (
    <div data-stint className="mt-14 border border-line bg-midnight-800 p-8 sm:mt-20 sm:p-14">
      <p className="heading-caps text-xs tracking-[0.18em] text-mist-dim">
        Nations Cup <span aria-hidden="true">·</span> Italien 2015
      </p>

      <div className="mt-8 flex items-end gap-8 sm:gap-14">
        {/* Positionsstegen: fylls nedifrån och upp i takt med scrubben */}
        <div
          data-stint-ladder
          className="flex flex-col items-start gap-[7px] sm:gap-2"
          aria-hidden="true"
        >
          {Array.from({ length: LADDER_STEPS }, (_, i) => (
            <span
              key={i}
              data-stint-step
              className={`block h-px w-8 sm:w-12 ${i === 0 ? "bg-flagyellow" : "bg-mist-dim"}`}
            />
          ))}
        </div>

        <div>
          <span
            data-stint-display
            className="heading-caps tabular block text-[clamp(5rem,16vw,11rem)] font-extrabold leading-none text-flagyellow"
          >
            P1
          </span>
          <p
            data-stint-label
            className="heading-caps mt-4 text-sm tracking-[0.14em] text-snow sm:text-base"
          >
            En stint. Från sist till först.
          </p>
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mist" data-stint-note>
        Laget gick i mål som femma totalt.
      </p>
    </div>
  );
}
