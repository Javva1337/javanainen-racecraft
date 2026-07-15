import { describe, expect, test } from "vitest";
import { getSiteMode, getVmDay } from "./mode";

const CEST = (y: number, m: number, d: number, h = 0) =>
  Date.UTC(y, m - 1, d, h - 2);

describe("getSiteMode", () => {
  test("före 22 juli 2026 → before", () => {
    expect(getSiteMode(CEST(2026, 7, 15, 12))).toBe("before");
    expect(getSiteMode(CEST(2026, 7, 21, 23))).toBe("before");
  });

  test("22 juli 00:00 CEST → during", () => {
    expect(getSiteMode(CEST(2026, 7, 22, 0))).toBe("during");
  });

  test("mitt i VM (28 juli) → during", () => {
    expect(getSiteMode(CEST(2026, 7, 28, 14))).toBe("during");
  });

  test("1 augusti 23:59 CEST → during", () => {
    expect(getSiteMode(CEST(2026, 8, 1, 23) + 59 * 60 * 1000)).toBe("during");
  });

  test("2 augusti 00:00 CEST → after", () => {
    expect(getSiteMode(CEST(2026, 8, 2, 0))).toBe("after");
  });
});

describe("getVmDay", () => {
  test("null före VM", () => {
    expect(getVmDay(CEST(2026, 7, 15))).toBeNull();
  });

  test("dag 1 den 22 juli", () => {
    expect(getVmDay(CEST(2026, 7, 22, 9))).toBe(1);
  });

  test("dag 4 den 25 juli (Nations Cup-start)", () => {
    expect(getVmDay(CEST(2026, 7, 25, 9))).toBe(4);
  });

  test("dag 11 den 1 augusti (sista dagen)", () => {
    expect(getVmDay(CEST(2026, 8, 1, 12))).toBe(11);
  });
});
