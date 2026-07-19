// Build a shareable Markdown report from an analysis + rewrite.

import { lexicon, scoreLabel } from "./analyzer";
import type { AnalysisResult, RewriteResult } from "./types";

export function buildMarkdownReport(
  title: string,
  originalText: string,
  result: AnalysisResult,
  rewrite: RewriteResult
): string {
  const lines: string[] = [];
  lines.push(`# Informe de inclusividad — ${title || "Oferta de empleo"}`);
  lines.push("");
  lines.push(`Generado con JobLens.`);
  lines.push("");
  lines.push(
    `**Índice de inclusividad:** ${result.score}/100 (${scoreLabel(result.score)})`
  );
  lines.push(`**Hallazgos:** ${result.totalFindings}`);
  lines.push("");

  lines.push(`## Hallazgos por categoría`);
  for (const [key, meta] of Object.entries(lexicon.categories)) {
    const count = result.counts[key as keyof typeof result.counts];
    if (count > 0) lines.push(`- ${meta.label}: ${count}`);
  }
  lines.push("");

  if (result.findings.length > 0) {
    lines.push(`## Detalle de hallazgos`);
    result.findings.forEach((f, i) => {
      lines.push(
        `${i + 1}. **"${f.match}"** — ${lexicon.categories[f.category].label} (severidad ${f.severity})`
      );
      lines.push(`   - Por qué: ${f.explanation}`);
      lines.push(`   - Sugerencia: ${f.suggestion}`);
    });
    lines.push("");
  }

  lines.push(`## Versión reescrita (inclusiva)`);
  lines.push(`Índice tras la reescritura: ${rewrite.score}/100`);
  lines.push("");
  lines.push("```");
  lines.push(rewrite.text);
  lines.push("```");
  lines.push("");

  lines.push(`## Texto original`);
  lines.push("```");
  lines.push(originalText);
  lines.push("```");

  return lines.join("\n");
}

/** Trigger a client-side download of a text file. */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
