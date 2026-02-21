"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { useAnalytics } from "@/hooks/useAnalytics";
import PageHeader from "@/components/layout/PageHeader";
import SectionLabel from "@/components/layout/SectionLabel";
import StatCard from "@/components/dashboard/StatCard";
import StatGrid from "@/components/dashboard/StatGrid";
import WeekStrip from "@/components/dashboard/WeekStrip";
import RecentSessions from "@/components/dashboard/RecentSessions";
import QuickActions from "@/components/dashboard/QuickActions";
import { formatPct } from "@/lib/utils/format";

export default function DashboardPage() {
  const { userId, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading } = useSessions(userId);
  const { stats, loading: statsLoading } = useAnalytics(userId);

  const loading = authLoading || sessionsLoading || statsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="YOUR FIELD"
        title="Dashboard"
        subtitle="Week of Feb 17 — 3 approaches logged"
        action={
          <Link
            href="/journal/new"
            className="bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 cursor-pointer transition-all duration-150 hover:bg-[#E64D00]"
          >
            + LOG APPROACH
          </Link>
        }
      />

      <div className="h-[1px] bg-[#1A1A1A] my-8" />

      <StatGrid>
        <StatCard
          value={stats?.totalApproaches || 0}
          label="Total Approaches"
          highlight
          trend={stats && stats.totalApproaches > 0 ? "+8 this week" : undefined}
        />
        <StatCard value={stats?.avgScore?.toFixed(1) || "—"} label="Avg Score (30d)" />
        <StatCard
          value={formatPct(stats?.hookRatePct) || "—"}
          label="Hook Rate"
          highlight
          trend={stats && stats.hookRatePct > 0 ? "+12%" : undefined}
        />
        <StatCard value={formatPct(stats?.closeRatePct) || "—"} label="Close Rate" />
        <StatCard value={5} label="Day Streak" highlight />
      </StatGrid>

      <div className="h-[1px] bg-[#1A1A1A] my-8" />
      <SectionLabel>THIS WEEK</SectionLabel>

      <WeekStrip />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
        <div>
          <SectionLabel>RECENT SESSIONS</SectionLabel>
          <RecentSessions
            sessions={sessions}
            onSessionClick={(id) => {
              window.location.href = `/journal/${id}`;
            }}
          />
        </div>
        <div>
          <SectionLabel>QUICK ACTIONS</SectionLabel>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
