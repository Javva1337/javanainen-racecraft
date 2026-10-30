import { describe, expect, it } from "vitest";
import { cap, ordinalEn } from "./text-utils";

describe("ordinalEn", () => {
  it.each([
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [11, "11th"],
    [12, "12th"],
    [13, "13th"],
    [21, "21st"],
    [22, "22nd"],
    [101, "101st"],
    [111, "111th"],
  ])("%i -> %s", (n, expected) => {
    expect(ordinalEn(n)).toBe(expected);
  });
});

describe("cap", () => {
  it("gör första bokstaven versal", () => {
    expect(cap("tre")).toBe("Tre");
    expect(cap("")).toBe("");
  });
});
