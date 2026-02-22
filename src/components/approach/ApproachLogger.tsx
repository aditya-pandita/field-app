"use client";

import { useApproachLogger } from "@/hooks/useApproachLogger";
import { PhaseSelector } from "./PhaseSelector";
import { OutcomeSelector } from "./OutcomeSelector";
import { ScoreSlider, METRICS } from "./ScoreSlider";
import { TagSelector } from "./TagSelector";
import { ReflectStep } from "./ReflectStep";
import { LoggerSuccess } from "./LoggerSuccess";

interface ApproachLoggerProps {
  userId: string;
  sessionId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ApproachLogger({ userId, sessionId, onSuccess, onClose }: ApproachLoggerProps) {
  const {
    step,
    formData,
    loading,
    error,
    isComplete,
    liveScore,
    isStepValid,
    progress,
    updateField,
    nextStep,
    prevStep,
    submit,
    reset,
  } = useApproachLogger(userId);

  const handleSubmit = async () => {
    updateField("sessionId", sessionId);
    await submit();
    onSuccess?.();
  };

  const handleLogAnother = () => {
    reset();
    updateField("sessionId", sessionId);
  };

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
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#666666] uppercase">
          Step {step + 1} of 4
        </span>
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#FF5500] uppercase">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-0.5 bg-[#252525]">
        <div
          className="h-full bg-[#FF5500] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {error && (
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] text-sm">
          {error}
        </div>
      )}

      {step === 0 && (
        <div className="space-y-6">
          <PhaseSelector
            value={formData.phaseReached}
            onChange={(v) => updateField("phaseReached", v)}
          />
          <OutcomeSelector
            value={formData.outcome}
            onChange={(v) => updateField("outcome", v)}
          />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <ScoreSlider
            metric="execution"
            value={formData.scoreExecution}
            onChange={(v) => updateField("scoreExecution", v)}
            weight={METRICS.execution.weight}
          />
          <ScoreSlider
            metric="tonality"
            value={formData.scoreTonality}
            onChange={(v) => updateField("scoreTonality", v)}
            weight={METRICS.tonality.weight}
          />
          <div className="p-4 bg-[rgba(255,85,0,0.07)] border-l-2 border-[#FF5500]">
            <span className="text-[#FF5500] font-[family-name:var(--font-syne)]">Live Score: {liveScore.toFixed(1)}</span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <ScoreSlider
            metric="investment"
            value={formData.scoreInvestment}
            onChange={(v) => updateField("scoreInvestment", v)}
            weight={METRICS.investment.weight}
          />
          <ScoreSlider
            metric="close"
            value={formData.scoreClose}
            onChange={(v) => updateField("scoreClose", v)}
            weight={METRICS.close.weight}
          />
          <ScoreSlider
            metric="recovery"
            value={formData.scoreRecovery}
            onChange={(v) => updateField("scoreRecovery", v)}
            weight={METRICS.recovery.weight}
          />
          <TagSelector
            value={formData.tags}
            onChange={(v) => updateField("tags", v)}
          />
        </div>
      )}

      {step === 3 && (
        <ReflectStep
          whatWentWell={formData.whatWentWell}
          whatToImprove={formData.whatToImprove}
          notableMoment={formData.notableMoment}
          onWhatWentWellChange={(v) => updateField("whatWentWell", v)}
          onWhatToImproveChange={(v) => updateField("whatToImprove", v)}
          onNotableMomentChange={(v) => updateField("notableMoment", v)}
        />
      )}

      <div className="flex gap-3 pt-4">
        {step > 0 && (
          <button
            onClick={prevStep}
            className="flex-1 border border-[#252525] text-[#888888] py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:border-[#333333] hover:text-white transition-colors"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={!isStepValid}
            className="flex-1 bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Log Approach"}
          </button>
        )}
      </div>
    </div>
  );
}
