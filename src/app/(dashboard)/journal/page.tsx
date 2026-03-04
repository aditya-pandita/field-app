"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUserJournalEntries } from "@/lib/firebase/queries/journalEntries";
import { getUserSessions } from "@/lib/firebase/queries/sessions";
import { JournalEntryList } from "@/components/journal/JournalEntryList";
import PageHeader from "@/components/layout/PageHeader";
import type { JournalEntry, Session } from "@/lib/firebase/types";

export default function JournalPage() {
  const { userId, loading: authLoading } = useAuth();
  const [entries, setEntries]   = useState<JournalEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      getUserJournalEntries(userId),
      getUserSessions(userId),
    ])
      .then(([e, s]) => {
        setEntries(e);
        setSessions(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="DIARY"
        title="Journal"
        subtitle={`${entries.length} entr${entries.length === 1 ? "y" : "ies"}`}
        action={
          <Link
            href="/journal/new"
            className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
          >
            + NEW ENTRY
          </Link>
        }
      />

      <div className="h-px bg-[#1A1A1A] my-8" />

      <JournalEntryList entries={entries} sessions={sessions} />
    </div>
  );
}
