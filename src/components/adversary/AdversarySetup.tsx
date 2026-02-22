"use client";

import { AdversaryIntensity } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface AdversarySetupProps {
  selectedArchetype: string | null;
  intensity: AdversaryIntensity;
  onIntensityChange: (intensity: AdversaryIntensity) => void;
  onBegin: () => void;
  canBegin: boolean;
}

export function AdversarySetup({ selectedArchetype, intensity, onIntensityChange, onBegin, canBegin }: AdversarySetupProps) {
  return (
    <div className="space-y-6">
      {selectedArchetype ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onIntensityChange("controlled")}
              className={cn(
                "p-4 border text-center transition-all",
                intensity === "controlled"
                  ? "border-[#EF4444] bg-[#EF4444]/10"
                  : "border-[#252525] hover:border-[#333333] bg-[#111111]"
              )}
            >
              <span className="font-[family-name:var(--font-syne)]">Controlled</span>
              <p className="text-xs text-[#666666] mt-1">Allow moments</p>
            </button>
            <button
              onClick={() => onIntensityChange("full")}
              className={cn(
                "p-4 border text-center transition-all",
                intensity === "full"
                  ? "border-[#EF4444] bg-[#EF4444]/10"
                  : "border-[#252525] hover:border-[#333333] bg-[#111111]"
              )}
            >
              <span className="font-[family-name:var(--font-syne)]">Full</span>
              <p className="text-xs text-[#666666] mt-1">Pure resistance</p>
            </button>
          </div>

          <button
            onClick={onBegin}
            disabled={!canBegin}
            className="w-full bg-[#EF4444] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#DC2626] transition-colors disabled:opacity-50"
          >
            Begin Training
          </button>
        </>
      ) : (
        <p className="text-center text-[#666666]">Select an archetype above</p>
      )}
    </div>
  );
}
