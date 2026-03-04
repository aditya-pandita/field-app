"use client";

import { useRouter } from "next/navigation";
import { Outcome } from "@/lib/firebase/types";
import { ScoreRing } from "@/components/ui/ScoreRing";

interface LoggerSuccessProps {
  score: number;
  outcome: Outcome;
  onLogAnother: () => void;
  onDone: () => void;
  approachId?: string | null;
  sessionId?: string | null;
}

const OUTCOME_LABELS: Record<Outcome, string> = {
  number: "Number Got",
  instant_date: "Instant Date",
  social_media: "Social Media",
  declined: "Declined",
  walked_away: "Walked Away",
  interrupted: "Interrupted",
};

export function LoggerSuccess({ score, outcome, onLogAnother, onDone, approachId, sessionId }: LoggerSuccessProps) {
  const router = useRouter();

  const handleAddToPipeline = () => {
    const params = new URLSearchParams();
    if (approachId) params.set("approachId", approachId);
    if (sessionId) params.set("sessionId", sessionId);
    const query = params.toString();
    router.push(`/pipeline/new${query ? `?${query}` : ""}`);
  };

  const isContact = outcome === "number" || outcome === "social_media" || outcome === "instant_date";

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <ScoreRing score={score} size="lg" showLabel />
      
      <div className="px-4 py-2 bg-[#FF5500]/10 border border-[#FF5500]">
        <span className="font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest text-[#FF5500]">
          {OUTCOME_LABELS[outcome]}
        </span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-[#888888] text-sm">Approach logged successfully</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onLogAnother}
          className="w-full bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
        >
          Log Another
        </button>
        {isContact && (
          <button
            onClick={handleAddToPipeline}
            className="w-full border border-[#FF5500]/50 text-[#FF5500] py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.07)] transition-colors"
          >
            + Add to Pipeline →
          </button>
        )}
        <button
          onClick={onDone}
          className="w-full border border-[#252525] text-[#888888] py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:border-[#333333] hover:text-white transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
