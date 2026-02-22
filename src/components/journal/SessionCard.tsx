"use client";

// src/components/journal/SessionCard.tsx

import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";

interface SessionCardProps {
  sessionDate:     Date;
  locationName:    string;
  locationType:    string;
  timeOfDay:       string;
  totalApproaches: number;
  notes:           string;
  isComplete:      boolean;
  avgScore?:       number;
  onClick?:        () => void;
  onEdit?:         () => void;
}

const LOCATION_ICONS: Record<string, string> = {
  street: "🚶", cafe: "☕", mall: "🛒", park: "🌳",
  market: "🧺", transit: "🚇", university: "🎓", other: "📍",
};

export default function SessionCard({
  sessionDate, locationName, locationType, timeOfDay,
  totalApproaches, notes, isComplete, avgScore,
  onClick, onEdit,
}: SessionCardProps) {
  const icon = LOCATION_ICONS[locationType] ?? "📍";
  const date = sessionDate instanceof Date ? sessionDate : new Date(sessionDate);

  return (
    <div className="group grid grid-cols-[80px_1fr_auto] py-5 border-b border-[#1A1A1A] transition-all duration-150 hover:pl-2">

      {/* Date */}
      <button onClick={onClick} className="text-left">
        <div className="font-[family-name:var(--font-syne)] text-[44px] font-bold text-[#333333] leading-none">
          {date.getDate()}
        </div>
        <div className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#4A4A4A] tracking-widest uppercase">
          {formatDate(date, "short").split(" ")[0]} {date.getFullYear().toString().slice(2)}
        </div>
      </button>

      {/* Info */}
      <button onClick={onClick} className="px-5 text-left">
        <div className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-widest text-[#FF5500] uppercase mb-1.5">
          {icon} {locationName || locationType} · {timeOfDay}
        </div>
        <div className="text-[13px] text-[#888888] italic leading-relaxed mb-2 line-clamp-2">
          {notes || "No notes"}
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] tracking-widest uppercase px-2 py-0.5 border text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/7">
              ✓ COMPLETE
            </span>
          )}
          {/* Edit button — shows on hover */}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666] border border-[#252525] px-2 py-0.5 hover:border-[#FF5500] hover:text-[#FF5500] uppercase tracking-widest"
            >
              ✎ EDIT
            </button>
          )}
        </div>
      </button>

      {/* Approach count */}
      <div className="text-right flex flex-col justify-center">
        <div className="font-[family-name:var(--font-syne)] text-[32px] font-bold text-white leading-none">
          {totalApproaches}
        </div>
        <div className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#4A4A4A] tracking-widest uppercase mt-1">
          approaches
        </div>
        {avgScore !== undefined && avgScore > 0 && (
          <div className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#FF5500] mt-1">
            {avgScore.toFixed(1)} avg
          </div>
        )}
      </div>
    </div>
  );
}