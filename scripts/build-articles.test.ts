import { describe, it, expect } from "vitest";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { compileArticles } from "./build-articles";

function tmpDir() { return mkdtempSync(path.join(tmpdir(), "vp-articles-")); }

describe("compileArticles", () => {
  it("parses well-formed markdown with all fields", () => {
    const dir = tmpDir();
    writeFileSync(path.join(dir, "a.md"), `---
id: ubd-money
title: Грошова допомога
category: social-protection
statuses: [UBD]
region: Полтавська область
documents: [Паспорт, IBAN]
steps: [Зібрати, Подати]
contacts: |
  ЦНАП тел. +380...
---
Тіло статті.`);
    const out = compileArticles(dir);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      id: "ubd-money", title: "Грошова допомога", category: "social-protection",
      statuses: ["UBD"], region: "Полтавська область",
      documents: ["Паспорт", "IBAN"], steps: ["Зібрати", "Подати"]
    });
    expect(out[0].body.trim()).toBe("Тіло статті.");
  });

  it("rejects malformed front-matter with a clear message", () => {
    const dir = tmpDir();
    writeFileSync(path.join(dir, "bad.md"), `---
title: No id
category: social-protection
statuses: [UBD]
---
body`);
    expect(() => compileArticles(dir)).toThrow(/bad\.md.*id/);
  });

  it("rejects unknown category", () => {
    const dir = tmpDir();
    writeFileSync(path.join(dir, "c.md"), `---
id: x
title: T
category: not-a-category
statuses: [UBD]
---
body`);
    expect(() => compileArticles(dir)).toThrow(/c\.md.*category.*not-a-category/);
  });

  it("rejects empty statuses", () => {
    const dir = tmpDir();
    writeFileSync(path.join(dir, "e.md"), `---
id: x
title: T
category: social-protection
statuses: []
---
body`);
    expect(() => compileArticles(dir)).toThrow(/e\.md.*statuses/);
  });

  it("treats missing optional fields as undefined", () => {
    const dir = tmpDir();
    writeFileSync(path.join(dir, "min.md"), `---
id: m
title: М
category: social-protection
statuses: [UBD]
---
тіло`);
    const out = compileArticles(dir);
    expect(out[0].region).toBeUndefined();
    expect(out[0].steps).toBeUndefined();
  });
});
