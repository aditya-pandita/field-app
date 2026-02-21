"use client";

import SessionCard from "./SessionCard";
import type { Session } from "@/lib/firebase/types";

interface SessionListProps {
  sessions: Session[];
  onSessionClick?: (sessionId: string) => void;
}

export default function SessionList({ sessions, onSessionClick }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-[14px] text-[#666666] mb-4">No sessions yet</div>
        <button className="bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 cursor-pointer transition-all duration-150 hover:bg-[#E64D00]">
          + NEW SESSION
        </button>
      </div>
    );
  }

  return (
    <div>
      {sessions.map((session) => (
        <SessionCard
          key={session.sessionId}
          sessionDate={session.sessionDate}
          locationName={session.locationName}
          locationType={session.locationType}
          timeOfDay={session.timeOfDay}
          totalApproaches={session.totalApproaches}
          notes={session.notes}
          isComplete={session.isComplete}
          onClick={() => onSessionClick?.(session.sessionId)}
        />
      ))}
    </div>
  );
}
