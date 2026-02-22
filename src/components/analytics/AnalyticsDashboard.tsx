"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { StatSummaryRow } from "./StatSummaryRow";
import { WeeklyBarChart } from "./WeeklyBarChart";
import { PhaseFunnelChart } from "./PhaseFunnelChart";
import { MetricBreakdownTable } from "./MetricBreakdownTable";

interface AnalyticsDashboardProps {
  userId: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const { stats, weekly, funnel, loading, error } = useAnalytics(userId);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#EF4444]">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatSummaryRow stats={stats} loading={loading} />
      
      <WeeklyBarChart data={weekly || []} loading={loading} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <PhaseFunnelChart data={funnel || []} loading={loading} />
        <MetricBreakdownTable stats={stats} loading={loading} />
      </div>
    </div>
  );
}
