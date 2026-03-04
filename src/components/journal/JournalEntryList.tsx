"use client";

import Link from "next/link";
import { format } from "date-fns";
import type { JournalEntry, Session } from "@/lib/firebase/types";
import { JournalEntryCard } from "./JournalEntryCard";

interface JournalEntryListProps {
  entries: JournalEntry[];
  sessions?: Session[];
}

function getMonthKey(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function JournalEntryList({ entries, sessions = [] }: JournalEntryListProps) {
  const sessionMap = new Map(sessions.map((s) => [s.sessionId, s.locationName || s.locationType]));

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-3">
          No entries yet
        </p>
        <p className="text-[#555555] text-sm mb-8">
          Start writing to track your reflections and progress.
        </p>
        <Link
          href="/journal/new"
          className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
        >
          + WRITE FIRST ENTRY
        </Link>
      </div>
    );
  }

  // Group by month
  const groups: Map<string, JournalEntry[]> = new Map();
  for (const entry of entries) {
    const date = entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt);
    const key = getMonthKey(date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  return (
    <div className="space-y-10">
      {[...groups.entries()].map(([month, monthEntries]) => (
        <div key={month}>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#1A1A1A]" />
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
              {month}
            </span>
            <div className="h-px flex-1 bg-[#1A1A1A]" />
          </div>

          <div>
            {monthEntries.map((entry) => (
              <JournalEntryCard
                key={entry.entryId}
                entry={entry}
                sessionName={entry.sessionId ? sessionMap.get(entry.sessionId) : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
