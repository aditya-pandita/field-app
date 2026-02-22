"use client";

// src/components/journal/AllApproachesList.tsx
// Flat list of all approaches across all sessions with filters.

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Approach, PhaseReached, Outcome } from "@/lib/firebase/types";
import { ApproachCard } from "./ApproachCard";
import { cn } from "@/lib/utils";

interface AllApproachesListProps {
  userId: string;
}

type SortKey  = "newest" | "oldest" | "highest" | "lowest";
type FilterOutcome = "all" | Outcome;
type FilterPhase   = "all" | PhaseReached;

const OUTCOME_OPTIONS: { value: FilterOutcome; label: string }[] = [
  { value: "all",          label: "All Outcomes" },
  { value: "number",       label: "Number"       },
  { value: "instant_date", label: "Instant Date" },
  { value: "social_media", label: "Social Media" },
  { value: "declined",     label: "Declined"     },
  { value: "walked_away",  label: "Walked Away"  },
  { value: "interrupted",  label: "Interrupted"  },
];

const PHASE_OPTIONS: { value: FilterPhase; label: string }[] = [
  { value: "all",     label: "All Phases" },
  { value: "opener",  label: "Opener"     },
  { value: "stack",   label: "Stack"      },
  { value: "hook",    label: "Hook"       },
  { value: "rapport", label: "Rapport"    },
  { value: "close",   label: "Close"      },
];

export function AllApproachesList({ userId }: AllApproachesListProps) {
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [sort,       setSort]       = useState<SortKey>("newest");
  const [outcome,    setOutcome]    = useState<FilterOutcome>("all");
  const [phase,      setPhase]      = useState<FilterPhase>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "approaches"),
          where("userId", "==", userId),
          orderBy("loggedAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          ...d.data(),
          approachId: d.id,
          loggedAt: d.data().loggedAt?.toDate?.() ?? new Date(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
          tags: d.data().tags ?? [],
        })) as Approach[];
        setApproaches(data);
      } catch (e) {
        console.error("Failed to load approaches:", e);
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);

  // Filter
  const filtered = approaches.filter((a) => {
    if (outcome !== "all" && a.outcome      !== outcome) return false;
    if (phase   !== "all" && a.phaseReached !== phase)   return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest")  return new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime();
    if (sort === "oldest")  return new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime();
    if (sort === "highest") return b.scoreOverall - a.scoreOverall;
    if (sort === "lowest")  return a.scoreOverall - b.scoreOverall;
    return 0;
  });

  // Stats
  const total     = filtered.length;
  const avgScore  = total ? (filtered.reduce((s, a) => s + a.scoreOverall, 0) / total).toFixed(1) : "—";
  const closes    = filtered.filter((a) => a.outcome === "number" || a.outcome === "instant_date").length;
  const hookPct   = total
    ? Math.round((filtered.filter((a) => ["hook","rapport","close"].includes(a.phaseReached)).length / total) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-px bg-[#252525]">
        {[
          { label: "TOTAL",      value: total },
          { label: "AVG SCORE",  value: avgScore },
          { label: "HOOK RATE",  value: `${hookPct}%` },
          { label: "CLOSES",     value: closes },
        ].map((s) => (
          <div key={s.label} className="bg-[#0A0A0A] p-4 text-center">
            <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white">
              {s.value}
            </p>
            <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] uppercase tracking-widest mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-3 py-2 outline-none focus:border-[#333333]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Score</option>
          <option value="lowest">Lowest Score</option>
        </select>

        {/* Outcome filter */}
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value as FilterOutcome)}
          className="bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-3 py-2 outline-none focus:border-[#333333]"
        >
          {OUTCOME_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Phase filter */}
        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value as FilterPhase)}
          className="bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-3 py-2 outline-none focus:border-[#333333]"
        >
          {PHASE_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Active filter count */}
        {(outcome !== "all" || phase !== "all") && (
          <button
            onClick={() => { setOutcome("all"); setPhase("all"); }}
            className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest border border-[#FF5500]/30 px-3 py-2 hover:bg-[#FF5500]/10 transition-colors"
          >
            CLEAR FILTERS ×
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1A1A1A]" />
        <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
          {sorted.length} APPROACH{sorted.length !== 1 ? "ES" : ""}
        </span>
        <div className="h-px flex-1 bg-[#1A1A1A]" />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#111111] border border-[#1A1A1A] animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-[family-name:var(--font-syne)] text-xl text-white mb-2">
            No approaches found
          </p>
          <p className="text-[#444444] text-sm">
            {approaches.length > 0
              ? "Try adjusting your filters."
              : "Log your first approach in a journal session."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((approach, idx) => (
            <ApproachCard
              key={approach.approachId}
              approach={approach}
              number={idx + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}