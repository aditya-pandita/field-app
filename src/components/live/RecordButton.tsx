"use client";

import { cn } from "@/lib/utils";
import { Mic, Square } from "lucide-react";

interface RecordButtonProps {
  phase: "idle" | "requesting" | "recording" | "processing" | "reviewing" | "saved" | "error";
  onStart: () => void;
  onStop: () => void;
}

export function RecordButton({ phase, onStart, onStop }: RecordButtonProps) {
  const isIdle = phase === "idle";
  const isRequesting = phase === "requesting";
  const isRecording = phase === "recording";
  const isProcessing = phase === "processing";

  if (isProcessing) {
    return (
      <div className="w-32 h-32 mx-auto flex items-center justify-center border-4 border-[#FF5500] rounded-full animate-spin">
        <div className="w-24 h-24 border-4 border-[#FF5500] rounded-full" />
      </div>
    );
  }

  return (
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={isRequesting}
      className={cn(
        "w-32 h-32 mx-auto rounded-full flex flex-col items-center justify-center transition-all active:scale-95",
        isRecording
          ? "bg-[#EF4444] animate-pulse"
          : isRequesting
          ? "border-4 border-[#252525]"
          : "border-4 border-white hover:border-[#FF5500]"
      )}
    >
      {isRequesting ? (
        <div className="w-8 h-8 border-2 border-[#666666] border-t-[#FF5500] rounded-full animate-spin" />
      ) : isRecording ? (
        <Square className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
      <span className="mt-2 text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest text-white">
        {isRecording ? "Stop" : isRequesting ? "Requesting..." : "Record"}
      </span>
    </button>
  );
}
