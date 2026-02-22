"use client";

import { Approach, PhaseReached, Outcome } from "@/lib/firebase/types";
import { getScoreColor, getPhaseLabel } from "@/lib/utils/scores";
import { cn } from "@/lib/utils";

interface ApproachCardProps {
  approach: Approach;
  onClick?: () => void;
}

const PHASES: PhaseReached[] = ["opener", "stack", "hook", "rapport", "close"];

const OUTCOME_LABELS: Record<Outcome, string> = {
  number: "Number",
  instant_date: "Instant Date",
  social_media: "Social Media",
  declined: "Declined",
  walked_away: "Walked Away",
  interrupted: "Interrupted",
};

export function ApproachCard({ approach, onClick }: ApproachCardProps) {
  const phaseIndex = PHASES.indexOf(approach.phaseReached);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#111111] border border-[#252525] p-4 cursor-pointer hover:border-[#333333] transition-all",
        onClick && "hover:translate-x-1"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#666666] uppercase">
          {new Date(approach.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span
          className="font-[family-name:var(--font-syne)] text-lg"
          style={{ color: getScoreColor(approach.scoreOverall) }}
        >
          {approach.scoreOverall.toFixed(1)}
        </span>
      </div>

      <div className="flex gap-1 mb-3">
        {PHASES.map((phase, idx) => (
          <div
            key={phase}
            className={cn(
              "flex-1 h-1.5",
              idx <= phaseIndex ? "bg-[#FF5500]" : "bg-[#252525]"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-[family-name:var(--font-jetbrains)] text-[#666666] uppercase mb-3">
        <span>Opener</span>
        <span>Stack</span>
        <span>Hook</span>
        <span>Rapport</span>
        <span>Close</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#888888] font-[family-name:var(--font-jetbrains)] uppercase">
          {OUTCOME_LABELS[approach.outcome]}
        </span>
        <span className="text-xs text-[#666666] font-[family-name:var(--font-jetbrains)]">
          {getPhaseLabel(phaseIndex)}
        </span>
      </div>

      {approach.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {approach.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[#1A1A1A] border border-[#252525] text-[10px] font-[family-name:var(--font-jetbrains)] text-[#666666]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
