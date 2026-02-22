"use client";

import { UserStats } from "@/lib/firebase/types";
import { getScoreColor, getScoreLabel } from "@/lib/utils/scores";
import { cn } from "@/lib/utils";

interface MetricBreakdownTableProps {
  stats: UserStats | null;
  loading?: boolean;
}

const METRICS = [
  { key: "avgExecution", label: "Execution", weight: 30 },
  { key: "avgTonality", label: "Tonality", weight: 25 },
  { key: "avgInvestment", label: "Investment", weight: 20 },
  { key: "avgClose", label: "Close", weight: 15 },
  { key: "avgRecovery", label: "Recovery", weight: 10 },
];

export function MetricBreakdownTable({ stats, loading }: MetricBreakdownTableProps) {
  if (loading) {
    return (
      <div className="bg-[#111111] border border-[#252525] p-4 animate-pulse">
        <div className="h-6 w-40 bg-[#252525] mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-[#252525] mb-2" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const values = [
    { key: "avgExecution", value: stats.avgExecution, label: "Execution", weight: 30 },
    { key: "avgTonality", value: stats.avgTonality, label: "Tonality", weight: 25 },
    { key: "avgInvestment", value: stats.avgInvestment, label: "Investment", weight: 20 },
    { key: "avgClose", value: stats.avgClose, label: "Close", weight: 15 },
    { key: "avgRecovery", value: stats.avgRecovery, label: "Recovery", weight: 10 },
  ];

  const avgScore = values.reduce((sum, v) => sum + v.value * (v.weight / 100), 0);
  const sortedByScore = [...values].sort((a, b) => a.value - b.value);
  const weakest = sortedByScore[0]?.key;
  const strongest = sortedByScore[sortedByScore.length - 1]?.key;

  return (
    <div className="bg-[#111111] border border-[#252525] p-4">
      <h3 className="font-[family-name:var(--font-syne)] text-lg mb-4">Metric Breakdown</h3>
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-2 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#666666] uppercase mb-2 pb-2 border-b border-[#252525]">
          <span>Metric</span>
          <span>Weight</span>
          <span>Avg</span>
          <span>Bar</span>
          <span>Level</span>
        </div>
        {values.map((metric) => {
          const isWeakest = metric.key === weakest;
          const isStrongest = metric.key === strongest;
          const color = getScoreColor(metric.value);
          
          return (
            <div key={metric.key} className="grid grid-cols-5 gap-2 py-2 items-center border-b border-[#252525]/50">
              <span className={cn(
                "text-sm",
                isWeakest && "text-[#EF4444]",
                isStrongest && "text-[#22C55E]"
              )}>{metric.label}</span>
              <span className="text-xs text-[#666666]">{metric.weight}%</span>
              <span className="font-[family-name:var(--font-syne)]" style={{ color }}>{metric.value.toFixed(1)}</span>
              <div className="h-2 bg-[#252525]">
                <div className="h-full transition-all" style={{ width: `${metric.value * 10}%`, backgroundColor: color }} />
              </div>
              <span className="text-xs text-[#888888]">{getScoreLabel(metric.value)}</span>
            </div>
          );
        })}
      </div>
      
      <div className="md:hidden space-y-2">
        {values.map((metric) => (
          <div key={metric.key} className="flex justify-between items-center py-2 border-b border-[#252525]/50">
            <span className="text-sm">{metric.label}</span>
            <span className="font-[family-name:var(--font-syne)]" style={{ color: getScoreColor(metric.value) }}>
              {metric.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
