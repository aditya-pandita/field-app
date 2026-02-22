"use client";

import { cn } from "@/lib/utils";

interface RecordingTimerProps {
  elapsedSecs: number;
  isRecording?: boolean;
}

export function RecordingTimer({ elapsedSecs, isRecording }: RecordingTimerProps) {
  const mins = Math.floor(elapsedSecs / 60);
  const secs = elapsedSecs % 60;

  return (
    <div className="text-center">
      <span className={cn(
        "font-[family-name:var(--font-syne)] text-5xl",
        isRecording && "text-[#EF4444] animate-pulse"
      )}>
        {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
      </span>
      {isRecording && (
        <div className="flex justify-center mt-2">
          <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
