"use client";

// src/components/reference/ScoringSystem.tsx
// The approach scoring framework used in field breakdowns

const MAIN_METRICS = [
  {
    weight: 30,
    name: "Approach Execution",
    description:
      "Did you actually stop her cleanly? Energy level matched to environment? Did you hesitate, over-apologize, or open from behind? The physical stop is the foundation — everything else builds on it.",
  },
  {
    weight: 25,
    name: "Tonality & Frame",
    description:
      "Was your voice grounded? Did you speak like a man who assumes good intent, or like someone seeking approval? Tonality carries more weight than the words. Slow, warm, certain = high score.",
  },
  {
    weight: 20,
    name: "Investment Elicited",
    description:
      "Did she start contributing to the conversation or did you carry it? Did she ask you anything back? The hook point metric — coaches use this to judge whether you created real attraction or just performed.",
  },
  {
    weight: 15,
    name: "Close Attempt",
    description:
      "Did you try to close? Even a bad close attempt scores higher than no close. Coaches specifically check: did you lead the close or wait for her to make it easy? Leading = high. Hoping = low.",
  },
  {
    weight: 10,
    name: "Recovery Under Pressure",
    description:
      "When she gave a cold reaction, a short answer, or tried to leave — did you maintain composure? Did you chase or hold frame? The mid-set test of character.",
  },
];

const GRADING_CRITERIA = [
  {
    name: "Opener Directness",
    description:
      "Was your intention clear from second one? Vague or contextual openers score lower. Direct, genuine, specific compliment = 8–10. Generic or anxious-sounding = 1–4.",
  },
  {
    name: "Body Language",
    description:
      "Upright posture, open chest, slow movement, no hand fidgeting, held eye contact throughout. Coaches watch for nervous gestures: touching face, shifting weight, breaking eye contact.",
  },
  {
    name: "Conversation Control",
    description:
      "Did you lead the topics or react to hers? Were your transitions smooth? Did you avoid interview mode (question → question → question)? High scorers share observations and stories.",
  },
  {
    name: "Calibration",
    description:
      "Did you read her signals correctly and adjust? Too much pressure when she was cold? Didn't push when she was warm? Calibration is the advanced metric — the gap between beginner and intermediate.",
  },
  {
    name: "Outcome Independence",
    description:
      "Did your demeanor change when she showed resistance? Did rejection visibly affect your state for the next approach? The mental game metric. All coaches agree this is the ceiling of the skill.",
  },
];

const SCORE_BANDS = [
  {
    range: "1–3",
    label: "GRIND MODE",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    description:
      "Hesitated on most approaches, apologetic energy, stayed surface level, no close attempt. Goal: just approach. Volume over quality until approach anxiety drops.",
  },
  {
    range: "4–5",
    label: "DEVELOPING",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.04)",
    border: "rgba(239,68,68,0.15)",
    description:
      "Approaches happening but tonality weak, interview mode running, checking for approval. Conversations end early. Stack and stop working, hook point rarely hit.",
  },
  {
    range: "6–7",
    label: "FUNCTIONAL",
    color: "#EAB308",
    bg: "rgba(234,179,8,0.06)",
    border: "rgba(234,179,8,0.2)",
    description:
      "Most approaches solid, some hooks, occasional number close. Losing her at rapport or chickening on close. This is where most intermediate practitioners live.",
  },
  {
    range: "8–9",
    label: "SHARP",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.2)",
    description:
      "Consistent hook points, leading to number closes and occasional instant dates. Calibrating correctly to warm/cold signals. Recovery is smooth. Outcome independent most of the time.",
  },
  {
    range: "10",
    label: "FIELD MASTERY",
    color: "#FF5500",
    bg: "rgba(255,85,0,0.06)",
    border: "rgba(255,85,0,0.2)",
    description:
      "Instant date rate high. Women contributing equally to conversation. Rejection handled with complete ease and grace. Fully present, not running patterns. Naturalized game.",
  },
];

export function ScoringSystem() {
  return (
    <div className="max-w-3xl space-y-12">

      {/* Main scoring weights */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#1A1A1A]" />
          <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666] tracking-widest uppercase">
            SESSION SCORE WEIGHTS
          </span>
          <div className="h-px flex-1 bg-[#1A1A1A]" />
        </div>

        <div className="space-y-1 bg-[#252525] p-px">
          {MAIN_METRICS.map((metric) => (
            <div
              key={metric.name}
              className="bg-[#0A0A0A] p-5 flex gap-6 items-start"
            >
              {/* Weight */}
              <div className="flex-shrink-0 w-16 text-right">
                <span className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[#FF5500]">
                  {metric.weight}
                </span>
                <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500]">
                  %
                </span>
              </div>
              {/* Content */}
              <div className="flex-1">
                <h4 className="font-[family-name:var(--font-syne)] text-base font-bold text-white mb-1">
                  {metric.name}
                </h4>
                <p className="text-[#666666] text-sm leading-relaxed">
                  {metric.description}
                </p>
              </div>
              {/* Bar */}
              <div className="flex-shrink-0 w-20 flex items-center h-full pt-2">
                <div className="w-full h-1 bg-[#1A1A1A]">
                  <div
                    className="h-full bg-[#FF5500] transition-all"
                    style={{ width: `${metric.weight * 3.33}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grading criteria */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#1A1A1A]" />
          <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666] tracking-widest uppercase">
            APPROACH GRADING CRITERIA
          </span>
          <div className="h-px flex-1 bg-[#1A1A1A]" />
        </div>

        <div className="space-y-4">
          {GRADING_CRITERIA.map((criterion) => (
            <div
              key={criterion.name}
              className="border border-[#1A1A1A] p-5 flex gap-6 items-start"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-[family-name:var(--font-syne)] text-base font-bold text-white">
                    {criterion.name}
                  </h4>
                  <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#444444] tracking-widest">
                    / 10
                  </span>
                </div>
                <p className="text-[#666666] text-sm leading-relaxed">
                  {criterion.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score bands */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#1A1A1A]" />
          <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#666666] tracking-widest uppercase">
            SESSION SCORE BANDS
          </span>
          <div className="h-px flex-1 bg-[#1A1A1A]" />
        </div>

        <div className="space-y-3">
          {SCORE_BANDS.map((band) => (
            <div
              key={band.range}
              className="p-5 border flex gap-6 items-start"
              style={{
                background: band.bg,
                borderColor: band.border,
              }}
            >
              {/* Range */}
              <div className="flex-shrink-0 w-12">
                <span
                  className="font-[family-name:var(--font-syne)] text-2xl font-bold"
                  style={{ color: band.color }}
                >
                  {band.range}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1">
                <span
                  className="font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ color: band.color }}
                >
                  {band.label}
                </span>
                <p className="text-[#666666] text-sm leading-relaxed">
                  {band.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
