"use client";

import { useState, useEffect } from "react";
import { getUserStats30d, getWeeklyApproaches, getPhaseFunnel } from "@/lib/firebase/queries/analytics";
import type { UserStats, WeeklyApproach, PhaseFunnelRow } from "@/lib/firebase/types";

export function useAnalytics(userId: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [weekly, setWeekly] = useState<WeeklyApproach[]>([]);
  const [funnel, setFunnel] = useState<PhaseFunnelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchAll() {
      setLoading(true);
      try {
        const [statsData, weeklyData, funnelData] = await Promise.all([
          getUserStats30d(userId!),
          getWeeklyApproaches(userId!),
          getPhaseFunnel(userId!),
        ]);
        setStats(statsData);
        setWeekly(weeklyData);
        setFunnel(funnelData);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [userId]);

  return { stats, weekly, funnel, loading, error };
}
