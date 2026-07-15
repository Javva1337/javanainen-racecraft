import { afterAll, beforeAll, describe, expect, test } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  formatDate,
  getAllArticles,
  getArticle,
  getArticleSlugs,
  readingTimeMin,
} from "./content";

let dir: string;

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-test-"));
  fs.writeFileSync(
    path.join(dir, "vm-dag-3.mdx"),
    `---
title: "Dag 3: Från P12 till P5 i regnet"
description: "Två heat, ett regnoväder."
date: 2026-07-24
category: "VM 2026"
day: 3
heatsRaced: 2
bestFinish: "P2"
standing: "P5"
nationsCup: "P3"
---

Brödtext på svenska. ${"ord ".repeat(400)}`,
  );
  fs.writeFileSync(
    path.join(dir, "vm-dag-3.en.mdx"),
    `---
title: "Day 3: From P12 to P5 in the rain"
description: "Two heats, one downpour."
date: 2026-07-24
category: "VM 2026"
day: 3
---

English body.`,
  );
  fs.writeFileSync(
    path.join(dir, "vagen-till-vandel.mdx"),
    `---
title: "Vägen till Vandel"
description: "Satsningen."
date: 2026-07-16
category: "Satsningen"
---

Text.`,
  );
  fs.writeFileSync(path.join(dir, "_mall.mdx"), `---\ntitle: "Mall"\ndate: 2026-01-01\ncategory: "VM 2026"\n---\nMall.`);
});

afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("getArticleSlugs", () => {
  test("exkluderar _utkast och .en-varianter", () => {
    expect(getArticleSlugs(dir).sort()).toEqual(["vagen-till-vandel", "vm-dag-3"]);
  });
});

describe("getArticle", () => {
  test("läser svensk frontmatter + dagens siffror", () => {
    const a = getArticle("vm-dag-3", "sv", dir)!;
    expect(a.frontmatter.title).toContain("P12 till P5");
    expect(a.frontmatter.day).toBe(3);
    expect(a.frontmatter.standing).toBe("P5");
    expect(a.isFallback).toBe(false);
  });

  test("engelsk parallellfil används när den finns", () => {
    const a = getArticle("vm-dag-3", "en", dir)!;
    expect(a.frontmatter.title).toContain("Day 3");
    expect(a.isFallback).toBe(false);
  });

  test("fallback till svenska med isFallback=true", () => {
    const a = getArticle("vagen-till-vandel", "en", dir)!;
    expect(a.frontmatter.title).toBe("Vägen till Vandel");
    expect(a.isFallback).toBe(true);
  });

  test("null för okänd slug", () => {
    expect(getArticle("finns-inte", "sv", dir)).toBeNull();
  });
});

describe("getAllArticles", () => {
  test("sorterar nyast först", () => {
    const all = getAllArticles("sv", dir);
    expect(all.map((a) => a.slug)).toEqual(["vm-dag-3", "vagen-till-vandel"]);
  });
});

describe("readingTimeMin", () => {
  test("minst 1 minut, ~200 ord/min", () => {
    expect(readingTimeMin("kort text")).toBe(1);
    expect(readingTimeMin("ord ".repeat(600))).toBe(3);
  });
});

describe("formatDate", () => {
  test("svenska och engelska månader", () => {
    expect(formatDate("2026-07-25", "sv")).toBe("25 juli 2026");
    expect(formatDate("2026-07-25", "en")).toBe("25 July 2026");
  });
});
