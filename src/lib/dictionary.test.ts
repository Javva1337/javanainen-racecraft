import { describe, expect, test } from "vitest";
import { altLangPath } from "./dictionary";

describe("altLangPath", () => {
  test("sv → en", () => {
    expect(altLangPath("/", "en")).toBe("/en");
    expect(altLangPath("/vm-2026", "en")).toBe("/en/vm-2026");
    expect(altLangPath("/nyheter", "en")).toBe("/en/news");
    expect(altLangPath("/nyheter/vm-dag-3", "en")).toBe("/en/news/vm-dag-3");
    // sidor utan engelsk motsvarighet → engelska startsidan
    expect(altLangPath("/karriar", "en")).toBe("/en");
  });

  test("en → sv", () => {
    expect(altLangPath("/en", "sv")).toBe("/");
    expect(altLangPath("/en/vm-2026", "sv")).toBe("/vm-2026");
    expect(altLangPath("/en/news", "sv")).toBe("/nyheter");
    expect(altLangPath("/en/news/vm-dag-3", "sv")).toBe("/nyheter/vm-dag-3");
  });
});
