"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ScoreSliderProps {
  metric: string;
  value: number;
  onChange: (value: number) => void;
  weight?: number;
}

const METRICS: Record<string, { weight: number; question: string }> = {
  execution: { weight: 30, question: "How well did you execute the approach?" },
  tonality: { weight: 25, question: "How was your vocal tone and pace?" },
  investment: { weight: 20, question: "How much did she invest in the conversation?" },
  close: { weight: 15, question: "How well did you attempt to close?" },
  recovery: { weight: 10, question: "How did you handle any resistance?" },
};

export function ScoreSlider({ metric, value, onChange, weight }: ScoreSliderProps) {
  const config = METRICS[metric] || { weight: weight || 0, question: "" };
  const displayWeight = weight ?? config.weight;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-dm-sans)] text-sm">{metric}</span>
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-syne)] text-2xl text-[#FF5500]">
            {value}
          </span>
          <span className="px-2 py-0.5 bg-[#252525] text-[10px] font-[family-name:var(--font-jetbrains)] text-[#666666]">
            {displayWeight}%
          </span>
        </div>
      </div>
      
      <p className="text-xs text-[#666666]">{config.question}</p>
      
      <input
        type="range"
        min="1"
        max="10"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-[#252525] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#FF5500] [&::-webkit-slider-thumb]:square"
      />
      
      <div className="flex justify-between text-[10px] text-[#666666] font-[family-name:var(--font-jetbrains)]">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

export { METRICS };
