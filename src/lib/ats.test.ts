import { describe, expect, it } from "vitest";
import { atsReport, extractKeywords } from "./ats";

describe("extractKeywords", () => {
  it("extracts meaningful keywords and ignores stopwords", () => {
    const kw = extractKeywords(
      "Buscamos desarrollador con Node.js, TypeScript y Docker para el equipo.",
      10
    ).map((k) => k.term);
    expect(kw).toContain("node.js");
    expect(kw).toContain("typescript");
    expect(kw).toContain("docker");
    expect(kw).not.toContain("para");
  });
});

describe("atsReport", () => {
  it("scores a matching CV highly and detects present keywords", () => {
    const offer = "Desarrollador con Node.js, TypeScript, Docker y PostgreSQL.";
    const cv =
      "Experiencia con Node.js y TypeScript. Uso de Docker y bases de datos PostgreSQL. Contacto: a@b.com, +34 600 111 222. Formación: Ingeniería. Habilidades: Git.";
    const report = atsReport(offer, cv);
    expect(report.keywordScore).toBeGreaterThanOrEqual(75);
    expect(report.atsScore).toBeGreaterThan(0);
    expect(report.checks.find((c) => c.id === "email")?.ok).toBe(true);
  });

  it("flags missing keywords and matches ignoring accents/case", () => {
    const offer = "Se requiere gestión de proyectos y liderazgo de equipos.";
    const cv = "Tengo experiencia en LIDERAZGO y coordinación.";
    const report = atsReport(offer, cv);
    const missing = report.keywords.filter((k) => !k.present).map((k) => k.term);
    expect(report.keywords.find((k) => k.term === "liderazgo")?.present).toBe(true);
    expect(missing).toContain("proyectos");
  });

  it("returns a zero score when either input is empty", () => {
    expect(atsReport("", "algo").atsScore).toBe(0);
    expect(atsReport("algo", "").atsScore).toBe(0);
  });
});
