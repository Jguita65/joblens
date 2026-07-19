// Deterministic, dependency-free bias analyzer.
//
// The engine is pure: given the same text and lexicon it always returns the
// same result. It performs NO network calls and needs NO API keys, so the demo
// can never fail and the deploy stays free.

import lexiconData from "./lexicon.json";
import type {
  AnalysisResult,
  CategoryCounts,
  CategoryKey,
  Finding,
  Lexicon,
  LexiconEntry,
  Severity,
} from "./types";

export const lexicon = lexiconData as Lexicon;

/** Penalty applied to the inclusivity score for each severity level. */
const SEVERITY_PENALTY: Record<Severity, number> = {
  1: 4,
  2: 8,
  3: 14,
};

const EMPTY_COUNTS = (): CategoryCounts => ({
  gender: 0,
  age: 0,
  ableism: 0,
  jargon: 0,
  discriminatory: 0,
  unrealistic: 0,
});

/**
 * Build the Unicode-aware regex for a lexicon entry. The entry pattern has no
 * word boundaries: we wrap it with letter lookarounds so "joven" does not match
 * inside "jovenzuelo" while still allowing punctuation and spaces around it.
 */
function buildRegex(entry: LexiconEntry): RegExp {
  return new RegExp(`(?<!\\p{L})(?:${entry.pattern})(?!\\p{L})`, "giu");
}

// Compile once at module load — the lexicon never changes at runtime.
const compiled: Array<{ entry: LexiconEntry; regex: RegExp }> = lexicon.entries.map(
  (entry) => ({ entry, regex: buildRegex(entry) })
);

/**
 * Analyze a job description and return findings, per-category counts and an
 * inclusivity score from 0 (many problems) to 100 (none detected).
 */
export function analyze(text: string): AnalysisResult {
  const findings: Finding[] = [];

  if (text && text.trim().length > 0) {
    for (const { entry, regex } of compiled) {
      regex.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(text)) !== null) {
        // Guard against zero-length matches causing an infinite loop.
        if (m[0].length === 0) {
          regex.lastIndex += 1;
          continue;
        }
        findings.push({
          entryId: entry.id,
          match: m[0],
          term: entry.term,
          category: entry.category,
          severity: entry.severity,
          explanation: entry.explanation,
          suggestion: entry.suggestion,
          start: m.index,
          end: m.index + m[0].length,
        });
      }
    }
  }

  // Order by position for stable highlighting and display.
  findings.sort((a, b) => a.start - b.start || b.end - a.end);

  const counts = EMPTY_COUNTS();
  let penalty = 0;
  for (const f of findings) {
    counts[f.category] += 1;
    penalty += SEVERITY_PENALTY[f.severity];
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    score,
    findings,
    counts,
    totalFindings: findings.length,
  };
}

/** Human-readable qualitative label for a score. */
export function scoreLabel(score: number): string {
  if (score >= 90) return "Excelente";
  if (score >= 75) return "Bueno";
  if (score >= 50) return "Mejorable";
  if (score >= 25) return "Deficiente";
  return "Crítico";
}

export function categoryLabel(category: CategoryKey): string {
  return lexicon.categories[category].label;
}

export function categoryColor(category: CategoryKey): string {
  return lexicon.categories[category].color;
}
