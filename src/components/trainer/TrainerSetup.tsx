"use client";

import { TrainerDifficulty } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface TrainerSetupProps {
  onSelect: (difficulty: TrainerDifficulty) => void;
  onStart: () => void;
  selected?: TrainerDifficulty | null;
}

const OPTIONS: { difficulty: TrainerDifficulty; timeLimit: number; topicCount: number; label: string; description: string }[] = [
  { difficulty: "easy",   timeLimit: 60, topicCount: 5, label: "Easy",   description: "60 seconds per topic" },
  { difficulty: "medium", timeLimit: 45, topicCount: 6, label: "Medium", description: "45 seconds per topic" },
  { difficulty: "hard",   timeLimit: 30, topicCount: 7, label: "Hard",   description: "30 seconds per topic" },
];

export function TrainerSetup({ onSelect, onStart, selected }: TrainerSetupProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-syne)] text-2xl mb-2">Conversation Drill</h2>
        <p className="text-[#666666] text-sm">Practice pivoting between topics under time pressure</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {OPTIONS.map((option) => (
          <button
            key={option.difficulty}
            onClick={() => onSelect(option.difficulty)}
            className={cn(
              "p-6 border text-left transition-all",
              selected === option.difficulty
                ? "border-[#FF5500] bg-[#FF5500]/10"
                : "border-[#252525] hover:border-[#333333] bg-[#111111]"
            )}
          >
            <span className="font-[family-name:var(--font-syne)] text-xl">{option.label}</span>
            <p className="text-[#888888] text-sm mt-1">{option.description}</p>
            <div className="mt-4 flex gap-4 text-xs font-[family-name:var(--font-jetbrains)] text-[#666666]">
              <span>{option.timeLimit}s</span>
              <span>{option.topicCount} topics</span>
            </div>
          </button>
        ))}
      </div>

      {/* Start button — only shown when a difficulty is selected */}
      <button
        onClick={onStart}
        disabled={!selected}
        className={cn(
          "w-full py-4 font-[family-name:var(--font-jetbrains)] text-xs tracking-widest uppercase transition-all",
          selected
            ? "bg-[#FF5500] text-white hover:bg-[#E64D00] cursor-pointer"
            : "bg-[#1A1A1A] text-[#444444] cursor-not-allowed border border-[#252525]"
        )}
      >
        {selected ? `START ${selected.toUpperCase()} DRILL →` : "SELECT A DIFFICULTY"}
      </button>
    </div>
  );
}