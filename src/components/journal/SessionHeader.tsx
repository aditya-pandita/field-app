"use client";

import { Session } from "@/lib/firebase/types";
import { formatDate, getRelativeDay } from "@/lib/utils/format";

interface SessionHeaderProps {
  session: Session;
  onEndSession?: () => void;
}

export function SessionHeader({ session, onEndSession }: SessionHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-[family-name:var(--font-syne)] text-3xl">
          {formatDate(session.sessionDate, "day")}
        </span>
        <span className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-sm">
          {formatDate(session.sessionDate, "long")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#252525] text-[#888888] text-xs font-[family-name:var(--font-jetbrains)] uppercase">
          {session.locationType}
        </span>
        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#252525] text-[#888888] text-xs font-[family-name:var(--font-jetbrains)] uppercase">
          {session.weather}
        </span>
        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#252525] text-[#888888] text-xs font-[family-name:var(--font-jetbrains)] uppercase">
          {session.timeOfDay}
        </span>
        {session.moodBefore && (
          <span className="px-3 py-1 bg-[#1A1A1A] border border-[#252525] text-[#888888] text-xs font-[family-name:var(--font-jetbrains)] uppercase">
            {session.moodBefore}
          </span>
        )}
      </div>

      {session.locationName && (
        <p className="text-[#666666] text-sm">{session.locationName}</p>
      )}

      {!session.isComplete && onEndSession && (
        <button
          onClick={onEndSession}
          className="text-[#FF5500] text-sm font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:underline"
        >
          End Session
        </button>
      )}
    </div>
  );
}
