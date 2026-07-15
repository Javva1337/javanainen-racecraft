import { KWC } from "./site";

/**
 * Lägeslogik för hero och VM-hubb:
 *  - "before": före 22 juli 2026 → countdown till Nations Cup
 *  - "during": 22 juli–1 augusti 2026 → "VM pågår — läs dagens rapport →"
 *  - "after":  efter 1 augusti 2026 → "VM 2026 — så gick det →"
 */
export type SiteMode = "before" | "during" | "after";

export function getSiteMode(now: number = Date.now()): SiteMode {
  if (now < KWC.vmStart) return "before";
  if (now < KWC.vmEnd) return "during";
  return "after";
}

/** VM-dag (1-indexerad) under tävlingsveckan, annars null. */
export function getVmDay(now: number = Date.now()): number | null {
  if (getSiteMode(now) !== "during") return null;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.floor((now - KWC.vmStart) / MS_PER_DAY) + 1;
}
