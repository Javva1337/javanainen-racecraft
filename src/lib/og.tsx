import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { KURBITS_PATHS, KURBITS_HEIGHT, KURBITS_WIDTH } from "./kurbits";

/**
 * Delad OG-bildmall (1200×630): midnattsblå botten, kurbitslinje,
 * "RICKARD JAVANAINEN · SWE". Race-rapporter med day-frontmatter får
 * "VM DAG {day}" + nyckelsiffra i flaggult + partnerlogotyper i botten.
 * Alla resurser ligger på egen domän/i egen bundle — inga externa buckets.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const COLORS = {
  midnight: "#0A1628",
  snow: "#F7F5F0",
  mist: "#A9B9CC",
  mistDim: "#7E90A8",
  flagblue: "#006AA7",
  flagyellow: "#FECC02",
};

async function readAsset(...segments: string[]): Promise<Buffer> {
  return fs.readFile(path.join(process.cwd(), ...segments));
}

async function loadFonts() {
  const [archivoBold, archivoMedium, interRegular] = await Promise.all([
    readAsset("src", "assets", "fonts", "archivo-bold.woff"),
    readAsset("src", "assets", "fonts", "archivo-medium.woff"),
    readAsset("src", "assets", "fonts", "inter-regular.woff"),
  ]);
  return [
    { name: "Archivo", data: archivoBold, weight: 700 as const, style: "normal" as const },
    { name: "Archivo", data: archivoMedium, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: interRegular, weight: 400 as const, style: "normal" as const },
  ];
}

async function loadPartnerLogos() {
  // labatus-og.svg = rensad kopia (endast synligt lager) — satori klarar inte
  // Illustrator-exportens display:none-lager
  const [labatus, primab] = await Promise.all([
    readAsset("src", "assets", "labatus-og.svg"),
    readAsset("public", "images", "partners", "primab.png"),
  ]);
  return {
    labatus: `data:image/svg+xml;base64,${labatus.toString("base64")}`,
    primab: `data:image/png;base64,${primab.toString("base64")}`,
  };
}

function KurbitsRow() {
  return (
    <svg
      viewBox={`0 0 ${KURBITS_WIDTH} ${KURBITS_HEIGHT}`}
      width={420}
      height={56}
      fill="none"
    >
      {KURBITS_PATHS.map((d, i) => (
        <path key={i} d={d} stroke={COLORS.flagblue} strokeWidth={1.6} strokeLinecap="round" />
      ))}
    </svg>
  );
}

function FlagSweOg() {
  return (
    <svg viewBox="0 0 16 10" width={29} height={18}>
      <rect width="16" height="10" fill="#006AA7" />
      <rect x="5" width="2" height="10" fill="#FECC02" />
      <rect y="4" width="16" height="2" fill="#FECC02" />
    </svg>
  );
}

export type OgOptions = {
  /** Rubrik (sidtitel eller artikelrubrik) */
  title: string;
  /** Underrad (tagline eller beskrivning) */
  subtitle?: string;
  /** VM-dag → race-rapportsläge med "VM DAG {day}" */
  day?: number;
  /** Nyckelsiffra i flaggult, t.ex. "P5" */
  keyStat?: string;
  /** Formaterat datum, t.ex. "24 juli 2026" */
  date?: string;
  /** Visa Labatus + Primab i botten (race-rapporter) */
  showPartners?: boolean;
  /** Språk för mallens fasta texter */
  lang?: "sv" | "en";
};

export async function buildOgImage(options: OgOptions): Promise<ImageResponse> {
  const { title, subtitle, day, keyStat, date, showPartners, lang = "sv" } = options;
  const dayLabel = lang === "sv" ? `VM DAG ${day}` : `WORLDS DAY ${day}`;
  const partnersLabel = lang === "sv" ? "Möjliggörs av" : "Made possible by";
  const footerLabel = lang === "sv" ? "Hyrkart-VM · Vandel 2026" : "Kart Worlds · Vandel 2026";
  const fonts = await loadFonts();
  const logos = showPartners ? await loadPartnerLogos() : null;
  const isRaceReport = typeof day === "number";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: COLORS.midnight,
          padding: "56px 72px",
          fontFamily: "Archivo",
        }}
      >
        {/* Topp: namn · flagga · SWE + kurbits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: COLORS.snow,
                  textTransform: "uppercase",
                }}
              >
                Rickard Javanainen
              </span>
              <span style={{ fontSize: 30, color: COLORS.mistDim }}>·</span>
              <FlagSweOg />
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: COLORS.mist,
                }}
              >
                SWE
              </span>
            </div>
            <KurbitsRow />
          </div>
          <div style={{ display: "flex", height: 1, backgroundColor: "#223752" }} />
        </div>

        {/* Mitten */}
        {isRaceReport ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 48,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 720 }}>
              <span
                style={{
                  fontSize: 76,
                  fontWeight: 700,
                  letterSpacing: 6,
                  color: COLORS.snow,
                  textTransform: "uppercase",
                }}
              >
                {dayLabel}
              </span>
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 500,
                  color: COLORS.mist,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </span>
              {date ? (
                <span style={{ fontSize: 26, fontFamily: "Inter", color: COLORS.mistDim }}>
                  {date}
                </span>
              ) : null}
            </div>
            {keyStat ? (
              <span
                style={{
                  fontSize: 170,
                  fontWeight: 700,
                  color: COLORS.flagyellow,
                  letterSpacing: -4,
                }}
              >
                {keyStat}
              </span>
            ) : null}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
            <span
              style={{
                fontSize: title.length > 40 ? 56 : 72,
                fontWeight: 700,
                letterSpacing: 2,
                color: COLORS.snow,
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              {title}
            </span>
            {subtitle ? (
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  color: COLORS.mist,
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </span>
            ) : null}
          </div>
        )}

        {/* Botten */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontFamily: "Inter",
              color: COLORS.mistDim,
            }}
          >
            rickardjavanainen.se
          </span>
          {logos ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span
                style={{
                  fontSize: 18,
                  letterSpacing: 3,
                  color: COLORS.mistDim,
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {partnersLabel}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logos.labatus} alt="Labatus" width={159} height={34} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: COLORS.snow,
                  borderRadius: 6,
                  padding: "10px 18px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logos.primab} alt="Primab" width={53} height={34} />
              </div>
            </div>
          ) : (
            <span
              style={{
                fontSize: 22,
                letterSpacing: 3,
                color: COLORS.mistDim,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {footerLabel}
            </span>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
