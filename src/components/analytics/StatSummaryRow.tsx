"use client";

import { UserStats } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";
import { getScoreColor } from "@/lib/utils/scores";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
}

export function StatCard({ label, value, subValue, highlight }: StatCardProps) {
  return (
    <div className="p-4 bg-[#111111] border border-[#252525]">
      <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666]">
        {label}
      </span>
      <div className="mt-1 flex items-baseline gap-1">
        <span
          className={cn(
            "font-[family-name:var(--font-syne)] text-3xl",
            highlight ? "text-[#FF5500]" : "text-white"
          )}
        >
          {value}
        </span>
        {subValue && (
          <span className="text-[#666666] text-sm">{subValue}</span>
        )}
      </div>
    </div>
  );
}

interface StatSummaryRowProps {
  stats: UserStats | null;
  loading?: boolean;
}

export function StatSummaryRow({ stats, loading }: StatSummaryRowProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 bg-[#111111] border border-[#252525] animate-pulse">
            <div className="h-3 w-16 bg-[#252525] mb-2" />
            <div className="h-8 w-12 bg-[#252525]" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard label="Approaches" value={stats.totalApproaches} />
      <StatCard label="Avg Score" value={stats.avgScore.toFixed(1)} subValue="/10" highlight />
      <StatCard label="Hook Rate" value={`${stats.hookRatePct.toFixed(0)}%`} />
      <StatCard label="Close Rate" value={`${stats.closeRatePct.toFixed(0)}%`} />
      <StatCard label="Numbers" value={stats.numberCloses} />
    </div>
  );
}
