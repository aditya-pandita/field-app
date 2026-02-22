"use client";

// src/components/journal/SessionDetail.tsx
// Fixed: loads approaches on mount, edit approach, link recordings.

import { useState, useEffect } from "react";
import { Session, Approach, ApproachRecording } from "@/lib/firebase/types";
import { getSessionApproaches, updateApproach } from "@/lib/firebase/queries/approaches";
import { getSessionRecordings, updateRecording } from "@/lib/firebase/queries/recordings";
import { completeSession } from "@/lib/firebase/queries/sessions";
import { SessionHeader } from "./SessionHeader";
import { ApproachCard } from "./ApproachCard";
import { ApproachLogger } from "@/components/approach/ApproachLogger";

interface SessionDetailProps {
  session: Session;
  userId:  string;
}

export function SessionDetail({ session, userId }: SessionDetailProps) {
  const [approaches,  setApproaches]  = useState<Approach[]>([]);
  const [recordings,  setRecordings]  = useState<ApproachRecording[]>([]);
  const [showLogger,  setShowLogger]  = useState(false);
  const [editApproach, setEditApproach] = useState<Approach | null>(null);
  const [loading,     setLoading]     = useState(true);

  // Load approaches and recordings on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [apps, recs] = await Promise.all([
          getSessionApproaches(session.sessionId),
          getSessionRecordings(session.sessionId),
        ]);
        setApproaches(apps);
        setRecordings(recs);
      } catch (e) {
        console.error("Failed to load session data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session.sessionId]);

  const handleEndSession = async () => {
    const moodAfter = prompt("How do you feel after this session? (1-10 or a word)");
    if (moodAfter === null) return;
    const notes = prompt("Any final notes?") || "";
    await completeSession(session.sessionId, moodAfter, notes);
    window.location.reload();
  };

  const handleApproachSaved = async () => {
    setShowLogger(false);
    setEditApproach(null);
    // Reload approaches to show the new/updated one
    const updated = await getSessionApproaches(session.sessionId);
    setApproaches(updated);
  };

  // Link a recording to an approach
  const handleLinkRecording = async (approachId: string, recordingId: string) => {
    await updateRecording(recordingId, { sessionId: session.sessionId });
    // Reload both
    const [apps, recs] = await Promise.all([
      getSessionApproaches(session.sessionId),
      getSessionRecordings(session.sessionId),
    ]);
    setApproaches(apps);
    setRecordings(recs);
  };

  return (
    <div className="space-y-6">
      <SessionHeader
        session={session}
        onEndSession={!session.isComplete ? handleEndSession : undefined}
      />

      {/* Log Approach button */}
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-syne)] text-lg">
          Approaches ({session.totalApproaches})
        </h3>
        <button
          onClick={() => { setShowLogger(true); setEditApproach(null); }}
          className="bg-[#FF5500] text-white px-4 py-2 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
        >
          + Log Approach
        </button>
      </div>

      {/* Inline logger */}
      {(showLogger || editApproach) && (
        <div className="border border-[#252525] border-l-2 border-l-[#FF5500] p-4 bg-[#111111]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest">
              {editApproach ? "EDIT APPROACH" : "LOG APPROACH"}
            </span>
            <button
              onClick={() => { setShowLogger(false); setEditApproach(null); }}
              className="text-[#444444] hover:text-white font-[family-name:var(--font-jetbrains)] text-xs"
            >
              ✕ CANCEL
            </button>
          </div>
          <ApproachLogger
            userId={userId}
            sessionId={session.sessionId}
            existingApproach={editApproach ?? undefined}
            onSuccess={handleApproachSaved}
            onClose={() => { setShowLogger(false); setEditApproach(null); }}
          />
        </div>
      )}

      {/* Approach list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-[#111111] border border-[#1A1A1A] animate-pulse" />
          ))}
        </div>
      ) : approaches.length > 0 ? (
        <div className="space-y-3">
          {approaches.map((approach, idx) => (
            <ApproachCard
              key={approach.approachId}
              approach={approach}
              number={idx + 1}
              recordings={recordings}
              onEdit={() => setEditApproach(approach)}
              onLinkRecording={(recordingId) =>
                handleLinkRecording(approach.approachId, recordingId)
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-[#1A1A1A]">
          <p className="font-[family-name:var(--font-syne)] text-lg text-white mb-2">
            No approaches logged yet
          </p>
          <p className="text-[#444444] text-sm">
            Tap &ldquo;+ Log Approach&rdquo; to record your first approach.
          </p>
        </div>
      )}
    </div>
  );
}