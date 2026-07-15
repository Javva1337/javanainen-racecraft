/** Liten svensk flagga (SVG, korrekta proportioner 10:16, kors på 5:e/6:e fältet). */
export function FlagSwe({ className = "h-3 w-[19px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 10" className={className} aria-hidden="true">
      <rect width="16" height="10" fill="#006AA7" />
      <rect x="5" width="2" height="10" fill="#FECC02" />
      <rect y="4" width="16" height="2" fill="#FECC02" />
    </svg>
  );
}

/** Startlisteformatet "R. JAVANAINEN · SWE" med flagga. */
export function NationBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`heading-caps inline-flex items-center gap-2 text-xs tracking-[0.14em] text-mist ${className}`}
    >
      R. Javanainen
      <FlagSwe />
      SWE
    </span>
  );
}
