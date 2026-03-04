"use client";

import { LeadCard } from "./LeadCard";
import type { Lead, LeadStage } from "@/lib/firebase/types";

interface PipelineColumnProps {
  stage: LeadStage;
  label: string;
  leads: Lead[];
  onStageChange?: (leadId: string, stage: LeadStage) => void;
}

const STAGE_ACCENT: Record<LeadStage, string> = {
  lead:     "#FF5500",
  texting:  "#FF8C00",
  date_set: "#FFB700",
  dating:   "#22C55E",
  intimate: "#A855F7",
  dead:     "#4A4A4A",
};

export function PipelineColumn({ stage, label, leads, onStageChange }: PipelineColumnProps) {
  const accent = STAGE_ACCENT[stage];

  return (
    <div className="flex flex-col w-[220px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <span
            className="font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase"
            style={{ color: accent }}
          >
            {label}
          </span>
        </div>
        <span className="font-['JetBrains_Mono'] text-[9px] text-[#333333]">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {leads.length === 0 ? (
          <div className="border border-dashed border-[#1A1A1A] p-4 text-center">
            <span className="font-['JetBrains_Mono'] text-[8px] text-[#333333] uppercase tracking-[2px]">
              Empty
            </span>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.leadId} lead={lead} onStageChange={onStageChange} />
          ))
        )}
      </div>
    </div>
  );
}
