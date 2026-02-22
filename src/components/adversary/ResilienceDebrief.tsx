"use client";

import { AdversaryDebrief } from "@/lib/firebase/types";
import { getScoreColor } from "@/lib/utils/scores";
import { ScoreRing } from "@/components/ui/ScoreRing";

interface ResilienceDebriefProps {
  debrief: AdversaryDebrief;
  loading?: boolean;
  onDone: () => void;
}

export function ResilienceDebrief({ debrief, loading, onDone }: ResilienceDebriefProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-4 h-4 bg-[#EF4444] rounded-full animate-pulse mb-4" />
        <p className="text-[#666666] text-sm">Analyzing session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <ScoreRing score={Math.round(debrief.resilienceScore)} size="lg" showLabel />
      </div>

      <div className="p-4 bg-[#111111] border border-[#252525]">
        <p className="text-[#888888] text-sm italic">"{debrief.stoicQuote}"</p>
        <p className="text-[#666666] text-xs mt-2">— Stoic Wisdom</p>
      </div>

      <div className="p-4 bg-[#111111] border border-[#252525]">
        <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Insight
        </h4>
        <p className="text-sm text-[#888888]">{debrief.stoicInsight}</p>
      </div>

      <div className="p-4 bg-[#111111] border border-[#252525]">
        <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Coach Note
        </h4>
        <p className="text-sm text-[#888888]">{debrief.coachNote}</p>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-[#EF4444] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#DC2626] transition-colors"
      >
        Done
      </button>
    </div>
  );
}
