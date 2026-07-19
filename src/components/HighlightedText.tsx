"use client";

import { Fragment } from "react";
import { lexicon } from "@/lib/analyzer";
import type { CategoryKey, Finding } from "@/lib/types";

interface Props {
  text: string;
  findings: Finding[];
  /** When set, marks of other categories are dimmed. */
  activeCategory?: CategoryKey | null;
}

/**
 * Render the original text with problematic fragments highlighted, one color
 * per category. Overlapping matches are resolved by keeping the first (earliest,
 * longest) one so marks never nest.
 */
export default function HighlightedText({ text, findings, activeCategory }: Props) {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < findings.length; i++) {
    const f = findings[i];
    if (f.start < cursor) continue; // overlaps a previous mark — skip

    if (f.start > cursor) {
      nodes.push(<Fragment key={`t-${i}`}>{text.slice(cursor, f.start)}</Fragment>);
    }

    const color = lexicon.categories[f.category].color;
    const dim = activeCategory ? activeCategory !== f.category : false;
    nodes.push(
      <mark
        key={`m-${i}`}
        className="jl-mark"
        data-dim={dim}
        style={{ backgroundColor: `${color}40`, boxShadow: `inset 0 -2px 0 ${color}` }}
        title={`${lexicon.categories[f.category].label} · ${f.term}\n${f.explanation}\nSugerencia: ${f.suggestion}`}
      >
        {text.slice(f.start, f.end)}
      </mark>
    );
    cursor = f.end;
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key="t-end">{text.slice(cursor)}</Fragment>);
  }

  return (
    <div className="whitespace-pre-wrap break-words leading-relaxed text-slate-800 dark:text-slate-200">
      {nodes}
    </div>
  );
}
