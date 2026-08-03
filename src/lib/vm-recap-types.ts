/**
 * Rena typer för VM-recapen, utan node:fs-beroenden — delas mellan
 * vm-recap.ts (serverdata) och chart-geometry.ts (klientsäker geometri).
 */
export type RecapDay = {
  day: number;
  slug: string;
  title: string;
  bestFinish: string | null;
  standing: number;
  podium: boolean;
};

export type VmRecapData = {
  nationsCup: { position: string; slug: string };
  days: RecapDay[];
  stats: {
    finalStanding: number;
    fieldSize: number;
    heatsRaced: number;
    podiums: number;
  };
};
