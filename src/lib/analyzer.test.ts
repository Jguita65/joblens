import { describe, expect, it } from "vitest";
import { analyze, rewrite, scoreLabel, textMetrics } from "./analyzer";

describe("analyze — scoring", () => {
  it("returns a perfect score of 100 for inclusive text with no matches", () => {
    const text =
      "Buscamos una persona para el equipo de soporte. Valoramos la experiencia y la iniciativa.";
    const result = analyze(text);
    expect(result.totalFindings).toBe(0);
    expect(result.score).toBe(100);
  });

  it("lowers the score and never drops below 0 for heavily biased text", () => {
    const text =
      "Se busca hombre joven, soltero, con foto obligatoria, sin discapacidad y máxima disponibilidad. Buscamos un ninja rockstar con capacidad de sacrificio y able-bodied. Nacionalidad española, menores de 30 años.";
    const result = analyze(text);
    expect(result.totalFindings).toBeGreaterThan(5);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThan(50);
  });
});

describe("analyze — detection", () => {
  it("detects a gendered requirement and reports offsets and category", () => {
    const text = "En nuestra empresa se busca hombre para el puesto.";
    const result = analyze(text);
    const finding = result.findings.find((f) => f.category === "gender");
    expect(finding).toBeDefined();
    expect(finding!.match.toLowerCase()).toContain("hombre");
    // Offsets must point back to the original text.
    expect(text.slice(finding!.start, finding!.end)).toBe(finding!.match);
    expect(finding!.suggestion.length).toBeGreaterThan(0);
  });

  it("detects bilingual hype jargon and counts it under 'jargon'", () => {
    const text = "We need a rockstar developer and a coding ninja.";
    const result = analyze(text);
    expect(result.counts.jargon).toBeGreaterThanOrEqual(2);
  });

  it("does not match a term embedded inside a larger word", () => {
    // "crack" is a jargon term, but "cracker" must not be flagged.
    const text = "El equipo comió galletas tipo cracker durante la reunión.";
    const result = analyze(text);
    expect(result.findings.some((f) => f.entryId === "jar-crack")).toBe(false);
  });
});

describe("rewrite", () => {
  it("replaces a gendered requirement and improves the score", () => {
    const text = "Se busca hombre para el puesto de ventas.";
    const before = analyze(text);
    const result = rewrite(text, before.findings);
    expect(result.text.toLowerCase()).not.toContain("se busca hombre");
    expect(result.text.toLowerCase()).toContain("persona");
    expect(result.score).toBeGreaterThan(before.score);
    expect(result.changes.length).toBeGreaterThan(0);
  });

  it("removes fragments with an empty replacement and cleans punctuation", () => {
    const text = "Buscamos talento joven, con foto obligatoria, para el equipo.";
    const result = rewrite(text);
    expect(result.text.toLowerCase()).not.toContain("joven");
    expect(result.text.toLowerCase()).not.toContain("foto obligatoria");
    // No dangling ", ," or double spaces left behind.
    expect(result.text).not.toMatch(/,\s*,/);
    expect(result.text).not.toMatch(/ {2,}/);
  });

  it("yields a perfect rewrite score for already-inclusive text", () => {
    const text = "Buscamos una persona con experiencia en atención al cliente.";
    const result = rewrite(text);
    expect(result.changes.length).toBe(0);
    expect(result.score).toBe(100);
  });
});

describe("textMetrics", () => {
  it("counts words and computes bias density per 100 words", () => {
    const text = "una dos tres cuatro cinco"; // 5 words
    const m = textMetrics(text, 1);
    expect(m.words).toBe(5);
    expect(m.biasDensity).toBe(20);
  });
});

describe("scoreLabel", () => {
  it("maps score ranges to qualitative labels", () => {
    expect(scoreLabel(100)).toBe("Excelente");
    expect(scoreLabel(80)).toBe("Bueno");
    expect(scoreLabel(60)).toBe("Mejorable");
    expect(scoreLabel(10)).toBe("Crítico");
  });
});
