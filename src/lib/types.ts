// Shared domain types for JobLens.

export type CategoryKey =
  | "gender"
  | "age"
  | "ableism"
  | "jargon"
  | "discriminatory"
  | "unrealistic";

export type Severity = 1 | 2 | 3;

/** One curated lexicon entry (see src/lib/lexicon.json). */
export interface LexiconEntry {
  id: string;
  term: string;
  pattern: string;
  category: CategoryKey;
  severity: Severity;
  lang: "es" | "en";
  explanation: string;
  suggestion: string;
  /** Inclusive replacement used by the rewrite engine ("" = remove fragment). */
  replacement: string;
}

export interface CategoryMeta {
  label: string;
  color: string;
}

export interface Lexicon {
  version: string;
  note: string;
  categories: Record<CategoryKey, CategoryMeta>;
  entries: LexiconEntry[];
}

/** A single detected occurrence in the analysed text. */
export interface Finding {
  /** Matching lexicon entry id. */
  entryId: string;
  /** Exact matched substring. */
  match: string;
  /** Display term of the entry. */
  term: string;
  category: CategoryKey;
  severity: Severity;
  explanation: string;
  suggestion: string;
  /** Character offsets in the original text (start inclusive, end exclusive). */
  start: number;
  end: number;
}

/** Number of findings per category. */
export type CategoryCounts = Record<CategoryKey, number>;

export interface AnalysisResult {
  score: number;
  findings: Finding[];
  counts: CategoryCounts;
  totalFindings: number;
}

/** A single substitution applied by the rewrite engine. */
export interface RewriteChange {
  original: string;
  replacement: string;
  category: CategoryKey;
  removed: boolean;
}

export interface RewriteResult {
  /** Improved text with inclusive replacements applied. */
  text: string;
  changes: RewriteChange[];
  /** Inclusivity score of the rewritten text (0–100). */
  score: number;
}

/** Lightweight readability/bias metrics for a piece of text. */
export interface TextMetrics {
  words: number;
  characters: number;
  /** Findings per 100 words. */
  biasDensity: number;
}
