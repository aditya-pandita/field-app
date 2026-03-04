"use client";

import { useState } from "react";
import { ApproachRecording } from "@/lib/firebase/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Mic } from "lucide-react";

interface RecordingHistoryProps {
  recordings: ApproachRecording[];
  onSelect?:  (recording: ApproachRecording) => void;
  onDelete?:  (recordingId: string) => void;
}

function RecordingRow({
  recording,
  onSelect,
  onDelete,
}: {
  recording: ApproachRecording;
  onSelect?: (r: ApproachRecording) => void;
  onDelete?: (id: string) => void;
}) {
  const [expanded,      setExpanded]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting,      setDeleting]      = useState(false);

  const date  = recording.recordedAt instanceof Date ? recording.recordedAt : new Date(recording.recordedAt);
  const mins  = Math.floor(recording.durationSecs / 60);
  const secs  = recording.durationSecs % 60;

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete(recording.recordingId);
  };

  return (
    <div className="bg-[#111111] border border-[#252525] hover:border-[#333333] transition-colors">

      {/* Header row */}
      <button onClick={() => setExpanded((p) => !p)} className="w-full p-4 text-left">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666]">
              {date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444]">
              {mins}:{String(secs).padStart(2, "0")}
            </span>
            {recording.approachId && (
              <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#3B82F6] border border-[#3B82F6]/30 px-1.5 py-0.5">
                LINKED
              </span>
            )}
          </div>
          <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
            {expanded ? "▲" : "▼"}
          </span>
        </div>

        <p className="text-[#888888] text-xs leading-relaxed line-clamp-2">
          {recording.transcript || "No transcript"}
        </p>

        {recording.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recording.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-[#1A1A1A] text-[9px] font-[family-name:var(--font-jetbrains)] text-[#555555]">
                {tag}
              </span>
            ))}
            {recording.tags.length > 3 && (
              <span className="text-[9px] text-[#444444] font-[family-name:var(--font-jetbrains)]">+{recording.tags.length - 3}</span>
            )}
          </div>
        )}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-[#1A1A1A] p-4 space-y-4">
          {/* Full transcript */}
          <div>
            <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-2">TRANSCRIPT</p>
            <p className="text-[#888888] text-xs leading-relaxed max-h-48 overflow-y-auto">
              {recording.transcript}
            </p>
          </div>

          {/* Notes */}
          {recording.notes && (
            <div className="border-l-2 border-[#FF5500] pl-3 bg-[#FF5500]/5 py-2 pr-3">
              <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#FF5500] uppercase tracking-widest mb-1">NOTES</p>
              <p className="text-[#888888] text-xs italic">{recording.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onSelect && (
              <button
                onClick={() => onSelect(recording)}
                className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest border border-[#333333] text-[#888888] px-3 py-1.5 hover:border-[#FF5500] hover:text-[#FF5500] transition-colors"
              >
                USE THIS
              </button>
            )}

            {/* Delete */}
            {onDelete && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="ml-auto font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest border border-[#252525] text-[#444444] px-3 py-1.5 hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
              >
                DELETE
              </button>
            )}

            {confirmDelete && (
              <div className="ml-auto flex items-center gap-2">
                <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#EF4444] uppercase">Sure?</span>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase border border-[#333333] text-[#888888] px-2 py-1 hover:text-white transition-colors"
                >
                  NO
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase bg-[#EF4444] text-white px-2 py-1 hover:bg-[#DC2626] transition-colors disabled:opacity-50"
                >
                  {deleting ? "..." : "YES"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function RecordingHistory({ recordings, onSelect, onDelete }: RecordingHistoryProps) {
  if (recordings.length === 0) {
    return (
      <EmptyState
        icon={Mic}
        title="No recordings yet"
        description="Record your first live approach to get started"
      />
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-3">
        PAST RECORDINGS ({recordings.length})
      </p>
      {recordings.map((recording) => (
        <RecordingRow
          key={recording.recordingId}
          recording={recording}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}