"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getUserLeads } from "@/lib/firebase/queries/leads";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import type { Lead } from "@/lib/firebase/types";

export default function PipelinePage() {
  const { userId, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getUserLeads(userId)
      .then(setLeads)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
            PIPELINE
          </p>
          <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white mb-2">
            Lead Pipeline
          </h1>
          <p className="text-[#666666] text-sm">
            Track every lead from approach to close. {leads.length} total.
          </p>
        </div>
        <Link
          href="/pipeline/new"
          className="flex-shrink-0 bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
        >
          + NEW LEAD
        </Link>
      </div>

      <div className="h-px bg-[#252525] mb-8" />

      <PipelineBoard initialLeads={leads} />
    </div>
  );
}
