// Professional report generation: Word (.docx) and printable PDF.
// `docx` is imported dynamically inside buildWordBlob so it stays out of the
// initial page bundle.

import { lexicon, scoreLabel } from "./analyzer";
import type { AnalysisResult, RewriteResult } from "./types";
import type { GoodPracticesReport } from "./goodPractices";

export interface ReportData {
  title: string;
  originalText: string;
  result: AnalysisResult;
  rewrite: RewriteResult;
  practices: GoodPracticesReport;
}

const BRAND = "4F46E5";

/** Build a Word document Blob from the analysis. */
export async function buildWordBlob(data: ReportData): Promise<Blob> {
  const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
  const { title, originalText, result, rewrite, practices } = data;

  const heading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 120 },
      children: [new TextRun({ text, bold: true, color: BRAND })],
    });

  const para = (children: InstanceType<typeof TextRun>[], spacing = 80) =>
    new Paragraph({ spacing: { after: spacing }, children });

  const scoreColor =
    result.score >= 75 ? "16A34A" : result.score >= 50 ? "D97706" : "DC2626";

  const children: InstanceType<typeof Paragraph>[] = [];

  // Title
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Informe de inclusividad", bold: true, color: BRAND }),
      ],
    })
  );
  children.push(
    para([
      new TextRun({ text: title || "Oferta de empleo", italics: true, color: "64748B" }),
    ])
  );
  children.push(
    para([
      new TextRun({
        text: `Generado con RecruitKit · ${new Date().toLocaleDateString("es-ES")}`,
        color: "94A3B8",
        size: 18,
      }),
    ])
  );

  // Summary
  children.push(heading("Resumen"));
  children.push(
    para([
      new TextRun({ text: "Índice de inclusividad: ", bold: true }),
      new TextRun({
        text: `${result.score}/100 (${scoreLabel(result.score)})`,
        bold: true,
        color: scoreColor,
      }),
    ])
  );
  children.push(
    para([
      new TextRun({ text: "Hallazgos detectados: ", bold: true }),
      new TextRun({ text: `${result.totalFindings}` }),
    ])
  );
  children.push(
    para([
      new TextRun({ text: "Buenas prácticas presentes: ", bold: true }),
      new TextRun({ text: `${practices.present}/${practices.total}` }),
    ])
  );

  // Findings by category
  children.push(heading("Hallazgos por categoría"));
  for (const [key, meta] of Object.entries(lexicon.categories)) {
    const count = result.counts[key as keyof typeof result.counts];
    if (count > 0) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: `${meta.label}: ${count}` })],
        })
      );
    }
  }

  // Detailed findings
  if (result.findings.length > 0) {
    children.push(heading("Detalle de hallazgos"));
    result.findings.forEach((f, i) => {
      children.push(
        para([
          new TextRun({ text: `${i + 1}. "${f.match}" `, bold: true }),
          new TextRun({
            text: `— ${lexicon.categories[f.category].label} (severidad ${f.severity})`,
            color: "64748B",
          }),
        ])
      );
      children.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "Por qué: ", bold: true }),
            new TextRun({ text: f.explanation }),
          ],
        })
      );
      children.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Sugerencia: ", bold: true, color: "16A34A" }),
            new TextRun({ text: f.suggestion }),
          ],
        })
      );
    });
  }

  // Good practices
  children.push(heading("Buenas prácticas"));
  for (const r of practices.results) {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({
            text: `${r.present ? "✓" : "✗"} ${r.label}`,
            color: r.present ? "16A34A" : "DC2626",
          }),
          ...(r.present ? [] : [new TextRun({ text: ` — ${r.tip}`, color: "64748B" })]),
        ],
      })
    );
  }

  // Rewrite
  children.push(heading(`Versión reescrita (inclusiva) — índice ${rewrite.score}/100`));
  for (const line of rewrite.text.split("\n")) {
    children.push(para([new TextRun({ text: line || " " })]));
  }

  // Original
  children.push(heading("Texto original"));
  for (const line of originalText.split("\n")) {
    children.push(
      para([new TextRun({ text: line || " ", color: "94A3B8" })])
    );
  }

  const doc = new Document({
    creator: "RecruitKit",
    title: `Informe de inclusividad — ${title}`,
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}

/** Trigger a client-side download of a Blob. */
export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Build a styled HTML report and open the print dialog (save as PDF). */
export function printPdfReport(data: ReportData): void {
  const { title, originalText, result, rewrite, practices } = data;
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const scoreColor =
    result.score >= 75 ? "#16a34a" : result.score >= 50 ? "#d97706" : "#dc2626";

  const findingsHtml = result.findings
    .map(
      (f, i) => `<li><b>"${esc(f.match)}"</b> — <span style="color:#64748b">${
        lexicon.categories[f.category].label
      } (sev. ${f.severity})</span><br/>
      <span style="color:#334155">${esc(f.explanation)}</span><br/>
      <span style="color:#16a34a"><b>Sugerencia:</b> ${esc(f.suggestion)}</span></li>`
    )
    .join("");

  const practicesHtml = practices.results
    .map(
      (r) =>
        `<li style="color:${r.present ? "#16a34a" : "#dc2626"}">${
          r.present ? "✓" : "✗"
        } ${esc(r.label)}${r.present ? "" : ` — <span style="color:#64748b">${esc(r.tip)}</span>`}</li>`
    )
    .join("");

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"/>
  <title>Informe de inclusividad — ${esc(title)}</title>
  <style>
    body{font-family:Segoe UI,system-ui,sans-serif;color:#0f172a;max-width:820px;margin:32px auto;padding:0 24px;line-height:1.5}
    h1{color:#4f46e5;margin-bottom:4px}
    h2{color:#4f46e5;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-top:28px}
    .muted{color:#94a3b8}.score{font-size:20px;font-weight:700;color:${scoreColor}}
    pre{white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-family:inherit}
    ul{padding-left:18px}li{margin-bottom:8px}
  </style></head><body>
  <h1>Informe de inclusividad</h1>
  <p class="muted"><i>${esc(title || "Oferta de empleo")}</i> · Generado con RecruitKit</p>
  <h2>Resumen</h2>
  <p>Índice de inclusividad: <span class="score">${result.score}/100 (${scoreLabel(
    result.score
  )})</span></p>
  <p>Hallazgos: <b>${result.totalFindings}</b> · Buenas prácticas: <b>${
    practices.present
  }/${practices.total}</b></p>
  <h2>Detalle de hallazgos</h2><ul>${findingsHtml || "<li>Sin hallazgos.</li>"}</ul>
  <h2>Buenas prácticas</h2><ul>${practicesHtml}</ul>
  <h2>Versión reescrita (inclusiva) — índice ${rewrite.score}/100</h2>
  <pre>${esc(rewrite.text)}</pre>
  <h2>Texto original</h2><pre class="muted">${esc(originalText)}</pre>
  <script>window.onload=function(){window.print();}</script>
  </body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
