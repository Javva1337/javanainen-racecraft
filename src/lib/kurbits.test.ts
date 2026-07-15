import { describe, expect, test } from "vitest";
import { KURBITS_PATHS, mirrorPath } from "./kurbits";

describe("mirrorPath", () => {
  test("speglar x-koordinater kring mittaxeln", () => {
    expect(mirrorPath("M10 20 L30 40", 100)).toBe("M90 20 L70 40");
  });

  test("hanterar kubiska kurvor", () => {
    expect(mirrorPath("M0 0 C10 5 20 10 30 15", 100)).toBe(
      "M100 0 C90 5 80 10 70 15",
    );
  });

  test("dubbel spegling ger tillbaka originalet", () => {
    const d = "M234 46 C204 54 184 26 152 33";
    expect(mirrorPath(mirrorPath(d))).toBe(d);
  });
});

describe("KURBITS_PATHS", () => {
  test("innehåller motiv + speglade rankor", () => {
    expect(KURBITS_PATHS.length).toBeGreaterThan(8);
    for (const d of KURBITS_PATHS) {
      expect(d).toMatch(/^M[\d .]/);
    }
  });
});
