"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createLead } from "@/lib/firebase/queries/leads";
import { LeadProfileForm } from "@/components/pipeline/LeadProfileForm";
import type { NewLead } from "@/lib/firebase/types";

export default function NewLeadPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const approachId = searchParams.get("approachId");
  const sessionId = searchParams.get("sessionId");

  const handleSave = async (data: NewLead) => {
    if (!userId) return;
    setLoading(true);
    try {
      await createLead(userId, { ...data, userId });
      router.push("/pipeline");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-['JetBrains_Mono'] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
          PIPELINE
        </p>
        <h1 className="font-['Syne'] text-4xl font-bold text-white mb-2">
          New Lead
        </h1>
        <p className="text-[#666666] text-sm">
          Add someone to your pipeline.
          {approachId && (
            <span className="ml-2 text-[#FF5500]">Linked from approach.</span>
          )}
        </p>
      </div>

      <div className="h-px bg-[#1A1A1A] mb-8" />

      <LeadProfileForm
        defaultApproachId={approachId}
        defaultSessionId={sessionId}
        onSave={handleSave}
        onCancel={() => router.push("/pipeline")}
        loading={loading}
      />
    </div>
  );
}
