"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApproachCalendar } from "@/lib/firebase/queries/calendar";
import { CalendarView } from "@/components/calendar/CalendarView";
import type { DayCounts, DayEntries } from "@/lib/firebase/queries/calendar";

export default function CalendarPage() {
  const { userId, loading: authLoading } = useAuth();
  const [counts,  setCounts]  = useState<DayCounts>({});
  const [entries, setEntries] = useState<DayEntries>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getApproachCalendar(userId)
      .then(({ counts, entries }) => {
        setCounts(counts);
        setEntries(entries);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div className="max-w-[640px]">
      <div className="mb-8">
        <p className="font-['JetBrains_Mono'] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
          FIELD LOG
        </p>
        <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-2">
          Calendar
        </h1>
        <p className="text-[#666666] text-sm">
          Every approach, mapped to the day you made it.
        </p>
      </div>

      <div className="h-px bg-[#252525] mb-8" />

      <CalendarView counts={counts} entries={entries} />
    </div>
  );
}
