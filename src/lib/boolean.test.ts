import { describe, expect, it } from "vitest";
import { buildLinkedIn, buildXray } from "./boolean";

const input = {
  titles: "Backend developer, Ingeniero de software",
  must: "Node.js, TypeScript",
  optional: "Docker, AWS",
  exclude: "becario",
  location: "Madrid",
};

describe("buildLinkedIn", () => {
  it("combines titles with OR, musts with AND and excludes with NOT", () => {
    const q = buildLinkedIn(input);
    expect(q).toContain('("Backend developer" OR "Ingeniero de software")');
    expect(q).toContain("Node.js AND TypeScript");
    expect(q).toContain("(Docker OR AWS)");
    expect(q).toContain("NOT (becario)");
  });
});

describe("buildXray", () => {
  it("targets linkedin profiles and adds exclusions with minus", () => {
    const q = buildXray(input);
    expect(q.startsWith("site:linkedin.com/in")).toBe(true);
    expect(q).toContain("Madrid");
    expect(q).toContain("-becario");
  });
});
