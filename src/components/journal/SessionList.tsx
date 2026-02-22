"use client";

// src/components/journal/SessionList.tsx

import SessionCard from "./SessionCard";
import type { Session } from "@/lib/firebase/types";

interface SessionListProps {
  sessions:       Session[];
  onSessionClick?: (sessionId: string) => void;
  onSessionEdit?:  (session: Session) => void;
}

export default function SessionList({
  sessions,
  onSessionClick,
  onSessionEdit,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-[family-name:var(--font-syne)] text-xl text-white mb-2">No sessions yet</p>
        <p className="text-[#444444] text-sm mb-6">Start your first field session to begin tracking.</p>
        <a
          href="/journal/new"
          className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
        >
          + NEW SESSION
        </a>
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
          onEdit={onSessionEdit ? () => onSessionEdit(session) : undefined}
        />
      ))}
    </div>
  );
}