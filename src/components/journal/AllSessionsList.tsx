"use client";

// src/components/journal/AllSessionsList.tsx
// Full filterable/sortable sessions list — similar to AllApproachesList

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, LocationType } from "@/lib/firebase/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AllSessionsListProps {
  sessions: Session[];
  loading:  boolean;
  onEdit:   (session: Session) => void;
}

type SortKey        = "newest" | "oldest" | "most" | "least";
type FilterLocation = "all" | LocationType;

const LOCATION_OPTIONS: { value: FilterLocation; label: string }[] = [
  { value: "all",        label: "All Locations" },
  { value: "street",     label: "Street"        },
  { value: "cafe",       label: "Cafe"          },
  { value: "mall",       label: "Mall"          },
  { value: "park",       label: "Park"          },
  { value: "market",     label: "Market"        },
  { value: "transit",    label: "Transit"       },
  { value: "university", label: "University"    },
  { value: "other",      label: "Other"         },
];

const LOCATION_ICONS: Record<string, string> = {
  street: "🚶", cafe: "☕", mall: "🛒", park: "🌳",
  market: "🧺", transit: "🚇", university: "🎓", other: "📍",
};

export function AllSessionsList({ sessions, loading, onEdit }: AllSessionsListProps) {
  const router   = useRouter();
  const [sort,   setSort]   = useState<SortKey>("newest");
  const [filter, setFilter] = useState<FilterLocation>("all");

  const filtered = sessions.filter((s) =>
    filter === "all" ? true : s.locationType === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest") return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
    if (sort === "oldest") return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
    if (sort === "most")   return b.totalApproaches - a.totalApproaches;
    if (sort === "least")  return a.totalApproaches - b.totalApproaches;
    return 0;
  });

  // Stats
  const total      = filtered.length;
  const totalApp   = filtered.reduce((s, x) => s + x.totalApproaches, 0);
  const avgPerSess = total ? (totalApp / total).toFixed(1) : "—";
  const completed  = filtered.filter((s) => s.isComplete).length;

  return (
    <div className="space-y-6">

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-px bg-[#252525]">
        {[
          { label: "SESSIONS",      value: total        },
          { label: "APPROACHES",    value: totalApp      },
          { label: "AVG / SESSION", value: avgPerSess    },
          { label: "COMPLETED",     value: completed     },
        ].map((s) => (
          <div key={s.label} className="bg-[#0A0A0A] p-4 text-center">
            <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white">{s.value}</p>
            <p className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-3 py-2 outline-none focus:border-[#333333]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most">Most Approaches</option>
          <option value="least">Fewest Approaches</option>
        </select>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterLocation)}
          className="bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-3 py-2 outline-none focus:border-[#333333]"
        >
          {LOCATION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {filter !== "all" && (
          <button
            onClick={() => setFilter("all")}
            className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest border border-[#FF5500]/30 px-3 py-2 hover:bg-[#FF5500]/10 transition-colors"
          >
            CLEAR ×
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1A1A1A]" />
        <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest">
          {sorted.length} SESSION{sorted.length !== 1 ? "S" : ""}
        </span>
        <div className="h-px flex-1 bg-[#1A1A1A]" />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[#111111] border border-[#1A1A1A] animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-[family-name:var(--font-syne)] text-xl text-white mb-2">No sessions found</p>
          <p className="text-[#444444] text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {sorted.map((session) => (
            <SessionRow
              key={session.sessionId}
              session={session}
              onOpen={() => router.push(`/journal/${session.sessionId}`)}
              onEdit={() => onEdit(session)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionRow({
  session,
  onOpen,
  onEdit,
}: {
  session: Session;
  onOpen:  () => void;
  onEdit:  () => void;
}) {
  const icon = LOCATION_ICONS[session.locationType] ?? "📍";
  const date = session.sessionDate instanceof Date ? session.sessionDate : new Date(session.sessionDate);

  return (
    <div className="grid grid-cols-[80px_1fr_auto] py-4 border-b border-[#1A1A1A] group">

      {/* Date */}
      <div className="flex-shrink-0">
        <div className="font-[family-name:var(--font-syne)] text-4xl font-bold text-[#333333] leading-none">
          {date.getDate()}
        </div>
        <div className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#4A4A4A] tracking-widest uppercase mt-1">
          {format(date, "MMM yy")}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest">
            {icon} {session.locationName || session.locationType} · {session.timeOfDay}
          </span>
          {session.isComplete && (
            <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#22C55E] border border-[#22C55E]/30 px-1.5 py-0.5">
              COMPLETE
            </span>
          )}
        </div>
        {session.notes && (
          <p className="text-[#555555] text-xs italic line-clamp-1">{session.notes}</p>
        )}
        {/* Action buttons — visible on hover */}
        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#888888] border border-[#252525] px-2 py-1 hover:border-[#FF5500] hover:text-[#FF5500] transition-colors uppercase tracking-widest"
          >
            OPEN →
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#888888] border border-[#252525] px-2 py-1 hover:border-[#888888] hover:text-white transition-colors uppercase tracking-widest"
          >
            ✎ EDIT
          </button>
        </div>
      </div>

      {/* Approach count */}
      <div className="text-right flex-shrink-0 flex flex-col justify-center">
        <span className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white">
          {session.totalApproaches}
        </span>
        <span className="font-[family-name:var(--font-jetbrains)] text-[8px] text-[#444444] uppercase tracking-widest">
          approaches
        </span>
      </div>
    </div>
  );
}
