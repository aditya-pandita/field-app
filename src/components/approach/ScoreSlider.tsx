"use client";

// src/components/approach/ScoreSlider.tsx
// Score slider with real scoring criteria from the field rating system.
// Overall score is NOT a slider — it is auto-calculated from the 5 weighted metrics.

import { cn } from "@/lib/utils";

interface ScoreSliderProps {
  metric: keyof typeof METRICS;
  value: number;
  onChange: (value: number) => void;
}

export const METRICS = {
  execution: {
    weight:    30,
    label:     "Approach Execution",
    question:  "Did you stop her cleanly? Energy matched to environment?",
    criteria:  "Did you hesitate, over-apologize, or open from behind? The physical stop is the foundation — everything else builds on it. Clean stop with good energy = 8–10. Hesitated or apologetic = 1–4.",
  },
  tonality: {
    weight:    25,
    label:     "Tonality & Frame",
    question:  "Was your voice grounded, warm, and certain?",
    criteria:  "Did you speak like a man who assumes good intent, or like someone seeking approval? Slow, warm, certain = high score. Fast, high-pitched, trailing off = low score. Tonality carries more weight than the words themselves.",
  },
  investment: {
    weight:    20,
    label:     "Investment Elicited",
    question:  "Did she start contributing or did you carry everything?",
    criteria:  "Did she ask you anything back? Did she elaborate without being asked? The hook point metric. She's just answering = 1–5. She's asking questions back and qualifying herself = 7–10.",
  },
  close: {
    weight:    15,
    label:     "Close Attempt",
    question:  "Did you lead the close or wait for permission?",
    criteria:  "Even a bad close attempt scores higher than no close. Did you lead into it from a high point or wait until things were stalling? No attempt = 1–3. Attempted but asked = 5–6. Led it confidently = 8–10.",
  },
  recovery: {
    weight:    10,
    label:     "Recovery Under Pressure",
    question:  "When she went cold or tried to leave — did you hold frame?",
    criteria:  "Did you chase, over-explain, or crumble? Or did you release pressure cleanly and stay composed? Chased and got needy = 1–3. Held frame and recovered = 7–10. Clean graceful exit = 8.",
  },
} as const;

/** Score label based on the session score band system */
export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 9)  return { label: "Field Mastery",  color: "#FF5500" };
  if (score >= 8)  return { label: "Sharp",           color: "#22C55E" };
  if (score >= 6)  return { label: "Functional",      color: "#EAB308" };
  if (score >= 4)  return { label: "Developing",      color: "#EF4444" };
  return              { label: "Grind Mode",       color: "#EF4444" };
}

/** Auto-calculate overall score from the 5 weighted metrics */
export function calcOverallScore(scores: {
  execution:  number;
  tonality:   number;
  investment: number;
  close:      number;
  recovery:   number;
}): number {
  const raw =
    scores.execution  * 0.30 +
    scores.tonality   * 0.25 +
    scores.investment * 0.20 +
    scores.close      * 0.15 +
    scores.recovery   * 0.10;
  return Math.round(raw * 10) / 10;
}

export function ScoreSlider({ metric, value, onChange }: ScoreSliderProps) {
  const config = METRICS[metric];

  // Colour the fill based on current value
  const fillColor =
    value >= 8 ? "#22C55E" :
    value >= 6 ? "#EAB308" :
    value >= 4 ? "#FF5500" :
                 "#EF4444";

  const fillPct = ((value - 1) / 9) * 100;

  return (
    <div className="space-y-3 py-4 border-b border-[#1A1A1A] last:border-0">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-[family-name:var(--font-syne)] text-sm font-bold text-white">
              {config.label}
            </span>
            <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] bg-[#1A1A1A] px-2 py-0.5">
              {config.weight}%
            </span>
          </div>
          <p className="text-[#666666] text-xs italic">{config.question}</p>
        </div>

        {/* Current score — large, auto-colored */}
        <div className="flex-shrink-0 text-right">
          <span
            className="font-[family-name:var(--font-syne)] text-3xl font-bold"
            style={{ color: fillColor }}
          >
            {value}
          </span>
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#444444]">
            /10
          </span>
        </div>
      </div>

      {/* Slider with custom coloured fill */}
      <div className="relative">
        {/* Track background */}
        <div className="h-1 w-full bg-[#252525] relative">
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full transition-all"
            style={{ width: `${fillPct}%`, background: fillColor }}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1"
          style={{ margin: 0 }}
        />
        {/* Visible thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 border-2 bg-black transition-all pointer-events-none"
          style={{
            left: `calc(${fillPct}% - 8px)`,
            borderColor: fillColor,
          }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444]">
        <span>1 · Weak</span>
        <span>5 · Mid</span>
        <span>10 · Sharp</span>
      </div>

      {/* Scoring criteria — always visible */}
      <p className="text-[#555555] text-[11px] leading-relaxed border-l-2 border-[#252525] pl-3">
        {config.criteria}
      </p>
    </div>
  );
}