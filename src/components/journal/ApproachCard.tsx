"use client";

// src/components/journal/ApproachCard.tsx

import { useState } from "react";
import { Approach, PhaseReached, Outcome, ApproachRecording } from "@/lib/firebase/types";
import { getScoreColor } from "@/lib/utils/scores";
import { cn } from "@/lib/utils";

interface ApproachCardProps {
  approach:        Approach;
  number?:         number;
  recordings?:     ApproachRecording[];
  onEdit?:         () => void;
  onLinkRecording?: (recordingId: string) => void;
}

const PHASES: { id: PhaseReached; label: string; desc: string }[] = [
  { id: "opener",  label: "Opener",  desc: "Stopped her + direct compliment" },
  { id: "stack",   label: "Stack",   desc: "Cold reads + observations" },
  { id: "hook",    label: "Hook",    desc: "She started investing" },
  { id: "rapport", label: "Rapport", desc: "Real connection, depth" },
  { id: "close",   label: "Close",   desc: "Number · date · bounce" },
];

const OUTCOME_LABELS: Record<Outcome, { label: string; color: string }> = {
  number:       { label: "Number Close",  color: "#22C55E" },
  instant_date: { label: "Instant Date",  color: "#22C55E" },
  social_media: { label: "Social Media",  color: "#EAB308" },
  declined:     { label: "Declined",      color: "#EF4444" },
  walked_away:  { label: "Walked Away",   color: "#EF4444" },
  interrupted:  { label: "Interrupted",   color: "#666666" },
};

const SCORE_METRICS = [
  { key: "scoreExecution",  label: "Execution",  weight: 30 },
  { key: "scoreTonality",   label: "Tonality",   weight: 25 },
  { key: "scoreInvestment", label: "Investment", weight: 20 },
  { key: "scoreClose",      label: "Close",      weight: 15 },
  { key: "scoreRecovery",   label: "Recovery",   weight: 10 },
] as const;

function ScoreBand({ score }: { score: number }) {
  if (score >= 9) return <span style={{ color: "#FF5500" }}>Field Mastery</span>;
  if (score >= 8) return <span style={{ color: "#22C55E" }}>Sharp</span>;
  if (score >= 6) return <span style={{ color: "#EAB308" }}>Functional</span>;
  if (score >= 4) return <span style={{ color: "#EF4444" }}>Developing</span>;
  return <span style={{ color: "#EF4444" }}>Grind Mode</span>;
}

export function ApproachCard({
  approach, number, recordings = [], onEdit, onLinkRecording,
}: ApproachCardProps) {
  const [expanded,      setExpanded]      = useState(false);
  const [showLinkMenu,  setShowLinkMenu]  = useState(false);

  const phaseIndex = PHASES.findIndex((p) => p.id === approach.phaseReached);
  const outcome    = OUTCOME_LABELS[approach.outcome];

  // Recordings not yet linked to an approach — available to link
  const availableRecordings = recordings.filter(
    (r) => !r.approachId || r.approachId === approach.approachId
  );
  // Recording already linked to this approach
  const linkedRecording = recordings.find(
    (r) => r.approachId === approach.approachId
  );

  return (
    <div className="bg-[#111111] border border-[#252525] transition-all hover:border-[#333333]">

      {/* Collapsed header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {number && (
              <span className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[#252525]">
                {String(number).padStart(2, "0")}
              </span>
            )}
            <div>
              <span
                className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest"
                style={{ color: outcome.color }}
              >
                {outcome.label}
              </span>
              <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] mt-0.5">
                {new Date(approach.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className="font-[family-name:var(--font-syne)] text-3xl font-bold"
              style={{ color: getScoreColor(approach.scoreOverall) }}
            >
              {approach.scoreOverall.toFixed(1)}
            </span>
            <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] mt-0.5">
              <ScoreBand score={approach.scoreOverall} />
            </p>
          </div>
        </div>

        {/* Phase pipeline */}
        <div className="space-y-1">
          <div className="flex gap-0.5">
            {PHASES.map((phase, idx) => (
              <div
                key={phase.id}
                className="flex-1 h-1.5"
                style={{ background: idx <= phaseIndex ? "#FF5500" : "#1A1A1A" }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {PHASES.map((phase, idx) => (
              <span
                key={phase.id}
                className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase"
                style={{ color: idx <= phaseIndex ? "#FF5500" : "#333333" }}
              >
                {phase.label}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        {approach.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {approach.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#252525] text-[9px] font-[family-name:var(--font-jetbrains)] text-[#555555]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-2">
          <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
            {expanded ? "▲ LESS" : "▼ DETAILS"}
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#1A1A1A] p-4 space-y-6">

          {/* Action buttons */}
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="px-3 py-1.5 border border-[#333333] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest hover:border-[#FF5500] hover:text-[#FF5500] transition-colors"
              >
                ✎ EDIT
              </button>
            )}
            {onLinkRecording && availableRecordings.length > 0 && !linkedRecording && (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowLinkMenu((p) => !p); }}
                  className="px-3 py-1.5 border border-[#333333] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
                >
                  🎙 LINK RECORDING
                </button>
                {showLinkMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-[#111111] border border-[#252525] z-10 min-w-[240px]">
                    <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] uppercase tracking-widest px-3 py-2 border-b border-[#1A1A1A]">
                      SELECT RECORDING
                    </p>
                    {availableRecordings.map((rec) => (
                      <button
                        key={rec.recordingId}
                        onClick={(e) => {
                          e.stopPropagation();
                          onLinkRecording(rec.recordingId);
                          setShowLinkMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#1A1A1A] transition-colors"
                      >
                        <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666]">
                          {new Date(rec.recordedAt).toLocaleString([], {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                          {" · "}
                          {Math.floor(rec.durationSecs / 60)}m {rec.durationSecs % 60}s
                        </p>
                        <p className="text-[#555555] text-[10px] truncate mt-0.5">
                          {rec.transcript.substring(0, 60)}...
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Linked recording */}
          {linkedRecording && (
            <div className="border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-3">
              <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#3B82F6] uppercase tracking-widest mb-2">
                🎙 LINKED RECORDING · {Math.floor(linkedRecording.durationSecs / 60)}m {linkedRecording.durationSecs % 60}s
              </p>
              <p className="text-[#888888] text-xs leading-relaxed line-clamp-3">
                {linkedRecording.transcript}
              </p>
            </div>
          )}

          {/* Conversation flow */}
          <div>
            <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-3">
              CONVERSATION FLOW
            </p>
            <div className="space-y-1">
              {PHASES.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={cn(
                    "flex items-start gap-3 p-2",
                    idx <= phaseIndex
                      ? "border-l-2 border-l-[#FF5500] bg-[#FF5500]/5"
                      : "border-l-2 border-l-[#1A1A1A] opacity-30"
                  )}
                >
                  <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] mt-0.5 w-4 flex-shrink-0">
                    0{idx + 1}
                  </span>
                  <div className="flex-1">
                    <span
                      className="font-[family-name:var(--font-syne)] text-xs font-bold"
                      style={{ color: idx <= phaseIndex ? "#FFFFFF" : "#444444" }}
                    >
                      {phase.label}
                    </span>
                    <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#555555] ml-2">
                      {phase.desc}
                    </span>
                  </div>
                  {idx === phaseIndex && (
                    <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#FF5500] flex-shrink-0">
                      REACHED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Score breakdown */}
          <div>
            <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-3">
              SCORE BREAKDOWN
            </p>
            <div className="space-y-2">
              {SCORE_METRICS.map((m) => {
                const score   = approach[m.key] as number;
                const color   = getScoreColor(score);
                const fillPct = ((score - 1) / 9) * 100;
                return (
                  <div key={m.key} className="flex items-center gap-3">
                    <div className="w-28 flex-shrink-0">
                      <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666] uppercase">
                        {m.label}
                      </span>
                      <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#333333] ml-1">
                        {m.weight}%
                      </span>
                    </div>
                    <div className="flex-1 h-1 bg-[#1A1A1A]">
                      <div className="h-full" style={{ width: `${fillPct}%`, background: color }} />
                    </div>
                    <span
                      className="font-[family-name:var(--font-syne)] text-base font-bold w-8 text-right flex-shrink-0"
                      style={{ color }}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-[#1A1A1A] flex items-center justify-between">
              <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
                OVERALL
              </span>
              <div className="flex items-center gap-2">
                <ScoreBand score={approach.scoreOverall} />
                <span
                  className="font-[family-name:var(--font-syne)] text-xl font-bold"
                  style={{ color: getScoreColor(approach.scoreOverall) }}
                >
                  {approach.scoreOverall.toFixed(1)}
                </span>
                <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444]">/10</span>
              </div>
            </div>
          </div>

          {/* Reflection */}
          {(approach.whatWentWell || approach.whatToImprove || approach.notableMoment) && (
            <div>
              <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-3">
                REFLECTION
              </p>
              <div className="space-y-3">
                {approach.whatWentWell && (
                  <div className="border-l-2 border-[#22C55E] pl-3">
                    <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#22C55E] uppercase tracking-widest mb-1">WHAT WORKED</p>
                    <p className="text-[#888888] text-xs leading-relaxed">{approach.whatWentWell}</p>
                  </div>
                )}
                {approach.whatToImprove && (
                  <div className="border-l-2 border-[#EF4444] pl-3">
                    <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#EF4444] uppercase tracking-widest mb-1">WORK ON</p>
                    <p className="text-[#888888] text-xs leading-relaxed">{approach.whatToImprove}</p>
                  </div>
                )}
                {approach.notableMoment && (
                  <div className="border-l-2 border-[#FF5500] pl-3 bg-[#FF5500]/5 py-2 pr-3">
                    <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#FF5500] uppercase tracking-widest mb-1">NOTABLE MOMENT</p>
                    <p className="text-[#AAAAAA] text-xs italic">&ldquo;{approach.notableMoment}&rdquo;</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}