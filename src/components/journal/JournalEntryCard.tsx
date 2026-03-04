"use client";

import Link from "next/link";
import { format } from "date-fns";
import type { JournalEntry } from "@/lib/firebase/types";

const MOOD_ICONS: Record<number, string> = { 1: "😔", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };

interface JournalEntryCardProps {
  entry: JournalEntry;
  sessionName?: string;
}

export function JournalEntryCard({ entry, sessionName }: JournalEntryCardProps) {
  const date = entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt);

  return (
    <Link href={`/journal/entry/${entry.entryId}`} className="block group">
      <div className="grid grid-cols-[64px_1fr] py-4 border-b border-[#1A1A1A] group-hover:border-[#2A2A2A] transition-colors items-start">
        {/* Date column */}
        <div className="flex-shrink-0">
          <div className="font-[family-name:var(--font-syne)] text-4xl font-bold text-[#333333] leading-none group-hover:text-[#444444] transition-colors">
            {date.getDate()}
          </div>
          <div className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#3A3A3A] tracking-widest uppercase mt-1">
            {format(date, "MMM yy")}
          </div>
        </div>

        {/* Content */}
        <div className="px-4">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1">
            {entry.title ? (
              <span className="font-[family-name:var(--font-syne)] text-sm font-semibold text-white leading-tight">
                {entry.title}
              </span>
            ) : (
              <span className="font-[family-name:var(--font-syne)] text-sm text-[#555555] italic">
                Untitled
              </span>
            )}
            {entry.mood !== null && (
              <span className="text-base leading-none">{MOOD_ICONS[entry.mood]}</span>
            )}
          </div>

          {/* Session badge */}
          {sessionName && (
            <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#FF5500] border border-[#FF5500]/30 px-1.5 py-0.5 uppercase tracking-widest mr-2">
              {sessionName}
            </span>
          )}

          {/* Content preview */}
          {entry.content && (
            <p className="text-[#555555] text-xs line-clamp-2 mt-1">{entry.content}</p>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] border border-[#252525] px-1.5 py-0.5 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
