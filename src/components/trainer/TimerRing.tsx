"use client";

import { cn } from "@/lib/utils";

interface TimerRingProps {
  remainingSecs: number;
  totalSecs: number;
}

export function TimerRing({ remainingSecs, totalSecs }: TimerRingProps) {
  const progress = remainingSecs / totalSecs;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = () => {
    if (remainingSecs <= 5) return "#EF4444";
    if (remainingSecs <= 10) return "#FF5500";
    if (remainingSecs <= 20) return "#EAB308";
    return "#FFFFFF";
  };

  const color = getColor();
  const isUrgent = remainingSecs <= 5;

  return (
    <div className={cn("relative w-32 h-32 mx-auto", isUrgent && "animate-pulse")}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          fill="none"
          stroke="#252525"
          strokeWidth="4"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[family-name:var(--font-syne)] text-4xl" style={{ color }}>
          {remainingSecs}
        </span>
        <span className="text-[#666666] text-xs">s</span>
      </div>
    </div>
  );
}
