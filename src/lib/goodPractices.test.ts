import { describe, expect, it } from "vitest";
import { detectGoodPractices } from "./goodPractices";

describe("detectGoodPractices", () => {
  it("detects present practices and computes completeness", () => {
    const text =
      "Ofrecemos un salario de 30.000€, teletrabajo y flexibilidad. Somos una empresa comprometida con la igualdad de oportunidades y la diversidad.";
    const report = detectGoodPractices(text);
    const present = new Set(report.results.filter((r) => r.present).map((r) => r.id));
    expect(present.has("salary")).toBe(true);
    expect(present.has("flexibility")).toBe(true);
    expect(present.has("equal")).toBe(true);
    expect(report.present).toBeGreaterThanOrEqual(3);
    expect(report.completeness).toBe(Math.round((report.present / report.total) * 100));
  });

  it("returns zero practices for empty text", () => {
    const report = detectGoodPractices("");
    expect(report.present).toBe(0);
    expect(report.completeness).toBe(0);
  });
});
