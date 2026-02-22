"use client";

// src/components/approach/OverallScoreDisplay.tsx
// Shows the auto-calculated overall score. NOT a slider — computed from the 5 metrics.

import { calcOverallScore, getScoreLabel } from "./ScoreSlider";

interface OverallScoreDisplayProps {
  execution:  number;
  tonality:   number;
  investment: number;
  close:      number;
  recovery:   number;
}

const SCORE_BANDS = [
  { min: 9,  max: 10, label: "Field Mastery",  desc: "Instant date rate high. Fully present, not running patterns. Naturalized game.", color: "#FF5500" },
  { min: 8,  max: 9,  label: "Sharp",           desc: "Consistent hook points, leading to closes. Outcome independent most of the time.", color: "#22C55E" },
  { min: 6,  max: 8,  label: "Functional",      desc: "Most approaches solid, some hooks. Losing her at rapport or chickening on close.", color: "#EAB308" },
  { min: 4,  max: 6,  label: "Developing",      desc: "Approaches happening but tonality weak, interview mode running. Progress is real.", color: "#EF4444" },
  { min: 0,  max: 4,  label: "Grind Mode",      desc: "Hesitated, apologetic energy, stayed surface level. Goal: just approach. Volume first.", color: "#EF4444" },
];

export function OverallScoreDisplay({
  execution, tonality, investment, close, recovery,
}: OverallScoreDisplayProps) {
  const score  = calcOverallScore({ execution, tonality, investment, close, recovery });
  const { label, color } = getScoreLabel(score);
  const band   = SCORE_BANDS.find((b) => score >= b.min && score < b.max) ?? SCORE_BANDS[4];
  const fillPct = (score / 10) * 100;

  return (
    <div className="border border-[#1A1A1A] border-l-2 p-5 space-y-4" style={{ borderLeftColor: color }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666] uppercase tracking-widest mb-1">
            OVERALL SCORE — AUTO-CALCULATED
          </p>
          <p className="text-[#444444] text-[10px]">
            Weighted from your 5 metric scores
          </p>
        </div>
        {/* Big score */}
        <div className="text-right">
          <span
            className="font-[family-name:var(--font-syne)] text-5xl font-bold"
            style={{ color }}
          >
            {score}
          </span>
          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#444444]">
            /10
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1 w-full bg-[#1A1A1A]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${fillPct}%`, background: color }}
        />
      </div>

      {/* Band label + description */}
      <div>
        <span
          className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest font-bold"
          style={{ color }}
        >
          {label}
        </span>
        <p className="text-[#555555] text-xs leading-relaxed mt-1">
          {band.desc}
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-5 gap-1 pt-2 border-t border-[#1A1A1A]">
        {[
          { key: "EXE", val: execution,  w: 30 },
          { key: "TON", val: tonality,   w: 25 },
          { key: "INV", val: investment, w: 20 },
          { key: "CLO", val: close,      w: 15 },
          { key: "REC", val: recovery,   w: 10 },
        ].map((m) => (
          <div key={m.key} className="text-center">
            <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] block">
              {m.key}
            </span>
            <span className="font-[family-name:var(--font-syne)] text-base font-bold text-white">
              {m.val}
            </span>
            <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] block">
              ×{m.w}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}