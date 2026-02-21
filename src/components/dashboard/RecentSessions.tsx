"use client";

import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";

interface Session {
  sessionId: string;
  sessionDate: Date;
  locationName: string;
  totalApproaches: number;
  notes?: string;
}

interface RecentSessionsProps {
  sessions: Session[];
  onSessionClick?: (sessionId: string) => void;
}

export default function RecentSessions({ sessions, onSessionClick }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-[#666666]">
        No sessions yet. Start your first session!
      </div>
    );
  }

  return (
    <div>
      {sessions.slice(0, 5).map((session, index) => (
        <div
          key={session.sessionId}
          onClick={() => onSessionClick?.(session.sessionId)}
          className={cn(
            "grid grid-cols-[70px_1fr_auto] gap-0 py-[18px] border-b border-[#1A1A1A] cursor-pointer transition-all duration-150 hover:pl-2"
          )}
        >
          <div>
            <div className="font-['Syne'] text-[42px] font-bold text-[#333333] leading-none">
              {formatDate(session.sessionDate, "short").split(" ")[1] || "—"}
            </div>
            <div className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] tracking-[1px] uppercase">
              {formatDate(session.sessionDate, "short").split(" ")[0] || ""}
            </div>
          </div>
          <div className="px-5">
            <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] text-[#FF5500] uppercase mb-[6px]">
              {session.locationName || "Field Session"}
            </div>
            <div className="text-[13px] text-[#888888] italic leading-relaxed">
              {session.notes || "No notes"}
            </div>
          </div>
          <div className="text-right">
            <div className="font-['Syne'] text-[28px] font-bold text-white">
              {session.totalApproaches}
            </div>
            <div className="font-['JetBrains_Mono'] text-[8px] text-[#4A4A4A] tracking-[2px] uppercase">
              approaches
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
