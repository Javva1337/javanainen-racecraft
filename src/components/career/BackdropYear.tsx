/**
 * Stort bakgrundsårtal bakom kapitelinnehållet. Ren dekor (aria-hidden).
 * Parallaxen (glider långsammare än scrollen) läggs på av animationslagret
 * via data-backdrop-year; utan JS står siffran stilla.
 */
export function BackdropYear({ year, className = "" }: { year: string; className?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span
        data-backdrop-year
        className={`heading-caps tabular absolute select-none font-extrabold leading-none text-midnight-700 ${className}`}
        style={{ fontSize: "clamp(9rem, 30vw, 24rem)" }}
      >
        {year}
      </span>
    </div>
  );
}
