import { useState, useMemo, useCallback, useEffect } from "react";
import type { PhaseReached, Outcome, OpenerType, Approach } from "@/lib/firebase/types";
import { logApproach, updateApproach } from "@/lib/firebase/queries/approaches";
import { calcOverallScore } from "@/lib/utils/scores";

interface ApproachFormData {
  sessionId:       string;
  phaseReached:    PhaseReached;
  outcome:         Outcome;
  openerType:      OpenerType;
  scoreExecution:  number;
  scoreTonality:   number;
  scoreInvestment: number;
  scoreClose:      number;
  scoreRecovery:   number;
  whatWentWell:    string;
  whatToImprove:   string;
  notableMoment:   string;
  tags:            string[];
}

const defaultFormData: ApproachFormData = {
  sessionId:       "",
  phaseReached:    "opener",
  outcome:         "declined",
  openerType:      "direct",
  scoreExecution:  5,
  scoreTonality:   5,
  scoreInvestment: 5,
  scoreClose:      5,
  scoreRecovery:   5,
  whatWentWell:    "",
  whatToImprove:   "",
  notableMoment:   "",
  tags:            [],
};

function approachToFormData(a: Approach): ApproachFormData {
  return {
    sessionId:       a.sessionId,
    phaseReached:    a.phaseReached,
    outcome:         a.outcome,
    openerType:      a.openerType      ?? "direct",
    scoreExecution:  a.scoreExecution,
    scoreTonality:   a.scoreTonality,
    scoreInvestment: a.scoreInvestment,
    scoreClose:      a.scoreClose,
    scoreRecovery:   a.scoreRecovery,
    whatWentWell:    a.whatWentWell    ?? "",
    whatToImprove:   a.whatToImprove   ?? "",
    notableMoment:   a.notableMoment   ?? "",
    tags:            a.tags            ?? [],
  };
}

interface UseApproachLoggerOptions {
  existingApproach?: Approach;  // if set, form is in edit mode
}

export function useApproachLogger(
  userId: string,
  options: UseApproachLoggerOptions = {}
) {
  const { existingApproach } = options;
  const isEditMode = !!existingApproach;

  const [step,       setStep]       = useState(0);
  const [formData,   setFormData]   = useState<ApproachFormData>(
    existingApproach ? approachToFormData(existingApproach) : defaultFormData
  );
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // If existingApproach changes (e.g. user clicks edit on a different approach),
  // reset form data to the new approach
  useEffect(() => {
    if (existingApproach) {
      setFormData(approachToFormData(existingApproach));
      setStep(0);
      setIsComplete(false);
      setError(null);
    }
  }, [existingApproach?.approachId]);

  const liveScore = useMemo(() => calcOverallScore({
    execution:  formData.scoreExecution,
    tonality:   formData.scoreTonality,
    investment: formData.scoreInvestment,
    close:      formData.scoreClose,
    recovery:   formData.scoreRecovery,
  }), [formData]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0: return !!(formData.phaseReached && formData.outcome);
      case 1: return formData.scoreExecution >= 1 && formData.scoreTonality >= 1;
      case 2: return formData.scoreInvestment >= 1 && formData.scoreClose >= 1 && formData.scoreRecovery >= 1;
      case 3: return true;
      default: return false;
    }
  }, [step, formData]);

  const progress = useMemo(() => ((step + 1) / 4) * 100, [step]);

  const updateField = useCallback(<K extends keyof ApproachFormData>(
    field: K, value: ApproachFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (isStepValid && step < 3) setStep((s) => s + 1);
  }, [isStepValid, step]);

  const prevStep = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  /**
   * Submit — creates new approach or updates existing one.
   * sessionId can be passed directly to avoid React state batching issues.
   */
  const submit = useCallback(async (sessionId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const resolvedSessionId = sessionId || formData.sessionId;

      if (isEditMode && existingApproach) {
        // UPDATE existing approach
        await updateApproach(existingApproach.approachId, {
          sessionId:       resolvedSessionId || existingApproach.sessionId,
          phaseReached:    formData.phaseReached,
          outcome:         formData.outcome,
          openerType:      formData.openerType,
          scoreExecution:  formData.scoreExecution,
          scoreTonality:   formData.scoreTonality,
          scoreInvestment: formData.scoreInvestment,
          scoreClose:      formData.scoreClose,
          scoreRecovery:   formData.scoreRecovery,
          whatWentWell:    formData.whatWentWell,
          whatToImprove:   formData.whatToImprove,
          notableMoment:   formData.notableMoment,
          tags:            formData.tags,
        });
      } else {
        // CREATE new approach
        if (!resolvedSessionId) {
          throw new Error("No session ID. Please start a session first.");
        }
        await logApproach(userId, {
          sessionId:       resolvedSessionId,
          phaseReached:    formData.phaseReached,
          outcome:         formData.outcome,
          openerType:      formData.openerType,
          scoreExecution:  formData.scoreExecution,
          scoreTonality:   formData.scoreTonality,
          scoreInvestment: formData.scoreInvestment,
          scoreClose:      formData.scoreClose,
          scoreRecovery:   formData.scoreRecovery,
          whatWentWell:    formData.whatWentWell,
          whatToImprove:   formData.whatToImprove,
          notableMoment:   formData.notableMoment,
          tags:            formData.tags,
          coachStyle:      "",
          environment:     "",
        } as any);
      }

      setIsComplete(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save approach");
    } finally {
      setLoading(false);
    }
  }, [userId, formData, isEditMode, existingApproach]);

  const reset = useCallback(() => {
    setStep(0);
    setFormData(defaultFormData);
    setLoading(false);
    setError(null);
    setIsComplete(false);
  }, []);

  return {
    step, formData, loading, error, isComplete, isEditMode,
    liveScore, isStepValid, progress,
    updateField, nextStep, prevStep, submit, reset,
  };
}