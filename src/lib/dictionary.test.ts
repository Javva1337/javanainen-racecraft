import { describe, expect, test } from "vitest";
import { altLangPath, categoryLabel, DICT } from "./dictionary";

describe("altLangPath", () => {
  test("sv → en, alla statiska sidor", () => {
    expect(altLangPath("/", "en")).toBe("/en");
    expect(altLangPath("/vm-2026", "en")).toBe("/en/vm-2026");
    expect(altLangPath("/nyheter", "en")).toBe("/en/news");
    expect(altLangPath("/karriar", "en")).toBe("/en/career");
    expect(altLangPath("/om", "en")).toBe("/en/about");
    expect(altLangPath("/partners", "en")).toBe("/en/partners");
    expect(altLangPath("/media", "en")).toBe("/en/media");
    expect(altLangPath("/kontakt", "en")).toBe("/en/contact");
    expect(altLangPath("/press", "en")).toBe("/en/press");
    expect(altLangPath("/nyheter/vm-dag-3", "en")).toBe("/en/news/vm-dag-3");
  });

  test("en → sv, alla statiska sidor", () => {
    expect(altLangPath("/en", "sv")).toBe("/");
    expect(altLangPath("/en/vm-2026", "sv")).toBe("/vm-2026");
    expect(altLangPath("/en/news", "sv")).toBe("/nyheter");
    expect(altLangPath("/en/career", "sv")).toBe("/karriar");
    expect(altLangPath("/en/about", "sv")).toBe("/om");
    expect(altLangPath("/en/partners", "sv")).toBe("/partners");
    expect(altLangPath("/en/media", "sv")).toBe("/media");
    expect(altLangPath("/en/contact", "sv")).toBe("/kontakt");
    expect(altLangPath("/en/press", "sv")).toBe("/press");
    expect(altLangPath("/en/news/vm-dag-3", "sv")).toBe("/nyheter/vm-dag-3");
  });

  test("okänd sökväg faller tillbaka på respektive startsida", () => {
    expect(altLangPath("/admin", "en")).toBe("/en");
    expect(altLangPath("/en/okand", "sv")).toBe("/");
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

describe("aktuell tävling-copy", () => {
  test("båda språken har alla nycklar för header-chip och startsideteaser", () => {
    for (const lang of ["sv", "en"] as const) {
      const nav = DICT[lang].nav.cta;
      expect(nav.before).toBeTruthy();
      expect(nav.during).toBeTruthy();
      expect(nav.after).toBeTruthy();
      expect(nav.ariaLabel).toBeTruthy();

      const home = DICT[lang].home;
      expect(home.nowKicker).toBeTruthy();
      expect(home.nowTitle).toBeTruthy();
      expect(home.nowDrawBefore).toBeTruthy();
      expect(home.nowDrawPending).toBeTruthy();
      expect(home.nowAfter).toBeTruthy();
      expect(home.nowCta).toBeTruthy();
      expect(home.heroNc).toBeTruthy();
      const done = home.nowDrawDone("A", "15:45");
      expect(done).toContain("A");
      expect(done).toContain("15:45");

      expect(home.tracksHeading).toBeTruthy();
      expect(home.tracksIntro).toBeTruthy();
      expect(home.tracksOnboard).toBeTruthy();
      expect(home.tracksMore).toBeTruthy();

      const live = DICT[lang].live;
      expect(live.heading).toBeTruthy();
      expect(live.timingLabel).toBeTruthy();
      expect(live.timingDesc).toBeTruthy();
      expect(live.broadcastLabel).toBeTruthy();
      expect(live.broadcastDesc).toBeTruthy();
    }
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
