"use client";

import { useEffect, useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  initTrack,
  toggleTask,
  completeDay,
  resetTrack,
  computeTrackStats,
} from "@/lib/programUtils";
import type { TrackData } from "@/lib/programUtils";
import { PROGRAM_TRACKS } from "@/lib/programData";
import type { TrackId, TaskDef } from "@/lib/programData";
import { LogApproachModal } from "@/components/approach/LogApproachModal";
import { DayCard } from "./components/DayCard";

interface LogModal {
  trackId: TrackId;
  dayNum:  number;
  task:    TaskDef;
}

const TRACK_IDS: TrackId[] = ["chill", "aggressive"];

export default function ProgramPage() {
  const { userId, loading: authLoading } = useAuth();

  const [trackData,  setTrackData]  = useState<Record<TrackId, TrackData | null>>({
    aggressive: null,
    chill:      null,
  });
  const [loading,    setLoading]    = useState<Record<TrackId, boolean>>({
    aggressive: true,
    chill:      true,
  });
  const [completing, setCompleting] = useState<string | null>(null); // e.g. "aggressive:2"
  const [logModal,   setLogModal]   = useState<LogModal | null>(null);

  // ── Init both tracks on mount ─────────────────────────────────────────────

  useEffect(() => {
    if (!userId) return;
    TRACK_IDS.forEach(async (trackId) => {
      try {
        const data = await initTrack(userId, trackId);
        setTrackData((prev) => ({ ...prev, [trackId]: data }));
      } catch (err) {
        console.error(`Failed to init ${trackId}:`, err);
      } finally {
        setLoading((prev) => ({ ...prev, [trackId]: false }));
      }
    });
  }, [userId]);

  // ── Re-fetch a single track ───────────────────────────────────────────────

  const refetch = useCallback(async (trackId: TrackId) => {
    if (!userId) return;
    const { getTrackData } = await import("@/lib/programUtils");
    const data = await getTrackData(userId, trackId);
    setTrackData((prev) => ({ ...prev, [trackId]: data }));
  }, [userId]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleToggleTask = useCallback(async (
    trackId: TrackId,
    dayNum: number,
    taskId: string,
    val: boolean
  ) => {
    if (!userId) return;
    await toggleTask(userId, trackId, dayNum, taskId, val, null);
    await refetch(trackId);
  }, [userId, refetch]);

  const handleCompleteDay = useCallback(async (trackId: TrackId, dayNum: number) => {
    if (!userId) return;
    setCompleting(`${trackId}:${dayNum}`);
    try {
      await completeDay(userId, trackId, dayNum);
      await refetch(trackId);
    } finally {
      setCompleting(null);
    }
  }, [userId, refetch]);

  const handleLogApproach = useCallback((trackId: TrackId, dayNum: number, task: TaskDef) => {
    setLogModal({ trackId, dayNum, task });
  }, []);

  const handleApproachLogged = useCallback(async (approachId: string) => {
    if (!logModal || !userId) return;
    const { trackId, dayNum, task } = logModal;
    setLogModal(null);
    await toggleTask(userId, trackId, dayNum, task.id, true, approachId);
    await refetch(trackId);
  }, [logModal, userId, refetch]);

  const handleReset = useCallback(async (trackId: TrackId) => {
    if (!userId) return;
    if (!confirm(`Reset the ${PROGRAM_TRACKS[trackId].label} track? All progress will be lost.`)) return;
    const fresh = await resetTrack(userId, trackId);
    setTrackData((prev) => ({ ...prev, [trackId]: fresh }));
  }, [userId]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="font-['JetBrains_Mono'] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
          TRAINING
        </p>
        <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-2">
          Program
        </h1>
        <p className="text-[#666666] text-sm max-w-[540px]">
          Graduated desensitization — two tracks running in parallel. Aggressive compresses 
          the exposure into 4 high-volume days. Chill isolates one skill per day across 9. 
          Complete each day to unlock the next.
        </p>
      </div>

      <div className="h-px bg-[#252525] mb-10" />

      {/* Two-column track grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {TRACK_IDS.map((trackId) => {
          const trackDef  = PROGRAM_TRACKS[trackId];
          const data      = trackData[trackId];
          const isLoading = loading[trackId];
          const stats     = data ? computeTrackStats(data, trackDef) : null;

          return (
            <div key={trackId}>
              {/* Track header */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: trackDef.accentColor }}
                    />
                    <span
                      className="font-['Syne'] text-lg font-bold uppercase"
                      style={{ color: trackDef.accentColor }}
                    >
                      {trackDef.label}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#444444] uppercase tracking-[2px]">
                      {trackDef.days.length}-day track
                    </span>
                  </div>

                  {data && (
                    <button
                      onClick={() => handleReset(trackId)}
                      className="flex items-center gap-1 font-['JetBrains_Mono'] text-[8px] text-[#4A4A4A] hover:text-[#888888] uppercase tracking-[2px] transition-colors"
                    >
                      <RotateCcw size={9} />
                      Reset
                    </button>
                  )}
                </div>

                {/* Track progress bar */}
                {stats && (
                  <div className="space-y-1">
                    <div className="h-1 bg-[#1A1A1A]">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${stats.pct}%`, backgroundColor: trackDef.accentColor }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['JetBrains_Mono'] text-[8px] text-[#4A4A4A]">
                        {stats.completedTasks} / {stats.totalTasks} tasks
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[8px]" style={{ color: trackDef.accentColor }}>
                        {stats.pct}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Completed badge */}
                {data?.status === "completed" && (
                  <div
                    className="mt-2 inline-block px-3 py-1 font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase border"
                    style={{ color: trackDef.accentColor, borderColor: `${trackDef.accentColor}40` }}
                  >
                    ✓ Program Complete
                  </div>
                )}
              </div>

              {/* Day cards */}
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(trackDef.days.length)].map((_, i) => (
                    <div key={i} className="h-12 bg-[#111111] animate-pulse" />
                  ))}
                </div>
              ) : data ? (
                <div className="space-y-1">
                  {trackDef.days.map((dayDef) => {
                    const dayStr    = String(dayDef.day);
                    const dayData   = data.days[dayStr];
                    const isActive  = data.currentDay === dayDef.day && data.status !== "completed";
                    const isLocked  = dayDef.day > data.currentDay && data.status !== "completed";
                    const isDone    = !!dayData?.completedAt;

                    return (
                      <DayCard
                        key={dayDef.day}
                        trackId={trackId}
                        dayDef={dayDef}
                        dayData={dayData}
                        isActive={isActive}
                        isLocked={isLocked}
                        isCompleted={isDone}
                        completing={completing === `${trackId}:${dayDef.day}`}
                        accentColor={trackDef.accentColor}
                        onToggleTask={(dayNum, taskId, val) =>
                          handleToggleTask(trackId, dayNum, taskId, val)
                        }
                        onCompleteDay={(dayNum) => handleCompleteDay(trackId, dayNum)}
                        onLogApproach={(dayNum, task) =>
                          handleLogApproach(trackId, dayNum, task)
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="font-['JetBrains_Mono'] text-[9px] text-[#333333] uppercase tracking-[2px]">
                  Failed to load track
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Log Approach Modal */}
      <LogApproachModal
        isOpen={!!logModal}
        onClose={() => setLogModal(null)}
        userId={userId}
        programMeta={logModal ? {
          track:       logModal.trackId,
          day:         logModal.dayNum,
          initialTags: ["program", logModal.trackId, logModal.task.type],
        } : undefined}
        onSuccess={handleApproachLogged}
      />
    </div>
  );
}
