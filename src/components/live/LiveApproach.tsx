"use client";

import { useLiveApproach } from "@/hooks/useLiveApproach";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getUserRecordings } from "@/lib/firebase/queries/recordings";
import { RecordButton } from "./RecordButton";
import { RecordingTimer } from "./RecordingTimer";
import { AudioWaveform } from "./AudioWaveform";
import { TranscriptEditor } from "./TranscriptEditor";
import { RecordingHistory } from "./RecordingHistory";
import { ErrorState } from "@/components/ui/ErrorState";

export function LiveApproach() {
  const { user } = useAuth();
  const {
    phase,
    elapsedSecs,
    transcript,
    notes,
    tags,
    savedRecord,
    error,
    amplitude,
    isRecording,
    canSave,
    startRecording,
    stopRecording,
    saveToFirestore,
    reset,
    setNotes,
    toggleTag,
  } = useLiveApproach(user?.uid || "");

  const [recordings, setRecordings] = useState<any[]>([]);

  useEffect(() => {
    if (user?.uid) {
      getUserRecordings(user.uid).then(setRecordings);
    }
  }, [user?.uid, phase]);

  if (phase === "saved") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/20 flex items-center justify-center">
          <span className="text-[#22C55E] text-2xl">✓</span>
        </div>
        <h2 className="font-[family-name:var(--font-syne)] text-xl">Saved!</h2>
        <p className="text-[#666666] text-sm">Your approach has been recorded</p>
        <button
          onClick={reset}
          className="bg-[#FF5500] text-white px-6 py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
        >
          Record Another
        </button>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <ErrorState
        title="Error"
        message={error || "Something went wrong"}
        action={
          <button
            onClick={reset}
            className="bg-[#FF5500] text-white px-6 py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
          >
            Try Again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <RecordButton
          phase={phase}
          onStart={startRecording}
          onStop={stopRecording}
        />
        <div className="mt-6">
          <RecordingTimer elapsedSecs={elapsedSecs} isRecording={isRecording} />
        </div>
        <AudioWaveform amplitude={amplitude} />
      </div>

      {phase === "reviewing" && (
        <TranscriptEditor
          transcript={transcript}
          notes={notes}
          tags={tags}
          durationSecs={elapsedSecs}
          onTranscriptChange={() => {}}
          onNotesChange={setNotes}
          onToggleTag={toggleTag}
          onSave={saveToFirestore}
          onDiscard={reset}
          canSave={canSave}
        />
      )}

      <RecordingHistory recordings={recordings} />
    </div>
  );
}
