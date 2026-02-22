"use client";

import { useState } from "react";
import { Session, Approach } from "@/lib/firebase/types";
import { getSessionApproaches } from "@/lib/firebase/queries/approaches";
import { completeSession } from "@/lib/firebase/queries/sessions";
import { SessionHeader } from "./SessionHeader";
import { ApproachCard } from "./ApproachCard";
import { Button } from "@/components/ui/button";

interface SessionDetailProps {
  session: Session;
  userId: string;
}

export function SessionDetail({ session, userId }: SessionDetailProps) {
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [showLogger, setShowLogger] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEndSession = async () => {
    const moodAfter = prompt("How do you feel after this session?");
    if (moodAfter === null) return;
    const notes = prompt("Any final notes?") || "";
    await completeSession(session.sessionId, moodAfter, notes);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SessionHeader session={session} onEndSession={!session.isComplete ? handleEndSession : undefined} />

      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-syne)] text-lg">
          Approaches ({session.totalApproaches})
        </h3>
        <button
          onClick={() => setShowLogger(!showLogger)}
          className="bg-[#FF5500] text-white px-4 py-2 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
        >
          + Log Approach
        </button>
      </div>

      {approaches.length > 0 ? (
        <div className="grid gap-4">
          {approaches.map((approach) => (
            <ApproachCard key={approach.approachId} approach={approach} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#666666]">
          <p>No approaches logged yet.</p>
          <p className="text-sm mt-2">Tap "+ Log Approach" to record your first approach.</p>
        </div>
      )}
    </div>
  );
}
