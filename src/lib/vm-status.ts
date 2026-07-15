import fs from "node:fs";
import path from "node:path";

/**
 * Aktuell VM-ställning under tävlingsveckan. Uppdateras för hand i
 * content/vm-status.json efter varje tävlingsdag.
 */
export type VmStatus = {
  heatsRaced: number;
  bestFinish: string;
  standing: string;
  nationsCupPosition: string;
  /** ISO-datum/tid för senaste uppdatering */
  updatedAt: string;
};

const STATUS_PATH = path.join(process.cwd(), "content", "vm-status.json");

export function getVmStatus(): VmStatus | null {
  if (!fs.existsSync(STATUS_PATH)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(STATUS_PATH, "utf8")) as VmStatus;
    if (typeof parsed.heatsRaced !== "number" || !parsed.updatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}
