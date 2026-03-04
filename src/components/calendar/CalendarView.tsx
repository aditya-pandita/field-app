"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { DayCounts, DayEntries, CalendarApproach } from "@/lib/firebase/queries/calendar";

interface CalendarViewProps {
  counts:  DayCounts;
  entries: DayEntries;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const OUTCOME_COLORS: Record<string, string> = {
  number:       "#22C55E",
  instant_date: "#22C55E",
  social_media: "#EAB308",
  declined:     "#EF4444",
  walked_away:  "#EF4444",
  interrupted:  "#666666",
};

const OUTCOME_LABELS: Record<string, string> = {
  number:       "Number",
  instant_date: "Instant Date",
  social_media: "Social Media",
  declined:     "Declined",
  walked_away:  "Walked Away",
  interrupted:  "Interrupted",
};

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const CLOSE_OUTCOMES = new Set(["number", "instant_date"]);

function isClose(outcome: string): boolean {
  return CLOSE_OUTCOMES.has(outcome);
}

function countToIntensity(n: number): string {
  if (n === 0) return "bg-[#0D0D0D] border-[#1A1A1A]";
  if (n === 1) return "bg-[rgba(255,85,0,0.10)] border-[#7A2900]";
  if (n <= 3)  return "bg-[rgba(255,85,0,0.18)] border-[#CC4400]";
  if (n <= 6)  return "bg-[rgba(255,85,0,0.30)] border-[#FF5500]";
  return               "bg-[rgba(255,85,0,0.45)] border-[#FF5500]";
}

export function CalendarView({ counts, entries }: CalendarViewProps) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedKey(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedKey(null);
  };

  // Build grid: pad with nulls for days before the 1st
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const out: (number | null)[] = Array(firstDayOfWeek).fill(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    // Pad to complete last row
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [year, month, firstDayOfWeek, daysInMonth]);

  // Month totals for the summary strip
  const { monthTotal, monthCloses, activeDays } = useMemo(() => {
    let total   = 0;
    let closes  = 0;
    let active  = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d);
      const cnt = counts[key] ?? 0;
      total += cnt;
      if (cnt > 0) active++;
      (entries[key] ?? []).forEach((a) => { if (isClose(a.outcome)) closes++; });
    }
    return { monthTotal: total, monthCloses: closes, activeDays: active };
  }, [counts, entries, year, month, daysInMonth]);

  const selectedApproaches: CalendarApproach[] = selectedKey ? (entries[selectedKey] ?? []) : [];
  const selectedCount = selectedKey ? (counts[selectedKey] ?? 0) : 0;

  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 text-[#4A4A4A] hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <h2 className="font-['Syne'] text-2xl font-bold text-white">
            {MONTH_NAMES[month]}
          </h2>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#444444] tracking-[3px]">
            {year}
          </span>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 text-[#4A4A4A] hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Month summary strip */}
      <div className="grid grid-cols-3 gap-px bg-[#1A1A1A] mb-6">
        <div className="bg-black px-4 py-3 text-center">
          <div className="font-['Syne'] text-xl font-bold text-[#FF8C42]">{monthTotal}</div>
          <div className="font-['JetBrains_Mono'] text-[8px] text-[#444444] uppercase tracking-widest mt-0.5">
            Total
          </div>
        </div>
        <div className="bg-black px-4 py-3 text-center">
          <div className="font-['Syne'] text-xl font-bold text-[#22C55E]">{monthCloses}</div>
          <div className="font-['JetBrains_Mono'] text-[8px] text-[#444444] uppercase tracking-widest mt-0.5">
            Closed
          </div>
        </div>
        <div className="bg-black px-4 py-3 text-center">
          <div className="font-['Syne'] text-xl font-bold text-white">{activeDays}</div>
          <div className="font-['JetBrains_Mono'] text-[8px] text-[#444444] uppercase tracking-widest mt-0.5">
            Active Days
          </div>
        </div>
      </div>

      {/* Day-name header */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center font-['JetBrains_Mono'] text-[9px] text-[#333333] uppercase tracking-widest py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`pad-${idx}`} className="aspect-square" />;
          }

          const key        = dateKey(year, month, day);
          const count      = counts[key] ?? 0;
          const dayEntries = entries[key] ?? [];
          const closes     = dayEntries.filter((a) => isClose(a.outcome)).length;
          const isToday    = key === todayKey;
          const isSelected = key === selectedKey;

          return (
            <button
              key={key}
              onClick={() => setSelectedKey(isSelected ? null : key)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center border transition-all duration-150",
                countToIntensity(count),
                isSelected && "ring-1 ring-white ring-offset-1 ring-offset-black",
                isToday && !isSelected && "ring-1 ring-[#FF5500]/60 ring-offset-1 ring-offset-black"
              )}
            >
              {/* Day number */}
              <span className={cn(
                "font-['JetBrains_Mono'] text-[10px] leading-none",
                isToday ? "text-white" : count > 0 ? "text-white/70" : "text-[#333333]"
              )}>
                {day}
              </span>

              {/* Counts row — always "closes / total" format */}
              {count > 0 && (
                <div className="flex items-center gap-[2px] mt-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] font-bold leading-none text-[#22C55E]">
                    {closes}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[7px] text-[#333333] leading-none">/</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] font-bold leading-none text-[#FF8C42]">
                    {count}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          {[1, 2, 4, 7].map((n) => (
            <div key={n} className={cn("w-4 h-4 border", countToIntensity(n))} />
          ))}
          <span className="font-['JetBrains_Mono'] text-[8px] text-[#444444]">volume</span>
        </div>
        <div className="h-3 w-px bg-[#1A1A1A]" />
        <div className="flex items-center gap-2">
          <span className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#22C55E]">2</span>
          <span className="font-['JetBrains_Mono'] text-[8px] text-[#444444]">closes</span>
          <span className="font-['JetBrains_Mono'] text-[7px] text-[#333333]">/</span>
          <span className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#FF8C42]">5</span>
          <span className="font-['JetBrains_Mono'] text-[8px] text-[#444444]">total</span>
        </div>
      </div>

      {/* Selected day detail panel */}
      {selectedKey && (
        <div className="mt-6 border border-[#252525] border-l-2 border-l-[#FF5500]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
            <div>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#FF5500] uppercase tracking-[2px]">
                {new Date(selectedKey + "T00:00:00").toLocaleDateString(undefined, {
                  weekday: "long", month: "long", day: "numeric",
                })}
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#444444] ml-3">
                {selectedCount} approach{selectedCount !== 1 ? "es" : ""}
              </span>
            </div>
            <button
              onClick={() => setSelectedKey(null)}
              className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] hover:text-white uppercase tracking-widest transition-colors"
            >
              ✕
            </button>
          </div>

          {selectedApproaches.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#333333] uppercase tracking-widest">
                No approaches logged
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#111111]">
              {selectedApproaches
                .sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime())
                .map((a, i) => (
                  <div key={a.approachId} className="px-4 py-3 flex items-center gap-4">
                    {/* Index */}
                    <span className="font-['Syne'] text-xl font-bold text-[#1A1A1A] w-7 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Time */}
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#444444] w-12 flex-shrink-0">
                      {a.loggedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    {/* Outcome */}
                    <span
                      className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest flex-1"
                      style={{ color: OUTCOME_COLORS[a.outcome] ?? "#666666" }}
                    >
                      {OUTCOME_LABELS[a.outcome] ?? a.outcome}
                    </span>

                    {/* Phase */}
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#444444] uppercase tracking-widest hidden sm:block">
                      {a.phaseReached}
                    </span>

                    {/* Score */}
                    <span
                      className="font-['Syne'] text-base font-bold w-10 text-right flex-shrink-0"
                      style={{ color: a.scoreOverall >= 7 ? "#FF5500" : a.scoreOverall >= 5 ? "#EAB308" : "#EF4444" }}
                    >
                      {a.scoreOverall.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
