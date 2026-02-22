"use client";

import { cn } from "@/lib/utils";
import { getScoreColor, getScoreLabel } from "@/lib/utils/scores";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 48,
  md: 72,
  lg: 96,
};

export function ScoreRing({ score, size = "md", showLabel, className }: ScoreRingProps) {
  const dimension = sizeMap[size];
  const radius = (dimension - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="#252525"
          strokeWidth="4"
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        <span className="font-[family-name:var(--font-syne)] text-white">
          {score}
          <span className="text-[#666666] text-sm">/10</span>
        </span>
      </div>
      {showLabel && (
        <span className="mt-2 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest text-[#888888]">
          {label}
        </span>
      )}
    </div>
  );
}
