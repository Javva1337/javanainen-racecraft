import { describe, expect, test } from "vitest";
import { altLangPath, categoryLabel, DICT } from "./dictionary";

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

describe("categoryLabel", () => {
  test("svenska returnerar nyckeln oförändrad", () => {
    expect(categoryLabel("VM 2026", "sv")).toBe("VM 2026");
    expect(categoryLabel("Satsningen", "sv")).toBe("Satsningen");
  });

  test("engelska översätter visningsnamnen", () => {
    expect(categoryLabel("VM 2026", "en")).toBe("Worlds 2026");
    expect(categoryLabel("Satsningen", "en")).toBe("The campaign");
    expect(categoryLabel("SRKC", "en")).toBe("SRKC");
    expect(categoryLabel("Partners", "en")).toBe("Partners");
  });

  test("okänd kategori faller tillbaka på nyckeln", () => {
    expect(categoryLabel("Okänd", "en")).toBe("Okänd");
  });
});

describe("contactForm-copy", () => {
  test("båda språken har alla nycklar", () => {
    for (const lang of ["sv", "en"] as const) {
      const t = DICT[lang].contactForm;
      expect(t.name).toBeTruthy();
      expect(t.send).toBeTruthy();
      expect(t.success).toBeTruthy();
      expect(t.mailtoSubject("Anna")).toContain("Anna");
    }
  });
});
