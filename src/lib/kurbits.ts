/**
 * Kurbits-accenten: tunt, enfärgat, linjebaserat mönster med rötter i
 * Dala-kurbits — ritat modernt/tekniskt, inte allmoge. Vänster halva är
 * handritad; höger halva speglas numeriskt så mönstret alltid är symmetriskt.
 * Samma geometri används i sajtens avdelare, footern och OG-bildmallen.
 */

export const KURBITS_WIDTH = 480;
export const KURBITS_HEIGHT = 64;
export const KURBITS_VIEWBOX = `0 0 ${KURBITS_WIDTH} ${KURBITS_HEIGHT}`;

/** Spegla en path med absoluta M/C/L-kommandon kring en vertikal mittaxel. */
export function mirrorPath(d: string, width: number = KURBITS_WIDTH): string {
  return d
    .replace(/([MCL])([^MCLZ]*)/gi, (_match, cmd: string, coords: string) => {
      const nums = coords.trim().split(/[\s,]+/).filter(Boolean).map(Number);
      const mirrored = nums.map((n, i) => {
        const isX = i % 2 === 0;
        const value = isX ? width - n : n;
        return Math.round(value * 100) / 100;
      });
      return `${cmd}${mirrored.join(" ")} `;
    })
    .trim();
}

/** Mittmotiv: stiliserad tulpan i tre delar. */
const CENTER_PATHS = [
  // mittkronblad
  "M240 46 C235 38 235 26 240 16 C245 26 245 38 240 46",
  // vänster kronblad
  "M240 46 C231 42 226 33 229 22 C236 27 240 35 240 44",
  // höger kronblad (speglas ur vänster nedan)
];

/** Vänster ranka: stam, ändspiral och två blad. */
const LEFT_PATHS = [
  // huvudstam med S-våg in mot mitten
  "M234 46 C204 54 184 26 152 33 C122 40 106 25 80 31 C62 35 48 29 34 33",
  // spiral vid stammens ände
  "M34 33 C26 35 21 31 23 26 C25 21 31 23 30 27 C29 30 26 31 24 30",
  // blad uppåt
  "M186 30 C181 21 172 18 164 21 C170 26 178 30 186 30",
  // blad nedåt
  "M124 37 C118 45 109 47 101 44 C107 39 115 36 124 37",
  // liten knopp på stammen
  "M152 33 C150 28 152 23 157 21 C158 26 156 31 152 33",
];

export const KURBITS_PATHS: string[] = [
  ...CENTER_PATHS,
  mirrorPath(CENTER_PATHS[1]),
  ...LEFT_PATHS,
  ...LEFT_PATHS.map((d) => mirrorPath(d)),
];
