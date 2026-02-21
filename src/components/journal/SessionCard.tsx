"use client";

import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";

interface SessionCardProps {
  sessionDate: Date;
  locationName: string;
  locationType: string;
  timeOfDay: string;
  totalApproaches: number;
  notes: string;
  isComplete: boolean;
  avgScore?: number;
  onClick?: () => void;
}

export default function SessionCard({
  sessionDate,
  locationName,
  locationType,
  timeOfDay,
  totalApproaches,
  notes,
  isComplete,
  avgScore,
  onClick,
}: SessionCardProps) {
  const locationIcon: Record<string, string> = {
    street: "🚶",
    cafe: "☕",
    mall: "🛒",
    park: "🌳",
    market: "🧺",
    transit: "🚇",
    university: "🎓",
    other: "📍",
  };

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-[80px_1fr_auto] py-5 border-b border-[#1A1A1A] cursor-pointer transition-all duration-150 hover:pl-2"
    >
      <div>
        <div className="font-['Syne'] text-[44px] font-bold text-[#333333] leading-none">
          {sessionDate.getDate()}
        </div>
        <div className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] tracking-[1px] uppercase">
          {formatDate(sessionDate, "short").split(" ")[0]} {sessionDate.getFullYear().toString().slice(2)}
        </div>
      </div>
      <div className="px-5">
        <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] text-[#FF5500] uppercase mb-[6px]">
          {locationIcon[locationType] || "📍"} {locationName} · {timeOfDay}
        </div>
        <div className="text-[13px] text-[#888888] italic leading-relaxed mb-2 line-clamp-2">
          {notes || "No notes"}
        </div>
        {isComplete && (
          <span className="inline-flex items-center font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase px-2 py-1 border text-[#22C55E] border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.07)]">
            ✓ COMPLETE
          </span>
        )}
      </div>
      <div className="text-right">
        <div className="font-['Syne'] text-[32px] font-bold text-white">
          {totalApproaches}
        </div>
        <div className="font-['JetBrains_Mono'] text-[8px] text-[#4A4A4A] tracking-[2px] uppercase">
          approaches
        </div>
        {avgScore !== undefined && avgScore > 0 && (
          <div className="text-[11px] text-[#FF5500] font-['JetBrains_Mono'] mt-1">
            {avgScore.toFixed(1)} avg
          </div>
        )}
      </div>
    </div>
  );
}
