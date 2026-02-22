"use client";

// src/app/(dashboard)/dashboard/page.tsx
// All KPIs and subtitle driven by real Firestore data via hooks.

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
import { format } from "date-fns";

export default function DashboardPage() {
  const { userId, user, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading }  = useSessions(userId);
  const { stats, weekly, loading: statsLoading } = useAnalytics(userId);

  const loading = authLoading || sessionsLoading || statsLoading;

  // Dynamic subtitle — current week + real approach count
  const weekLabel = `Week of ${format(new Date(), "MMM d")}`;
  const approachCount = stats?.totalApproaches ?? 0;
  const subtitle = approachCount > 0
    ? `${weekLabel} — ${approachCount} approach${approachCount !== 1 ? "es" : ""} logged`
    : `${weekLabel} — No approaches yet`;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = user?.displayName?.split(" ")[0] ?? "Field";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="YOUR FIELD"
        title={`${greeting}, ${displayName}`}
        subtitle={subtitle}
        action={
          <Link
            href="/journal/new"
            className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 cursor-pointer transition-all duration-150 hover:bg-[#E64D00]"
          >
            + NEW SESSION
          </Link>
        }
      />

      <div className="h-px bg-[#1A1A1A] my-8" />

      {/* Stats — all from real data */}
      <StatGrid>
        <StatCard
          value={stats?.totalApproaches ?? 0}
          label="Total Approaches"
          highlight
        />
        <StatCard
          value={stats?.avgScore ? stats.avgScore.toFixed(1) : "—"}
          label="Avg Score (30d)"
          highlight={!!stats?.avgScore && stats.avgScore >= 7}
        />
        <StatCard
          value={stats?.hookRatePct != null ? `${stats.hookRatePct}%` : "—"}
          label="Hook Rate"
        />
        <StatCard
          value={stats?.closeRatePct != null ? `${stats.closeRatePct}%` : "—"}
          label="Close Rate"
        />
        <StatCard
          value={stats?.numberCloses ?? 0}
          label="Number Closes"
        />
      </StatGrid>

      {/* No data onboarding message */}
      {(!stats || stats.totalApproaches === 0) && (
        <div className="mt-4 p-4 border border-[#1A1A1A] border-l-2 border-l-[#FF5500] bg-[#FF5500]/5">
          <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest mb-1">
            GET STARTED
          </p>
          <p className="text-[#666666] text-sm">
            Create a session in Journal and log your first approach to see stats here.
          </p>
        </div>
      )}

      <div className="h-px bg-[#1A1A1A] my-8" />
      <SectionLabel>THIS WEEK</SectionLabel>

      <WeekStrip data={weekly ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
        <div>
          <SectionLabel>RECENT SESSIONS</SectionLabel>
          <RecentSessions
            sessions={sessions?.slice(0, 3) ?? []}
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