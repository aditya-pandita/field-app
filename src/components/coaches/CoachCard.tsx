"use client";

import { CoachStyle } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface CoachCardProps {
  coach: CoachStyle;
  expanded?: boolean;
  onToggle?: () => void;
}

const ACCENT_COLORS = ["#FF5500", "#3B82F6", "#22C55E", "#EAB308", "#EF4444", "#8B5CF6"];

export function CoachCard({ coach, expanded, onToggle }: CoachCardProps) {
  const accentIndex = coach.slug.charCodeAt(0) % ACCENT_COLORS.length;
  const accent = ACCENT_COLORS[accentIndex];

  return (
    <div className="bg-[#111111] border border-[#252525] overflow-hidden">
      <div className="h-1" style={{ backgroundColor: accent }} />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-syne)] text-lg">{coach.name}</h3>
            <p className="text-xs text-[#666666] font-[family-name:var(--font-jetbrains)] uppercase mt-1">
              {coach.styleTag}
            </p>
          </div>
          <button
            onClick={onToggle}
            className="text-[#666666] hover:text-white transition-colors"
          >
            {expanded ? "−" : "+"}
          </button>
        </div>

        <p className="text-sm text-[#888888] mt-3 line-clamp-2">{coach.philosophy}</p>

        <div className="flex flex-wrap gap-1 mt-3">
          {coach.signatureTechniques.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-[#1A1A1A] text-[10px] text-[#666666] border border-[#252525]"
            >
              {tech}
            </span>
          ))}
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#252525] space-y-4 animate-fade-up">
            <div>
              <h4 className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest text-[#888888] mb-2">
                Approach Method
              </h4>
              <p className="text-sm text-[#888888]">{coach.approachMethod}</p>
            </div>
            <div className="p-3 bg-[rgba(255,85,0,0.07)] border-l-2 border-[#FF5500]">
              <h4 className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest text-[#FF5500] mb-2">
                Example Opener
              </h4>
              <p className="text-sm text-white italic">"{coach.exampleOpener}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
