import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { STORY_FACTS } from "@/lib/results";
import { KWC, PARTNERS } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { TrackLayoutsTeaser } from "@/components/TrackLayoutsTeaser";

/**
 * Startsidans kapitel ovanpå det fasta fältet:
 * Läser racet → Brons 2016 → Vandel 2026 → Banor → Partners.
 * Rubriken står kvar (sticky) medan innehållet rullar förbi.
 * Fakta hämtas från samma källor som resten av sajten (site.ts/results.ts).
 */

function Chapter({
  id,
  no,
  kicker,
  title,
  children,
}: {
  id: string;
  no: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto grid min-h-[100svh] max-w-6xl content-center gap-10 px-4 py-24 sm:px-6 md:grid-cols-[5fr_7fr] md:gap-16"
    >
      <div className="self-start md:sticky md:top-28">
        <span
          aria-hidden="true"
          className="heading-caps block text-7xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-signal)] sm:text-8xl"
        >
          {no}
        </span>
        <p className="hud-corner mt-4 !text-timing">{kicker}</p>
        <h2
          id={`${id}-title`}
          className="heading-caps mt-3 text-3xl font-extrabold leading-[1.02] text-snow sm:text-5xl"
        >
          {title}
        </h2>
      </div>
      <div className="flex flex-col justify-center gap-8">{children}</div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Reveal>
      <p className="heading-caps tabular text-5xl font-extrabold leading-none text-snow sm:text-7xl">
        {value}
      </p>
      <p className="hud-corner mt-3 border-l-2 border-signal pl-3">{label}</p>
    </Reveal>
  );
}

export function Chapters({
  latest,
  vmHref,
}: {
  latest: Article | null;
  vmHref: string;
}) {
  return (
    <>
      <Chapter id="laser-racet" no="01" kicker="Racecraft" title="Läser racet">
        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-snow sm:text-xl">
            I hyrkart-VM kör alla med likvärdiga kartar. Det gör att förarens beslut, tempo och
            precision avgör.
          </p>
        </Reveal>
        <Reveal delayMs={80}>
          <p className="max-w-xl leading-relaxed text-mist">
            Racet avgörs lika mycket i huvudet som med gaspedalen. Rätt beslut i rätt läge, race
            efter race. När alla kör likvärdiga kartar är det ofta det som skiljer.
          </p>
        </Reveal>
      </Chapter>

      <Chapter id="brons-2016" no="02" kicker="Italien · 2016" title="VM-brons 2016">
        <Stat value={`3:a av ${STORY_FACTS.field2016}`} label="Totalt i hyrkart-VM" />
        <Reveal delayMs={80}>
          <p className="max-w-xl border-l-2 border-signal pl-4 leading-relaxed text-mist">
            2016 vann jag finalracet, och eftersom titeln avgörs på hela veckans poäng räckte det
            till en tredjeplats av 102 förare totalt. Jag nådde även final 2015, 2017 och 2018.
          </p>
        </Reveal>
      </Chapter>

      <Chapter id="vandel-2026" no="03" kicker="Vandel · Danmark · 2026" title="VM i Vandel 2026">
        <Stat value={KWC.result2026.sv} label="Kart World Championship 2026" />
        <Reveal delayMs={80}>
          <p className="max-w-xl leading-relaxed text-mist">
            Kart World Championship kördes på Vandel Kart i Danmark 22 juli–1 augusti 2026. Jag tog
            tre pallplatser i kvalheaten, nådde semifinal och slutade 41:a totalt.
          </p>
        </Reveal>
        <Reveal delayMs={120}>
          <div className="flex flex-wrap gap-3">
            <Link href={vmHref} className="btn btn-primary">
              VM 2026 — så gick det
            </Link>
            {latest && (
              <Link href={`/nyheter/${latest.slug}`} className="btn btn-secondary">
                Senaste rapporten
              </Link>
            )}
          </div>
        </Reveal>
      </Chapter>

      {/* Banor: ljus kapiteltoning, hela bredden täcker fältet */}
      <div id="banor" className="tone-paper">
        <TrackLayoutsTeaser lang="sv" />
      </div>

      <section
        id="partners"
        aria-label="Partners"
        className="mx-auto flex min-h-[60svh] max-w-6xl items-center px-4 py-24 sm:px-6"
      >
        <div className="flex w-full flex-col items-center gap-8 text-center">
          <p className="hud-corner">VM-satsningen möjliggjordes av</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-6 py-4 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] ${
                  partner.chip === "light" ? "bg-snow" : "border border-line"
                }`}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </a>
            ))}
          </div>
          <Link href="/partners" className="btn btn-secondary">
            Se möjligheter som partner
          </Link>
        </div>
      </section>
    </>
  );
}
