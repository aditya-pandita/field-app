"use client";

// src/components/approach/PhaseSelector.tsx
// Phase selector with conversation framework descriptions shown as context.

import { PhaseReached } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface PhaseSelectorProps {
  value: PhaseReached;
  onChange: (value: PhaseReached) => void;
}

const PHASES: {
  id: PhaseReached;
  label: string;
  subtitle: string;
  description: string;
  signal: string;
}[] = [
  {
    id: "opener",
    label: "Opener",
    subtitle: "The Stop + Direct Compliment",
    description:
      "You stopped her and stated your intention. You gave a genuine, specific observation — not a generic compliment.",
    signal: "She turned to face you and acknowledged you.",
  },
  {
    id: "stack",
    label: "Stack",
    subtitle: "Cold Reads & Observations",
    description:
      "You bridged immediately into 2–3 cold reads or observations without waiting for her to lead. Made her feel seen, not interrogated.",
    signal: "She corrected your read, elaborated, or started engaging with your observations.",
  },
  {
    id: "hook",
    label: "Hook",
    subtitle: "She Started Investing",
    description:
      "The moment she shifted from being stopped by you to actively participating. She asked YOU a question, qualified herself, or showed genuine curiosity.",
    signal: "She asked something back. She's no longer just responding — she's contributing.",
  },
  {
    id: "rapport",
    label: "Rapport",
    subtitle: "Real Connection",
    description:
      "You went beneath surface level. You shared something real about yourself first, found what lights her up, mixed attraction with depth.",
    signal: "The conversation felt mutual. She was sharing, not just answering.",
  },
  {
    id: "close",
    label: "Close",
    subtitle: "Number · Instant Date · Bounce",
    description:
      "You led the close before the energy dipped. You invited — didn't ask for permission. Could be number, instant date, or a graceful exit.",
    signal: "You attempted to continue things beyond the interaction.",
  },
];

export function PhaseSelector({ value, onChange }: PhaseSelectorProps) {
  const currentIndex = PHASES.findIndex((p) => p.id === value);
  const activePhase  = PHASES[currentIndex];

  return (
    <div className="space-y-4">
      <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888]">
        Phase Reached
      </label>

      {/* Phase pipeline buttons */}
      <div className="flex gap-1 overflow-x-auto hide-scrollbar">
        {PHASES.map((phase, idx) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(phase.id)}
            className={cn(
              "flex-1 min-w-[80px] py-3 px-2 text-xs font-[family-name:var(--font-jetbrains)] uppercase tracking-wider transition-all border",
              idx <= currentIndex
                ? "border-l-[3px] border-l-[#FF5500] border-t-[#FF5500]/30 border-r-[#FF5500]/30 border-b-[#FF5500]/30 bg-[#FF5500]/10 text-white"
                : "border-[#252525] text-[#666666] hover:border-[#333333] hover:text-[#888888]"
            )}
          >
            <span className="block font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] mb-1">
              0{idx + 1}
            </span>
            {phase.label}
          </button>
        ))}
      </div>

      {/* Active phase description */}
      {activePhase && (
        <div className="border border-[#1A1A1A] border-l-2 border-l-[#FF5500] bg-[#FF5500]/5 p-4 space-y-2">
          <div>
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#FF5500] uppercase tracking-widest">
              PHASE {currentIndex + 1} — {activePhase.label.toUpperCase()}
            </span>
            <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#666666] mt-0.5">
              {activePhase.subtitle}
            </p>
          </div>
          <p className="text-[#888888] text-xs leading-relaxed">
            {activePhase.description}
          </p>
          <div className="pt-1 border-t border-[#1A1A1A]">
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
              SIGNAL:{" "}
            </span>
            <span className="text-[#666666] text-xs italic">
              {activePhase.signal}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}