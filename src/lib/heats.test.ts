import { describe, expect, it } from "vitest";
import {
  ALL_HEATS,
  getNextHeat,
  HEAT_DAYS,
  HEAT_FAQ,
  HEAT_SLOT_MS,
  heatDayOf,
  heatState,
} from "./heats";

/** 13:20 dansk tid 28 juli = 11:20 UTC */
const HEAT_1_START = Date.UTC(2026, 6, 28, 11, 20);

describe("HEAT_DAYS", () => {
  it("innehåller åtta heat över fyra dagar, två per dag", () => {
    expect(HEAT_DAYS).toHaveLength(4);
    expect(ALL_HEATS).toHaveLength(8);
    for (const day of HEAT_DAYS) expect(day.heats).toHaveLength(2);
  });

  it("numrerar heaten 1–8 i stigande startordning", () => {
    expect(ALL_HEATS.map((h) => h.no)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    const starts = ALL_HEATS.map((h) => h.start);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
  });

  it("växlar layout dag för dag: Classic dag 1 och 3, New 23 dag 2 och 4", () => {
    expect(HEAT_DAYS.map((d) => d.layout)).toEqual(["classic", "new23", "classic", "new23"]);
  });

  it("visningstiden stämmer med tidsstämpeln (CEST = UTC+2)", () => {
    for (const heat of ALL_HEATS) {
      const utc = new Date(heat.start);
      const hh = String(utc.getUTCHours() + 2).padStart(2, "0");
      const mm = String(utc.getUTCMinutes()).padStart(2, "0");
      expect(heat.time).toBe(`${hh}:${mm}`);
    }
  });
});

describe("getNextHeat", () => {
  it("pekar på heat 1 före VM-veckan", () => {
    expect(getNextHeat(Date.UTC(2026, 6, 27, 12, 0))?.no).toBe(1);
  });

  it("pekar på nästa heat mitt under en tävlingsdag", () => {
    /* Strax efter heat 1:s start är heat 2 nästa */
    expect(getNextHeat(HEAT_1_START + 60_000)?.no).toBe(2);
  });

  it("returnerar null när alla heat är körda", () => {
    expect(getNextHeat(Date.UTC(2026, 7, 1, 12, 0))).toBeNull();
  });
});

describe("heatState", () => {
  const heat1 = ALL_HEATS[0];

  it("är next före start, live under heatfönstret och done efteråt", () => {
    expect(heatState(heat1, HEAT_1_START - 60_000)).toBe("next");
    expect(heatState(heat1, HEAT_1_START + 60_000)).toBe("live");
    expect(heatState(heat1, HEAT_1_START + HEAT_SLOT_MS)).toBe("done");
  });

  it("markerar bara ett heat som next", () => {
    const now = HEAT_1_START - 60_000;
    const states = ALL_HEATS.map((h) => heatState(h, now));
    expect(states.filter((s) => s === "next")).toHaveLength(1);
    expect(states[0]).toBe("next");
  });
});

describe("heatDayOf", () => {
  it("hittar rätt dag för varje heat", () => {
    for (const day of HEAT_DAYS) {
      for (const heat of day.heats) expect(heatDayOf(heat).day).toBe(day.day);
    }
  });
});

describe("HEAT_FAQ", () => {
  it("bygger svaret från samma data som schemat", () => {
    for (const heat of ALL_HEATS) {
      expect(HEAT_FAQ.sv.a).toContain(heat.time);
      expect(HEAT_FAQ.en.a).toContain(heat.time);
    }
    expect(HEAT_FAQ.sv.a).toContain("tisdag 28 juli");
    expect(HEAT_FAQ.en.a).toContain("Tuesday 28 July");
  });
});
