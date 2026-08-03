import { describe, expect, it } from "vitest";
import type { Article } from "./content";
import type { VmStatus } from "./vm-status";
import { buildVmRecap, parsePlacement } from "./vm-recap";

/** Minsta möjliga artikel — bara fälten recapen läser. */
function article(fm: {
  day?: number;
  bestFinish?: string;
  standing?: string;
  title?: string;
  slug?: string;
}): Article {
  return {
    slug: fm.slug ?? `vm-dag-${fm.day}`,
    lang: "sv",
    isFallback: false,
    frontmatter: {
      title: fm.title ?? `Dag ${fm.day}`,
      description: "",
      date: "2026-07-28",
      category: "VM 2026",
      day: fm.day,
      bestFinish: fm.bestFinish,
      standing: fm.standing,
    },
    body: "",
    readingTimeMin: 1,
  };
}

const STATUS: VmStatus = {
  heatsRaced: 9,
  bestFinish: "P2",
  standing: "P41",
  nationsCupPosition: "14:e av 32",
  updatedAt: "2026-08-01",
};

const WEEK: Article[] = [
  article({ day: 11, standing: "P41", slug: "vm-dag-11-vm-over-41a-av-180" }),
  article({ day: 9, bestFinish: "P2", standing: "P37" }),
  article({ day: 7, bestFinish: "P6", standing: "P67" }),
  article({ day: 10, bestFinish: "P3", standing: "P37" }),
  article({ day: 8, bestFinish: "P3", standing: "P54" }),
  // NC-rapport dag 4 — får inte hamna i kurvan
  article({ day: 4, standing: "P6" }),
  // artikel utan day — ignoreras
  article({ day: undefined, slug: "vagen-till-vandel" }),
];

describe("parsePlacement", () => {
  it("tolkar P-prefix och rena tal", () => {
    expect(parsePlacement("P67")).toBe(67);
    expect(parsePlacement("41")).toBe(41);
  });
  it("returnerar null för skräp", () => {
    expect(parsePlacement("semifinal")).toBeNull();
    expect(parsePlacement("")).toBeNull();
  });
});

describe("buildVmRecap", () => {
  it("tar bara med individuella dagar (≥7), i stigande ordning", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.days.map((d) => d.day)).toEqual([7, 8, 9, 10, 11]);
    expect(recap?.days.map((d) => d.standing)).toEqual([67, 54, 37, 37, 41]);
  });
  it("flaggar pallplatsdagar och räknar dem", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.days.map((d) => d.podium)).toEqual([false, true, true, true, false]);
    expect(recap?.stats.podiums).toBe(3);
  });
  it("hämtar stats ur status + sista dagen", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.stats).toEqual({
      finalStanding: 41,
      fieldSize: 180,
      heatsRaced: 9,
      podiums: 3,
    });
    expect(recap?.nationsCup).toEqual({
      position: "14:e av 32",
      slug: "nations-cup-finalen",
    });
  });
  it("dag utan bestFinish får null och räknas inte som pallplats", () => {
    const recap = buildVmRecap(WEEK, STATUS);
    expect(recap?.days.at(-1)?.bestFinish).toBeNull();
  });
  it("returnerar null utan status eller utan dagar", () => {
    expect(buildVmRecap(WEEK, null)).toBeNull();
    expect(buildVmRecap([], STATUS)).toBeNull();
  });
});
