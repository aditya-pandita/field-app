"use client";

import { Outcome } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface OutcomeSelectorProps {
  value: Outcome;
  onChange: (value: Outcome) => void;
}

const OUTCOMES: { id: Outcome; label: string; positive?: boolean }[] = [
  { id: "number", label: "Number", positive: true },
  { id: "instant_date", label: "Instant Date", positive: true },
  { id: "social_media", label: "Social Media", positive: true },
  { id: "declined", label: "Declined" },
  { id: "walked_away", label: "Walked Away" },
  { id: "interrupted", label: "Interrupted" },
];

export function OutcomeSelector({ value, onChange }: OutcomeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888]">
        Outcome
      </label>
      <div className="grid grid-cols-3 gap-2">
        {OUTCOMES.map((outcome) => (
          <button
            key={outcome.id}
            type="button"
            onClick={() => onChange(outcome.id)}
            className={cn(
              "py-3 px-2 text-xs font-[family-name:var(--font-jetbrains)] uppercase tracking-wider transition-all border min-h-[56px] flex items-center justify-center",
              value === outcome.id
                ? "border-[#FF5500] bg-[#FF5500]/10 text-white"
                : outcome.positive
                ? "border-[#252525]/50 bg-[#1A1A1A]/50 text-[#666666] hover:border-[#333333]"
                : "border-[#252525] text-[#666666] hover:border-[#333333]"
            )}
          >
            {outcome.label}
          </button>
        ))}
      </div>
    </div>
  );
}
