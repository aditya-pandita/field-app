"use client";

// src/app/(dashboard)/approaches/page.tsx
// All approaches across all sessions — filterable and sortable.

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AllApproachesList } from "@/components/journal/AllApproachesList";
import { LogApproachModal } from "@/components/approach/LogApproachModal";

export default function ApproachesPage() {
  const { userId, loading } = useAuth();
  const [logOpen, setLogOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-[#111111] animate-pulse" />
        <div className="h-24 bg-[#111111] animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#111111] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
            FIELD LOG
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold text-white mb-2">
            All Approaches
          </h1>
          <p className="text-[#666666] text-sm">
            Every approach logged. Filter by outcome, phase, or score.
          </p>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="flex-shrink-0 bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
        >
          + LOG
        </button>
      </div>

      <div className="h-px bg-[#252525] mb-8" />

      <AllApproachesList userId={userId} />

      <LogApproachModal
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
        userId={userId}
      />
    </div>
  );
}
