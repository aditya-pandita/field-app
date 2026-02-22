"use client";

// src/components/approach/ApproachLogger.tsx
// Handles both CREATE and EDIT modes.
// Edit mode: pre-fills all fields from existingApproach prop.
// Step 0 includes session picker (link approach to any session).

import { useApproachLogger } from "@/hooks/useApproachLogger";
import { PhaseSelector } from "./PhaseSelector";
import { OutcomeSelector } from "./OutcomeSelector";
import { ScoreSlider } from "./ScoreSlider";
import { OverallScoreDisplay } from "./OverallScoreDisplay";
import { TagSelector } from "./TagSelector";
import { ReflectStep } from "./ReflectStep";
import { LoggerSuccess } from "./LoggerSuccess";
import type { Approach, Session, ApproachRecording } from "@/lib/firebase/types";

interface ApproachLoggerProps {
  userId:            string;
  sessionId:         string;
  existingApproach?: Approach;
  availableSessions?: Session[];      // for session picker
  availableRecordings?: ApproachRecording[]; // for recording link
  onSuccess?:        () => void;
  onClose?:          () => void;
}

const STEP_LABELS = [
  "Phase & Outcome",
  "Delivery Scores",
  "Connection Scores",
  "Reflect",
];

export function ApproachLogger({
  userId,
  sessionId,
  existingApproach,
  availableSessions  = [],
  availableRecordings = [],
  onSuccess,
  onClose,
}: ApproachLoggerProps) {
  const {
    step, formData, loading, error, isComplete, isEditMode,
    liveScore, isStepValid, progress,
    updateField, nextStep, prevStep, submit, reset,
  } = useApproachLogger(userId, { existingApproach });

  const handleSubmit = async () => {
    await submit(sessionId);
    onSuccess?.();
  };

  const handleLogAnother = () => reset();

  if (isComplete) {
    return (
      <LoggerSuccess
        score={liveScore}
        outcome={formData.outcome}
        onLogAnother={handleLogAnother}
        onDone={onClose || (() => {})}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#666666] uppercase tracking-widest">
            {isEditMode ? "EDITING · " : ""}Step {step + 1} of 4
          </span>
          <p className="font-[family-name:var(--font-syne)] text-sm text-white mt-0.5">
            {STEP_LABELS[step]}
          </p>
        </div>
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#FF5500]">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#252525]">
        <div className="h-full bg-[#FF5500] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {error && (
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] text-sm">{error}</div>
      )}

      {/* STEP 0: Phase + Outcome + optional session picker */}
      {step === 0 && (
        <div className="space-y-6">
          <PhaseSelector
            value={formData.phaseReached}
            onChange={(v) => updateField("phaseReached", v)}
          />

          <div className="h-px bg-[#1A1A1A]" />

          <OutcomeSelector
            value={formData.outcome}
            onChange={(v) => updateField("outcome", v)}
          />

          {/* Session picker — only show if sessions available and not locked to one */}
          {availableSessions.length > 0 && (
            <div>
              <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                LINK TO SESSION
              </label>
              <select
                value={formData.sessionId || sessionId}
                onChange={(e) => updateField("sessionId", e.target.value)}
                className="w-full bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-3 py-2.5 outline-none focus:border-[#FF5500]"
              >
                <option value={sessionId}>Current session</option>
                {availableSessions
                  .filter((s) => s.sessionId !== sessionId)
                  .map((s) => {
                    const d = s.sessionDate instanceof Date ? s.sessionDate : new Date(s.sessionDate);
                    return (
                      <option key={s.sessionId} value={s.sessionId}>
                        {d.toLocaleDateString()} · {s.locationName || s.locationType}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}

          {/* Recording link — show if recordings available */}
          {availableRecordings.length > 0 && (
            <div>
              <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                LINK LIVE RECORDING
              </label>
              <select
                className="w-full bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] px-3 py-2.5 outline-none focus:border-[#3B82F6]"
                defaultValue=""
                onChange={(e) => {
                  // Store selected recording id in a data attribute for parent to read
                  const el = e.target;
                  el.dataset.selectedRecordingId = e.target.value;
                }}
              >
                <option value="">No recording linked</option>
                {availableRecordings.map((r) => {
                  const d = r.recordedAt instanceof Date ? r.recordedAt : new Date(r.recordedAt);
                  const mins = Math.floor(r.durationSecs / 60);
                  const secs = r.durationSecs % 60;
                  return (
                    <option key={r.recordingId} value={r.recordingId}>
                      {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {mins}m {secs}s
                    </option>
                  );
                })}
              </select>
              {availableRecordings[0] && (
                <p className="text-[#444444] text-[10px] mt-1 italic line-clamp-1">
                  &ldquo;{availableRecordings[0].transcript.substring(0, 80)}...&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 1: Execution + Tonality */}
      {step === 1 && (
        <div>
          <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-4">
            DELIVERY — HOW YOU SHOWED UP
          </p>
          <ScoreSlider metric="execution" value={formData.scoreExecution} onChange={(v) => updateField("scoreExecution", v)} />
          <ScoreSlider metric="tonality"  value={formData.scoreTonality}  onChange={(v) => updateField("scoreTonality",  v)} />
          <div className="pt-4">
            <OverallScoreDisplay
              execution={formData.scoreExecution} tonality={formData.scoreTonality}
              investment={formData.scoreInvestment} close={formData.scoreClose} recovery={formData.scoreRecovery}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Investment + Close + Recovery */}
      {step === 2 && (
        <div>
          <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-4">
            CONNECTION — WHAT HAPPENED IN SET
          </p>
          <ScoreSlider metric="investment" value={formData.scoreInvestment} onChange={(v) => updateField("scoreInvestment", v)} />
          <ScoreSlider metric="close"      value={formData.scoreClose}      onChange={(v) => updateField("scoreClose",      v)} />
          <ScoreSlider metric="recovery"   value={formData.scoreRecovery}   onChange={(v) => updateField("scoreRecovery",   v)} />
          <div className="pt-4">
            <OverallScoreDisplay
              execution={formData.scoreExecution} tonality={formData.scoreTonality}
              investment={formData.scoreInvestment} close={formData.scoreClose} recovery={formData.scoreRecovery}
            />
          </div>
          <div className="pt-4">
            <TagSelector value={formData.tags} onChange={(v) => updateField("tags", v)} />
          </div>
        </div>
      )}

      {/* STEP 3: Reflect */}
      {step === 3 && (
        <div className="space-y-6">
          <OverallScoreDisplay
            execution={formData.scoreExecution} tonality={formData.scoreTonality}
            investment={formData.scoreInvestment} close={formData.scoreClose} recovery={formData.scoreRecovery}
          />
          <div className="h-px bg-[#1A1A1A]" />
          <ReflectStep
            whatWentWell={formData.whatWentWell}
            whatToImprove={formData.whatToImprove}
            notableMoment={formData.notableMoment}
            onWhatWentWellChange={(v) => updateField("whatWentWell",   v)}
            onWhatToImproveChange={(v) => updateField("whatToImprove", v)}
            onNotableMomentChange={(v) => updateField("notableMoment", v)}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {step > 0 && (
          <button
            onClick={prevStep}
            className="flex-1 border border-[#252525] text-[#888888] py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:border-[#333333] hover:text-white transition-colors"
          >
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={!isStepValid}
            className="flex-1 bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "SAVE CHANGES →" : "Log Approach →"}
          </button>
        )}
      </div>
    </div>
  );
}