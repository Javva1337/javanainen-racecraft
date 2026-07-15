import { KURBITS_PATHS, KURBITS_VIEWBOX } from "@/lib/kurbits";

type KurbitsProps = {
  className?: string;
};

/** Kurbits-motivet som inline-SVG (strokes i currentColor). */
export function Kurbits({ className }: KurbitsProps) {
  return (
    <svg
      viewBox={KURBITS_VIEWBOX}
      className={className}
      aria-hidden="true"
      fill="none"
      role="presentation"
    >
      {KURBITS_PATHS.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** Sektionsavdelare: tunn linje med kurbits-motivet i mitten. */
export function KurbitsDivider({ className = "" }: KurbitsProps) {
  return (
    <div
      className={`flex items-center gap-6 text-flagblue ${className}`}
      aria-hidden="true"
    >
      <div className="h-px flex-1 bg-line" />
      <Kurbits className="h-8 w-60 shrink-0 opacity-80" />
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}
