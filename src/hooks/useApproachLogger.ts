import { useState, useMemo, useCallback } from "react";
import type { PhaseReached, Outcome, OpenerType, Approach } from "@/lib/firebase/types";
import { logApproach } from "@/lib/firebase/queries/approaches";
import { calcOverallScore } from "@/lib/utils/scores";

interface ApproachFormData {
  sessionId: string;
  phaseReached: PhaseReached;
  outcome: Outcome;
  openerType: OpenerType;
  scoreExecution: number;
  scoreTonality: number;
  scoreInvestment: number;
  scoreClose: number;
  scoreRecovery: number;
  whatWentWell: string;
  whatToImprove: string;
  notableMoment: string;
  tags: string[];
}

const initialFormData: ApproachFormData = {
  sessionId: "",
  phaseReached: "opener",
  outcome: "declined",
  openerType: "direct",
  scoreExecution: 5,
  scoreTonality: 5,
  scoreInvestment: 5,
  scoreClose: 5,
  scoreRecovery: 5,
  whatWentWell: "",
  whatToImprove: "",
  notableMoment: "",
  tags: [],
};

export function useApproachLogger(userId: string) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ApproachFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const liveScore = useMemo(() => {
    return calcOverallScore({
      execution: formData.scoreExecution,
      tonality: formData.scoreTonality,
      investment: formData.scoreInvestment,
      close: formData.scoreClose,
      recovery: formData.scoreRecovery,
    });
  }, [formData]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0:
        return formData.phaseReached && formData.outcome;
      case 1:
        return formData.scoreExecution + formData.scoreTonality >= 1;
      case 2:
        return formData.scoreInvestment + formData.scoreClose + formData.scoreRecovery >= 1;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, formData]);

  const progress = useMemo(() => {
    return ((step + 1) / 4) * 100;
  }, [step]);

  const updateField = useCallback(<K extends keyof ApproachFormData>(
    field: K,
    value: ApproachFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (isStepValid && step < 3) {
      setStep((s) => s + 1);
    }
  }, [isStepValid, step]);

  const prevStep = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  }, [step]);

  const submit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const approachData = {
        sessionId: formData.sessionId,
        phaseReached: formData.phaseReached,
        outcome: formData.outcome,
        openerType: formData.openerType,
        scoreExecution: formData.scoreExecution,
        scoreTonality: formData.scoreTonality,
        scoreInvestment: formData.scoreInvestment,
        scoreClose: formData.scoreClose,
        scoreRecovery: formData.scoreRecovery,
        whatWentWell: formData.whatWentWell,
        whatToImprove: formData.whatToImprove,
        notableMoment: formData.notableMoment,
        tags: formData.tags,
      };
      await logApproach(userId, approachData as any);
      setIsComplete(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to log approach");
    } finally {
      setLoading(false);
    }
  }, [userId, formData]);

  const reset = useCallback(() => {
    setStep(0);
    setFormData(initialFormData);
    setLoading(false);
    setError(null);
    setIsComplete(false);
  }, []);

  return {
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
  };
}
