"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import SectionLabel from "@/components/layout/SectionLabel";
import StatGrid from "@/components/dashboard/StatGrid";
import StatCard from "@/components/dashboard/StatCard";
import { formatPct } from "@/lib/utils/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

export default function AnalyticsPage() {
  const { userId, loading: authLoading } = useAuth();
  const { stats, weekly, funnel, loading } = useAnalytics(userId);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase">
          Loading...
        </div>
      </div>
    );
  }

  const radarData = stats
    ? [
        { metric: "Execution", value: stats.avgExecution * 10 },
        { metric: "Tonality", value: stats.avgTonality * 10 },
        { metric: "Investment", value: stats.avgInvestment * 10 },
        { metric: "Close", value: stats.avgClose * 10 },
        { metric: "Recovery", value: stats.avgRecovery * 10 },
      ]
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="YOUR PROGRESS"
        title="Analytics"
        subtitle={`Last 30 days · ${stats?.totalApproaches || 0} approaches`}
      />

      <div className="h-[1px] bg-[#1A1A1A] my-8" />

      <StatGrid>
        <StatCard value={stats?.totalApproaches || 0} label="Approaches" highlight />
        <StatCard value={stats?.avgScore?.toFixed(1) || "—"} label="Avg Score" />
        <StatCard value={formatPct(stats?.hookRatePct) || "—"} label="Hook Rate" highlight />
        <StatCard value={formatPct(stats?.closeRatePct) || "—"} label="Close Rate" />
        <StatCard value={stats?.numberCloses || 0} label="Number Closes" />
      </StatGrid>

      <div className="h-[1px] bg-[#1A1A1A] my-8" />
      <SectionLabel>WEEKLY VOLUME</SectionLabel>

      <div className="bg-[#111111] border border-[#252525] p-6 mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekly}>
            <XAxis
              dataKey="weekStart"
              tick={{ fill: "#666666", fontSize: 10 }}
              axisLine={{ stroke: "#252525" }}
              tickLine={{ stroke: "#252525" }}
            />
            <YAxis
              tick={{ fill: "#666666", fontSize: 10 }}
              axisLine={{ stroke: "#252525" }}
              tickLine={{ stroke: "#252525" }}
            />
            <Tooltip
              contentStyle={{
                background: "#1A1A1A",
                border: "1px solid #252525",
                fontFamily: "JetBrains Mono",
                fontSize: "10px",
              }}
            />
            <Bar dataKey="approaches" fill="#FF5500" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SectionLabel>SCORE RADAR</SectionLabel>
          <div className="bg-[#111111] border border-[#252525] p-6">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#252525" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#888888", fontSize: 10 }}
                />
                <Radar
                  dataKey="value"
                  stroke="#FF5500"
                  fill="#FF5500"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <SectionLabel>PHASE FUNNEL</SectionLabel>
          <div className="bg-[#111111] border border-[#252525] p-6">
            {funnel.map((row) => (
              <div key={row.phaseReached} className="flex items-center gap-3 py-2">
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase w-20 text-[#888888]">
                  {row.phaseReached}
                </span>
                <div className="flex-1 h-2 bg-[#252525]">
                  <div
                    className="h-full bg-[#FF5500] transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] w-12 text-right text-[#666666]">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
