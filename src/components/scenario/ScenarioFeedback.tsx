"use client";

import { ScenarioFeedback } from "@/lib/firebase/types";
import { getScoreColor } from "@/lib/utils/scores";

interface ScenarioFeedbackProps {
  feedback: ScenarioFeedback;
  onDone: () => void;
}

export function ScenarioFeedbackComponent({ feedback, onDone }: ScenarioFeedbackProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <div
          className="inline-block px-8 py-4 border"
          style={{ borderColor: getScoreColor(feedback.overallScore) }}
        >
          <span className="font-[family-name:var(--font-syne)] text-5xl" style={{ color: getScoreColor(feedback.overallScore) }}>
            {feedback.overallScore}
          </span>
          <span className="text-[#666666] text-lg">/10</span>
        </div>
        <p className="mt-2 text-[#888888] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest">
          {feedback.phaseReached}
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-[#111111] border border-[#252525]">
          <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#22C55E] mb-2">
            Strengths
          </h4>
          <ul className="space-y-1">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-[#888888]">• {s}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-[#111111] border border-[#252525]">
          <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#EAB308] mb-2">
            Improvements
          </h4>
          <ul className="space-y-1">
            {feedback.improvements.map((s, i) => (
              <li key={i} className="text-sm text-[#888888]">• {s}</li>
            ))}
          </ul>
        </div>

        {feedback.bestLine && (
          <div className="p-4 bg-[rgba(255,85,0,0.07)] border-l-2 border-[#FF5500]">
            <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#FF5500] mb-2">
              Best Line
            </h4>
            <p className="text-sm text-white italic">"{feedback.bestLine}"</p>
          </div>
        )}

        <div className="p-4 bg-[#111111] border border-[#252525]">
          <h4 className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
            Coach Note
          </h4>
          <p className="text-sm text-[#888888]">{feedback.coachNote}</p>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
      >
        Done
      </button>
    </div>
  );
}
