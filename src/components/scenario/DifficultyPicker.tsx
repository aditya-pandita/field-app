"use client";

import { Difficulty, DIFFICULTY_MODIFIERS } from "@/lib/scenario/prompts";
import { cn } from "@/lib/utils";

interface DifficultyPickerProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ["warm", "neutral", "cold", "resistant"];

export function DifficultyPicker({ selected, onSelect }: DifficultyPickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {DIFFICULTIES.map((difficulty) => {
        const config = DIFFICULTY_MODIFIERS[difficulty];
        return (
          <button
            key={difficulty}
            onClick={() => onSelect(difficulty)}
            className={cn(
              "p-4 border text-left transition-all",
              selected === difficulty
                ? "border-[#FF5500] bg-[#FF5500]/10"
                : "border-[#252525] hover:border-[#333333] bg-[#111111]"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: config.color }}
              />
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase">
                {config.label}
              </span>
            </div>
            <p className="text-xs text-[#666666]">{config.description}</p>
          </button>
        );
      })}
    </div>
  );
}
