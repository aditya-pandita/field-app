"use client";

import { SelfRating } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface PivotRatingProps {
  onRate: (rating: SelfRating) => void;
}

export function PivotRating({ onRate }: PivotRatingProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-[family-name:var(--font-syne)] text-xl text-center">How was the pivot?</h3>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onRate("smooth")}
          className="py-6 border border-[#22C55E] text-[#22C55E] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:bg-[#22C55E] hover:text-white transition-colors"
        >
          Smooth
        </button>
        <button
          onClick={() => onRate("awkward")}
          className="py-6 border border-[#EAB308] text-[#EAB308] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:bg-[#EAB308] hover:text-white transition-colors"
        >
          Awkward
        </button>
        <button
          onClick={() => onRate("blank")}
          className="py-6 border border-[#EF4444] text-[#EF4444] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:bg-[#EF4444] hover:text-white transition-colors"
        >
          Blank
        </button>
      </div>
    </div>
  );
}
