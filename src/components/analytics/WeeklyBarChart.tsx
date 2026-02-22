"use client";

import { WeeklyApproach } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface WeeklyBarChartProps {
  data: WeeklyApproach[];
  loading?: boolean;
}

export function WeeklyBarChart({ data, loading }: WeeklyBarChartProps) {
  if (loading) {
    return (
      <div className="h-48 bg-[#111111] border border-[#252525] animate-pulse flex items-end justify-around p-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-6 bg-[#252525]" style={{ height: `${Math.random() * 80 + 20}%` }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 bg-[#111111] border border-[#252525] flex items-center justify-center">
        <span className="text-[#666666] text-sm">No data yet</span>
      </div>
    );
  }

  const maxApproaches = Math.max(...data.map((d) => d.approaches), 1);

  return (
    <div className="bg-[#111111] border border-[#252525] p-4">
      <h3 className="font-[family-name:var(--font-syne)] text-lg mb-4">Weekly Approaches</h3>
      <div className="flex items-end justify-around h-40 gap-2">
        {data.map((week, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div
              className="w-full max-w-8 bg-[#FF5500] hover:bg-[#E64D00] transition-colors"
              style={{ height: `${(week.approaches / maxApproaches) * 100}%` }}
              title={`${week.approaches} approaches`}
            />
            <span className="mt-2 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#666666] rotate-45 origin-left">
              {week.weekStart.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
