"use client";

import { PhaseFunnelRow } from "@/lib/firebase/types";

interface PhaseFunnelChartProps {
  data: PhaseFunnelRow[];
  loading?: boolean;
}

export function PhaseFunnelChart({ data, loading }: PhaseFunnelChartProps) {
  if (loading) {
    return (
      <div className="bg-[#111111] border border-[#252525] p-4 animate-pulse">
        <div className="h-6 w-32 bg-[#252525] mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-[#252525] mb-2" style={{ width: `${100 - i * 15}%` }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#252525] p-4">
        <h3 className="font-[family-name:var(--font-syne)] text-lg mb-4">Phase Funnel</h3>
        <div className="h-40 flex items-center justify-center">
          <span className="text-[#666666] text-sm">No data yet</span>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-[#111111] border border-[#252525] p-4">
      <h3 className="font-[family-name:var(--font-syne)] text-lg mb-4">Phase Funnel</h3>
      <div className="space-y-2">
        {data.map((row) => (
          <div key={row.phaseReached} className="flex items-center gap-3">
            <span className="w-20 text-xs font-[family-name:var(--font-jetbrains)] uppercase text-[#666666]">
              {row.phaseReached}
            </span>
            <div className="flex-1 h-6 bg-[#1A1A1A]">
              <div
                className="h-full bg-gradient-to-r from-[#666666] to-[#FF5500] transition-all duration-500"
                style={{ width: `${(row.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-12 text-right text-xs font-[family-name:var(--font-jetbrains)] text-[#888888]">
              {row.pct.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
