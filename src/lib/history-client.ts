// Client-side history store with graceful degradation.
//
// It first tries the server API (Postgres via Prisma). If the server responds
// 204 the app has no database configured, so history is kept in localStorage.
// This keeps the demo working on a free, database-less deploy.

import type { Finding } from "./types";

export interface StoredAnalysis {
  id: string;
  title: string;
  inputText: string;
  score: number;
  findings: Finding[];
  createdAt: string;
  /** Where this record lives, for UI messaging. */
  source?: "db" | "local";
}

function storageKey(userId: string): string {
  return `joblens:history:${userId}`;
}

function readLocal(userId: string): StoredAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAnalysis[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(userId: string, items: StoredAnalysis[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify(items));
}

/** Simple id generator that does not depend on crypto being available. */
function localId(): string {
  return `local-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export interface SaveInput {
  title: string;
  inputText: string;
  score: number;
  findings: Finding[];
}

/** Persist an analysis. Returns the stored record and where it was saved. */
export async function saveAnalysis(
  userId: string,
  input: SaveInput
): Promise<StoredAnalysis> {
  try {
    const res = await fetch("/api/analyses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.status === 201) {
      const data = await res.json();
      return { ...data.analysis, source: "db" };
    }
  } catch {
    // Network/server issue — fall through to localStorage.
  }

  // No database (204) or an error: store locally.
  const record: StoredAnalysis = {
    id: localId(),
    title: input.title,
    inputText: input.inputText,
    score: input.score,
    findings: input.findings,
    createdAt: new Date().toISOString(),
    source: "local",
  };
  const items = readLocal(userId);
  items.unshift(record);
  writeLocal(userId, items.slice(0, 100));
  return record;
}

/** Load the full history for a user (DB when available, else localStorage). */
export async function loadHistory(userId: string): Promise<StoredAnalysis[]> {
  try {
    const res = await fetch("/api/analyses");
    if (res.status === 200) {
      const data = await res.json();
      return (data.analyses as StoredAnalysis[]).map((a) => ({
        ...a,
        source: "db",
      }));
    }
  } catch {
    // ignore, fall back to local
  }
  return readLocal(userId).map((a) => ({ ...a, source: "local" }));
}

/** Delete an analysis by id from whichever store holds it. */
export async function deleteAnalysis(
  userId: string,
  id: string
): Promise<void> {
  if (!id.startsWith("local-")) {
    try {
      await fetch(`/api/analyses?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
  }
  const items = readLocal(userId).filter((a) => a.id !== id);
  writeLocal(userId, items);
}
