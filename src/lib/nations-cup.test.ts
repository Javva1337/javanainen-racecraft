import { describe, expect, it } from "vitest";
import {
  isSwedenRow,
  NC_FAQ,
  NC_SCHEDULE,
  TRACK_LAYOUTS,
  type NcScheduleRow,
} from "./nations-cup";

describe("TRACK_LAYOUTS", () => {
  it("har unika id:n och bildvägar under /images/banor/", () => {
    const ids = TRACK_LAYOUTS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const layout of TRACK_LAYOUTS) {
      expect(layout.image).toMatch(/^\/images\/banor\/.+\.png$/);
      expect(layout.alt.length).toBeGreaterThan(0);
      expect(layout.width).toBeGreaterThan(0);
      expect(layout.height).toBeGreaterThan(0);
    }
  });
});

describe("NC_SCHEDULE", () => {
  it("har rader med giltigt tidsformat", () => {
    for (const day of NC_SCHEDULE) {
      expect(day.rows.length).toBeGreaterThan(0);
      for (const row of day.rows) {
        expect(row.time).toMatch(/^\d{2}:\d{2}(–\d{2}:\d{2})?$/);
        expect(row.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("har exakt en semifinal per grupp", () => {
    const groups = NC_SCHEDULE.flatMap((d) => d.rows)
      .map((r) => r.group)
      .filter(Boolean);
    expect(groups.sort()).toEqual(["A", "B"]);
  });
});

describe("isSwedenRow", () => {
  const semiA: NcScheduleRow = { time: "15:45–17:45", label: "Semifinal A", sweden: true, group: "A" };
  const semiB: NcScheduleRow = { time: "18:10–20:10", label: "Semifinal B", sweden: true, group: "B" };
  const draw: NcScheduleRow = { time: "09:30", label: "Lottning", sweden: true };
  const briefing: NcScheduleRow = { time: "15:00", label: "Förarbriefing" };

  it("markerar båda semifinalerna före lottningen", () => {
    expect(isSwedenRow(semiA, null)).toBe(true);
    expect(isSwedenRow(semiB, null)).toBe(true);
  });

  it("markerar bara Sveriges semifinal efter lottningen", () => {
    expect(isSwedenRow(semiA, "A")).toBe(true);
    expect(isSwedenRow(semiB, "A")).toBe(false);
    expect(isSwedenRow(semiA, "B")).toBe(false);
    expect(isSwedenRow(semiB, "B")).toBe(true);
  });

  it("låter grupplösa rader behålla sin markering och omarkerade vara omarkerade", () => {
    expect(isSwedenRow(draw, null)).toBe(true);
    expect(isSwedenRow(draw, "A")).toBe(true);
    expect(isSwedenRow(briefing, null)).toBe(false);
  });
});

describe("NC_FAQ", () => {
  it("har icke-tomma frågor och svar (matas in i FAQPage-schemat)", () => {
    expect(NC_FAQ.length).toBeGreaterThanOrEqual(4);
    for (const item of NC_FAQ) {
      expect(item.q.trim().length).toBeGreaterThan(0);
      expect(item.a.trim().length).toBeGreaterThan(0);
    }
  });
});
