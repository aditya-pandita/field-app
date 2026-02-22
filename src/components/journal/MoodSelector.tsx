"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MOODS = [
  { value: "confident", label: "Confident", emoji: "🔥" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "excited", label: "Excited", emoji: "⚡" },
];

interface MoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function MoodSelector({ value, onChange, label }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888]">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              "w-9 h-9 border flex items-center justify-center text-lg transition-all",
              value === mood.value
                ? "border-[#FF5500] bg-[#FF5500]/10"
                : "border-[#252525] bg-[#1A1A1A] hover:border-[#333333]"
            )}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
