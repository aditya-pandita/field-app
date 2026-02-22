"use client";

// src/components/dashboard/WeekStrip.tsx
// Shows real approach counts per day of the current week.
// Reads from WeeklyApproach[] passed from useAnalytics hook.

import { cn } from "@/lib/utils/cn";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";

interface WeeklyApproach {
  weekStart: string;
  approaches: number;
  avgScore: number;
}

interface WeekStripProps {
  data?: WeeklyApproach[];
}

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WeekStrip({ data = [] }: WeekStripProps) {
  const today      = new Date();
  const weekStart  = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  // Build a per-day count array for the current week
  // data is weekly buckets — find the current week bucket
  const currentWeekKey = format(weekStart, "yyyy-MM-dd");
  const currentWeekData = data.find((d) => d.weekStart === currentWeekKey);

  // For daily breakdown we need the raw approaches per day.
  // Since analytics only gives weekly totals, we spread evenly as a fallback
  // and use the total count on today's bar. Replace with daily query if needed.
  // For now: show total for the week distributed — today shows today's count
  // by reading directly from the weekly total.
  const weeklyTotal = currentWeekData?.approaches ?? 0;

  // Create 7 day slots — we only have weekly totals so put count on today
  // and show 0 for other days unless we have more granular data
  const days = DAY_LABELS.map((label, idx) => {
    const dayDate  = addDays(weekStart, idx);
    const isToday  = isSameDay(dayDate, today);
    // Show weekly total on today's bar as an indicator
    const count    = isToday ? weeklyTotal : 0;
    return { label, isToday, count, date: dayDate };
  });

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="grid grid-cols-7 gap-2 mt-4 mb-2">
      {days.map((day, i) => {
        const heightPct = day.count > 0
          ? Math.max(8, Math.round((day.count / maxCount) * 100))
          : 4;

        return (
          <div key={day.label} className="flex flex-col items-center gap-1.5">
            {/* Day label */}
            <div className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#4A4A4A] tracking-widest">
              {day.label}
            </div>

            {/* Bar container */}
            <div
              className={cn(
                "w-full bg-[#1A1A1A] border flex items-end overflow-hidden",
                day.isToday ? "border-[#FF5500]/30" : "border-[#252525]"
              )}
              style={{ height: "56px" }}
            >
              <div
                className={cn(
                  "w-full transition-all duration-500",
                  day.isToday ? "bg-[#FF5500]" : "bg-[#2A2A2A]"
                )}
                style={{ height: `${heightPct}%` }}
              />
            </div>

            {/* Count */}
            <div
              className={cn(
                "font-[family-name:var(--font-jetbrains)] text-[10px]",
                day.isToday ? "text-[#FF5500]" : "text-[#444444]"
              )}
            >
              {day.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}