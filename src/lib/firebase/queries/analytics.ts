import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../client";
import type { UserStats, WeeklyApproach, PhaseFunnelRow, PhaseReached } from "../types";
import { startOfWeek, format, subDays, subMonths } from "date-fns";

async function getApproachesInRange(userId: string, from: Date, to: Date) {
  if (!db) return [];
  const q = query(
    collection(db, "approaches"),
    where("userId", "==", userId),
    where("loggedAt", ">=", from),
    where("loggedAt", "<=", to),
    orderBy("loggedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getUserStats30d(userId: string): Promise<UserStats> {
  const from = subDays(new Date(), 30);
  const approaches = await getApproachesInRange(userId, from, new Date());

  if (approaches.length === 0) {
    return {
      totalApproaches: 0,
      avgScore: 0,
      avgExecution: 0,
      avgTonality: 0,
      avgInvestment: 0,
      avgClose: 0,
      avgRecovery: 0,
      hookRatePct: 0,
      numberCloses: 0,
      instantDates: 0,
      closeRatePct: 0,
    };
  }

  const phases = ["opener", "stack", "hook", "rapport", "close"];
  const phaseIndex = (p: string) => phases.indexOf(p);

  let totalScore = 0;
  let totalExecution = 0;
  let totalTonality = 0;
  let totalInvestment = 0;
  let totalClose = 0;
  let totalRecovery = 0;
  let hooked = 0;
  let numberCloses = 0;
  let instantDates = 0;

  for (const a of approaches) {
    totalScore += a.scoreOverall ?? 0;
    totalExecution += a.scoreExecution ?? 0;
    totalTonality += a.scoreTonality ?? 0;
    totalInvestment += a.scoreInvestment ?? 0;
    totalClose += a.scoreClose ?? 0;
    totalRecovery += a.scoreRecovery ?? 0;

    if (phaseIndex(a.phaseReached) >= 2) hooked++;
    if (a.outcome === "number") numberCloses++;
    if (a.outcome === "instant_date") instantDates++;
  }

  const n = approaches.length;
  return {
    totalApproaches: n,
    avgScore: Math.round((totalScore / n) * 10) / 10,
    avgExecution: Math.round((totalExecution / n) * 10) / 10,
    avgTonality: Math.round((totalTonality / n) * 10) / 10,
    avgInvestment: Math.round((totalInvestment / n) * 10) / 10,
    avgClose: Math.round((totalClose / n) * 10) / 10,
    avgRecovery: Math.round((totalRecovery / n) * 10) / 10,
    hookRatePct: Math.round((hooked / n) * 100),
    numberCloses,
    instantDates,
    closeRatePct: Math.round(((numberCloses + instantDates) / n) * 100),
  };
}

export async function getWeeklyApproaches(userId: string): Promise<WeeklyApproach[]> {
  const from = subMonths(new Date(), 3);
  const approaches = await getApproachesInRange(userId, from, new Date());

  const weeks: Record<string, { total: number; scores: number[] }> = {};

  for (const a of approaches) {
    const weekStart = format(startOfWeek(a.loggedAt?.toDate?.() ?? new Date()), "yyyy-MM-dd");
    if (!weeks[weekStart]) {
      weeks[weekStart] = { total: 0, scores: [] };
    }
    weeks[weekStart].total++;
    weeks[weekStart].scores.push(a.scoreOverall ?? 0);
  }

  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([weekStart, data]) => ({
      weekStart,
      approaches: data.total,
      avgScore: Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10,
    }));
}

export async function getPhaseFunnel(userId: string): Promise<PhaseFunnelRow[]> {
  const from = subMonths(new Date(), 3);
  const approaches = await getApproachesInRange(userId, from, new Date());

  const phases: PhaseReached[] = ["opener", "stack", "hook", "rapport", "close"];
  const phaseIndex = (p: PhaseReached) => phases.indexOf(p);

  const n = approaches.length || 1;
  const counts = phases.map((phase) => {
    const count = approaches.filter((a) => phaseIndex(a.phaseReached as PhaseReached) >= phaseIndex(phase)).length;
    return {
      phaseReached: phase,
      count,
      pct: Math.round((count / n) * 100),
    };
  });

  return counts;
}
