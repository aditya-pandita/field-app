"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarDays, ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getLeadById, updateLead, deleteLead, moveLeadStage } from "@/lib/firebase/queries/leads";
import { LeadProfileForm } from "@/components/pipeline/LeadProfileForm";
import { PushPullTopics } from "@/components/pipeline/PushPullTopics";
import { cn } from "@/lib/utils/cn";
import type { Lead, LeadStage, NewLead } from "@/lib/firebase/types";

const STAGE_ORDER: LeadStage[] = ["lead", "texting", "date_set", "dating", "intimate", "dead"];

const STAGE_LABELS: Record<LeadStage, string> = {
  lead:     "Lead",
  texting:  "Texting",
  date_set: "Date Set",
  dating:   "Dating",
  intimate: "Intimate",
  dead:     "Dead",
};

const STAGE_COLORS: Record<LeadStage, string> = {
  lead:     "#FF5500",
  texting:  "#FF8C00",
  date_set: "#FFB700",
  dating:   "#22C55E",
  intimate: "#A855F7",
  dead:     "#4A4A4A",
};

function buildCalendarUrl(name: string): string {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  start.setHours(19, 0, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0];

  const params = new URLSearchParams({
    action:  "TEMPLATE",
    text:    `Date with ${name}`,
    dates:   `${fmt(start)}/${fmt(end)}`,
    details: "Planned via Field pipeline",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}

export default function LeadDetailPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { leadId } = useParams<{ leadId: string }>();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    getLeadById(leadId)
      .then(setLead)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [leadId]);

  const handleSave = async (data: NewLead) => {
    if (!lead) return;
    setSaving(true);
    try {
      await updateLead(lead.leadId, data);
      setLead({ ...lead, ...data, updatedAt: new Date() });
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (stage: LeadStage) => {
    if (!lead) return;
    await moveLeadStage(lead.leadId, stage);
    setLead({ ...lead, stage, updatedAt: new Date() });
  };

  const handleDelete = async () => {
    if (!lead || !confirm(`Delete ${lead.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteLead(lead.leadId);
      router.push("/pipeline");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="font-['JetBrains_Mono'] text-[#666666] text-[10px] uppercase tracking-widest">
          Lead not found
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <div className="mb-8">
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
            PIPELINE
          </p>
          <h1 className="font-['Syne'] text-4xl font-bold text-white mb-2">
            Edit — {lead.name}
          </h1>
        </div>
        <div className="h-px bg-[#1A1A1A] mb-8" />
        <LeadProfileForm
          initialData={lead}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          loading={saving}
        />
      </div>
    );
  }

  const stageColor = STAGE_COLORS[lead.stage];

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.push("/pipeline")}
        className="flex items-center gap-2 font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] hover:text-white uppercase tracking-[2px] transition-colors mb-8"
      >
        <ArrowLeft size={12} />
        Pipeline
      </button>

      {/* Hero row */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-16 h-16 bg-[#1A1A1A] border border-[#252525] flex items-center justify-center flex-shrink-0">
          {lead.photoUrl ? (
            <img src={lead.photoUrl} alt={lead.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-['JetBrains_Mono'] text-[18px] text-[#666666]">
              {getInitials(lead.name) || "?"}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[2px] mb-1"
            style={{ color: stageColor }}
          >
            {STAGE_LABELS[lead.stage]}
          </div>
          <h1 className="font-['Syne'] text-3xl font-bold text-white truncate">
            {lead.name}
          </h1>
          {lead.vibeNotes && (
            <p className="text-[#666666] text-sm mt-1 truncate">{lead.vibeNotes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <a
            href={buildCalendarUrl(lead.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border border-[#252525] text-[#888888] hover:border-[#4A4A4A] hover:text-white transition-colors font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase"
          >
            <CalendarDays size={12} />
            Calendar
          </a>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#252525] text-[#888888] hover:border-[#4A4A4A] hover:text-white transition-colors font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#333333] text-[#4A4A4A] hover:border-[#EF4444]/50 hover:text-[#EF4444] disabled:opacity-40 transition-colors font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase"
          >
            <Trash2 size={12} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="h-px bg-[#1A1A1A] mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Left column */}
        <div className="space-y-8">
          {/* Stage selector */}
          <div>
            <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] uppercase tracking-[2px] mb-3">
              Stage
            </p>
            <div className="flex flex-wrap gap-2">
              {STAGE_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStageChange(s)}
                  className={cn(
                    "px-3 py-1.5 border font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase transition-colors",
                    lead.stage === s
                      ? "text-white"
                      : "border-[#252525] text-[#4A4A4A] hover:border-[#333333]"
                  )}
                  style={
                    lead.stage === s
                      ? { borderColor: stageColor, color: stageColor, backgroundColor: `${stageColor}11` }
                      : {}
                  }
                >
                  {STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          {lead.appearanceNotes && (
            <div>
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] uppercase tracking-[2px] mb-2">
                Appearance
              </p>
              <p className="text-white/80 text-sm leading-relaxed">{lead.appearanceNotes}</p>
            </div>
          )}

          {lead.generalNotes && (
            <div>
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] uppercase tracking-[2px] mb-2">
                Notes
              </p>
              <p className="text-white/80 text-sm leading-relaxed">{lead.generalNotes}</p>
            </div>
          )}

          {/* Push/Pull Topics (read-only display) */}
          {lead.pushPullTopics.length > 0 && (
            <div>
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] uppercase tracking-[2px] mb-3">
                Push / Pull Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {lead.pushPullTopics.map((t, i) => {
                  const colorMap = {
                    push:    "border-[#FF5500]/50 text-[#FF5500] bg-[rgba(255,85,0,0.07)]",
                    pull:    "border-[#22C55E]/50 text-[#22C55E] bg-[rgba(34,197,94,0.07)]",
                    neutral: "border-[#4A4A4A] text-[#888888]",
                  };
                  return (
                    <div
                      key={i}
                      className={cn(
                        "px-2.5 py-1 border font-['JetBrains_Mono'] text-[9px] tracking-[1px] uppercase",
                        colorMap[t.type]
                      )}
                    >
                      {t.topic}
                      {t.note && (
                        <span className="ml-1 normal-case tracking-normal text-[#666666]">
                          — {t.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column — contact */}
        <div className="space-y-4">
          <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] uppercase tracking-[2px]">
            Contact
          </p>
          {[
            { label: "Phone",     value: lead.phone },
            { label: "Instagram", value: lead.instagram },
            { label: "Snapchat",  value: lead.snapchat },
          ].map(({ label, value }) =>
            value ? (
              <div key={label} className="border border-[#1A1A1A] p-3">
                <div className="font-['JetBrains_Mono'] text-[8px] text-[#4A4A4A] uppercase tracking-[2px] mb-1">
                  {label}
                </div>
                <div className="font-['JetBrains_Mono'] text-[12px] text-white">{value}</div>
              </div>
            ) : null
          )}
          {!lead.phone && !lead.instagram && !lead.snapchat && (
            <p className="font-['JetBrains_Mono'] text-[9px] text-[#333333] uppercase tracking-[2px]">
              No contact info
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
