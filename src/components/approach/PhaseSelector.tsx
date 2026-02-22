"use client";

import { PhaseReached } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface PhaseSelectorProps {
  value: PhaseReached;
  onChange: (value: PhaseReached) => void;
}

const PHASES: { id: PhaseReached; label: string }[] = [
  { id: "opener", label: "Opener" },
  { id: "stack", label: "Stack" },
  { id: "hook", label: "Hook" },
  { id: "rapport", label: "Rapport" },
  { id: "close", label: "Close" },
];

export function PhaseSelector({ value, onChange }: PhaseSelectorProps) {
  const currentIndex = PHASES.findIndex((p) => p.id === value);

  return (
    <div className="space-y-2">
      <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888]">
        Phase Reached
      </label>
      <div className="flex gap-1 overflow-x-auto hide-scrollbar">
        {PHASES.map((phase, idx) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(phase.id)}
            className={cn(
              "flex-1 min-w-[80px] py-3 px-2 text-xs font-[family-name:var(--font-jetbrains)] uppercase tracking-wider transition-all border",
              idx <= currentIndex
                ? "border-l-[#FF5500] border-l-3 bg-[#FF5500]/10 text-white"
                : "border-[#252525] text-[#666666] hover:border-[#333333]"
            )}
          >
            {phase.label}
          </button>
        ))}
      </div>
    </div>
  );
}
