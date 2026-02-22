"use client";

import { ApproachRecording } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Mic } from "lucide-react";

interface RecordingHistoryProps {
  recordings: ApproachRecording[];
  onSelect?: (recording: ApproachRecording) => void;
  onDelete?: (recordingId: string) => void;
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
    <div className="space-y-3">
      <h3 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888]">
        Recent Recordings
      </h3>
      {recordings.map((recording) => (
        <div
          key={recording.recordingId}
          className="p-4 bg-[#111111] border border-[#252525]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#666666]">
              {new Date(recording.recordedAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-[#666666]">
              {Math.floor(recording.durationSecs / 60)}:{(recording.durationSecs % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <p className="text-sm text-[#888888] line-clamp-2 mb-2">
            {recording.transcript}
          </p>
          {recording.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recording.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#1A1A1A] text-[10px] text-[#666666]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
