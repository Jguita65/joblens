// Bias analyzer. Pure and deterministic: same input, same output. No network
// calls and no API keys — it works entirely off the local lexicon.

import lexiconData from "./lexicon.json";
import type {
  AnalysisResult,
  CategoryCounts,
  CategoryKey,
  Finding,
  Lexicon,
  LexiconEntry,
  RewriteChange,
  RewriteResult,
  Severity,
  TextMetrics,
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

const entryById = new Map<string, LexiconEntry>(
  lexicon.entries.map((e) => [e.id, e])
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

/**
 * Tidy up spacing/punctuation left over after removing fragments during a
 * rewrite (double spaces, dangling commas, spaces before punctuation, etc.).
 */
function cleanupText(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/\(\s*\)/g, "")
    .replace(/^[ \t]*[,;:]\s*/gm, "")
    .replace(/([-•*])\s*[,;:]\s*/g, "$1 ")
    // Collapse a word accidentally duplicated by adjacent replacements ("con con").
    .replace(/\b(\p{L}+)(\s+\1\b)+/giu, "$1")
    // Drop a dangling conjunction left before a line break or end ("... en vigor y.").
    .replace(/\s+\b(y|e|o|u|and|or)\b\s*([.\n]|$)/gi, "$2")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Produce an inclusive rewrite of the text by applying each finding's
 * replacement (or removing the fragment). Deterministic and offset-safe:
 * substitutions are applied from the end of the string backwards.
 */
/** Non-overlapping subset of findings (earliest/longest wins), sorted by start. */
function nonOverlapping(findings: Finding[]): Finding[] {
  const items = findings.slice().sort((a, b) => a.start - b.start || b.end - a.end);
  const out: Finding[] = [];
  let cursor = 0;
  for (const f of items) {
    if (f.start >= cursor) {
      out.push(f);
      cursor = f.end;
    }
  }
  return out;
}

/**
 * Apply the inclusive replacement of the given findings to the text and clean
 * up. Substitutions run from the end so earlier offsets stay valid.
 */
export function applyFindings(text: string, findings: Finding[]): string {
  const items = nonOverlapping(findings);
  let out = text;
  for (let i = items.length - 1; i >= 0; i--) {
    const f = items[i];
    const entry = entryById.get(f.entryId);
    // "__KEEP__" = detected but needs manual/AI rewriting; leave the text as is.
    if (entry?.replacement === "__KEEP__") continue;
    out = out.slice(0, f.start) + (entry ? entry.replacement : "") + out.slice(f.end);
  }
  return cleanupText(out);
}

export function rewrite(text: string, findings?: Finding[]): RewriteResult {
  const items = nonOverlapping(findings ?? analyze(text).findings);

  const changes: RewriteChange[] = items
    .filter((f) => entryById.get(f.entryId)?.replacement !== "__KEEP__")
    .map((f) => {
      const entry = entryById.get(f.entryId);
      const replacement = entry ? entry.replacement : "";
      return {
        original: f.match,
        replacement,
        category: f.category,
        removed: replacement.trim().length === 0,
      };
    });

  const cleaned = applyFindings(text, items);
  return { text: cleaned, changes, score: analyze(cleaned).score };
}

/** Basic text metrics: word/char counts and bias density per 100 words. */
export function textMetrics(text: string, totalFindings: number): TextMetrics {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const biasDensity = words > 0 ? (totalFindings / words) * 100 : 0;
  return {
    words,
    characters: text.length,
    biasDensity: Math.round(biasDensity * 10) / 10,
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
