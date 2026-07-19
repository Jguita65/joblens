// Builds boolean search strings for sourcing candidates on LinkedIn or Google.

export interface BooleanInput {
  titles: string;
  must: string;
  optional: string;
  exclude: string;
  location: string;
}

export function parseTerms(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function quote(term: string): string {
  return /\s/.test(term) ? `"${term}"` : term;
}

function orGroup(terms: string[]): string {
  return `(${terms.map(quote).join(" OR ")})`;
}

export function buildLinkedIn(input: BooleanInput): string {
  const titles = parseTerms(input.titles);
  const must = parseTerms(input.must);
  const optional = parseTerms(input.optional);
  const exclude = parseTerms(input.exclude);

  const parts: string[] = [];
  if (titles.length) parts.push(orGroup(titles));
  if (must.length) parts.push(must.map(quote).join(" AND "));
  if (optional.length) parts.push(orGroup(optional));

  let query = parts.join(" AND ");
  if (exclude.length) query += ` NOT ${orGroup(exclude)}`;
  return query.trim();
}

export function buildXray(input: BooleanInput): string {
  const titles = parseTerms(input.titles);
  const must = parseTerms(input.must);
  const exclude = parseTerms(input.exclude);
  const location = input.location.trim();

  const parts = ["site:linkedin.com/in"];
  if (titles.length) parts.push(orGroup(titles));
  if (must.length) parts.push(must.map(quote).join(" "));
  if (location) parts.push(quote(location));
  for (const e of exclude) parts.push(`-${quote(e)}`);
  return parts.join(" ").trim();
}
