import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../client";
import type { Approach } from "../types";

export interface CalendarApproach {
  approachId:   string;
  sessionId:    string;
  outcome:      string;
  phaseReached: string;
  scoreOverall: number;
  loggedAt:     Date;
  tags:         string[];
}

export type DayCounts  = Record<string, number>;               // "2025-06-14" → 3
export type DayEntries = Record<string, CalendarApproach[]>;   // "2025-06-14" → [...]

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Fetches all approaches for a user and returns two maps:
 *   counts  — date string → number of approaches
 *   entries — date string → array of CalendarApproach
 *
 * Fetches once per userId; caller is responsible for caching.
 */
export async function getApproachCalendar(userId: string): Promise<{
  counts:  DayCounts;
  entries: DayEntries;
}> {
  if (!db) return { counts: {}, entries: {} };

  const q = query(
    collection(db, "approaches"),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  const counts:  DayCounts  = {};
  const entries: DayEntries = {};

  snap.docs.forEach((d) => {
    const data = d.data();
    const loggedAt: Date = data.loggedAt?.toDate?.() ?? new Date();
    const key = dateKey(loggedAt);

    const approach: CalendarApproach = {
      approachId:   d.id,
      sessionId:    data.sessionId   ?? "",
      outcome:      data.outcome     ?? "",
      phaseReached: data.phaseReached ?? "",
      scoreOverall: data.scoreOverall ?? 0,
      loggedAt,
      tags:         data.tags        ?? [],
    };

    counts[key]  = (counts[key] ?? 0) + 1;
    entries[key] = [...(entries[key] ?? []), approach];
  });

  return { counts, entries };
}
