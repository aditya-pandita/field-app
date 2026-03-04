"use client";

import Link from "next/link";
import { ArrowRight, X, Phone, Instagram } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Lead, LeadStage } from "@/lib/firebase/types";
import { moveLeadStage } from "@/lib/firebase/queries/leads";

interface LeadCardProps {
  lead: Lead;
  onStageChange?: (leadId: string, stage: LeadStage) => void;
}

const STAGE_ORDER: LeadStage[] = ["lead", "texting", "date_set", "dating", "intimate", "dead"];

const STAGE_LABELS: Record<LeadStage, string> = {
  lead:     "Lead",
  texting:  "Texting",
  date_set: "Date Set",
  dating:   "Dating",
  intimate: "Intimate",
  dead:     "Dead",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function LeadCard({ lead, onStageChange }: LeadCardProps) {
  const currentIdx = STAGE_ORDER.indexOf(lead.stage);
  const nextStage = currentIdx < STAGE_ORDER.length - 2 ? STAGE_ORDER[currentIdx + 1] : null;
  const isDead = lead.stage === "dead";

  const handleAdvance = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!nextStage) return;
    await moveLeadStage(lead.leadId, nextStage);
    onStageChange?.(lead.leadId, nextStage);
  };

  const handleKill = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDead) return;
    await moveLeadStage(lead.leadId, "dead");
    onStageChange?.(lead.leadId, "dead");
  };

  return (
    <Link href={`/pipeline/${lead.leadId}`} className="block group">
      <div className="border border-[#252525] bg-black hover:bg-[#0A0A0A] hover:border-[#333333] transition-all duration-150 p-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 bg-[#1A1A1A] border border-[#252525] flex items-center justify-center flex-shrink-0">
            {lead.photoUrl ? (
              <img src={lead.photoUrl} alt={lead.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#666666]">
                {getInitials(lead.name) || "?"}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-['Syne'] text-[13px] font-bold text-white truncate">
              {lead.name || "Unnamed"}
            </div>
            {lead.vibeNotes && (
              <div className="font-['JetBrains_Mono'] text-[9px] text-[#666666] truncate mt-0.5">
                {lead.vibeNotes}
              </div>
            )}
            {/* Contact badges */}
            <div className="flex gap-1.5 mt-1.5">
              {lead.phone && (
                <span className="flex items-center gap-0.5 text-[#444444]">
                  <Phone size={9} />
                </span>
              )}
              {lead.instagram && (
                <span className="flex items-center gap-0.5 text-[#444444]">
                  <Instagram size={9} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {!isDead && (
          <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {nextStage && (
              <button
                onClick={handleAdvance}
                className="flex items-center gap-1 px-2 py-1 border border-[#FF5500]/40 text-[#FF5500] hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.07)] transition-colors font-['JetBrains_Mono'] text-[8px] tracking-[1px] uppercase"
              >
                <ArrowRight size={9} />
                {STAGE_LABELS[nextStage]}
              </button>
            )}
            <button
              onClick={handleKill}
              className="flex items-center gap-1 px-2 py-1 border border-[#333333] text-[#4A4A4A] hover:border-[#EF4444]/50 hover:text-[#EF4444] transition-colors font-['JetBrains_Mono'] text-[8px] tracking-[1px] uppercase"
            >
              <X size={9} />
              Dead
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
