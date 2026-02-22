"use client";

import { scenarios } from "@/lib/scenario/scenarios";
import { cn } from "@/lib/utils";

interface ScenarioPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ScenarioPicker({ selectedId, onSelect }: ScenarioPickerProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.id)}
          className={cn(
            "p-4 border text-left transition-all",
            selectedId === scenario.id
              ? "border-[#FF5500] bg-[#FF5500]/10"
              : "border-[#252525] hover:border-[#333333] bg-[#111111]"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-[family-name:var(--font-syne)] text-lg">{scenario.name}</span>
            <span className="text-xs font-[family-name:var(--font-jetbrains)] text-[#666666] uppercase">
              {scenario.age}
            </span>
          </div>
          <p className="text-xs text-[#888888] mb-1">{scenario.nationality} {scenario.occupation}</p>
          <p className="text-xs text-[#666666]">{scenario.location}</p>
        </button>
      ))}
    </div>
  );
}
