"use client";

import { useState, useCallback } from "react";
import { PipelineColumn } from "./PipelineColumn";
import type { Lead, LeadStage } from "@/lib/firebase/types";

interface PipelineBoardProps {
  initialLeads: Lead[];
}

const STAGES: { stage: LeadStage; label: string }[] = [
  { stage: "lead",     label: "Lead"     },
  { stage: "texting",  label: "Texting"  },
  { stage: "date_set", label: "Date Set" },
  { stage: "dating",   label: "Dating"   },
  { stage: "intimate", label: "Intimate" },
  { stage: "dead",     label: "Dead"     },
];

export function PipelineBoard({ initialLeads }: PipelineBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const handleStageChange = useCallback((leadId: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.leadId === leadId ? { ...l, stage, updatedAt: new Date() } : l))
    );
  }, []);

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex gap-5 min-w-max">
        {STAGES.map(({ stage, label }) => (
          <PipelineColumn
            key={stage}
            stage={stage}
            label={label}
            leads={leads.filter((l) => l.stage === stage)}
            onStageChange={handleStageChange}
          />
        ))}
      </div>
    </div>
  );
}
