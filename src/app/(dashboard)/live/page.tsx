"use client";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import { LiveApproach } from "@/components/live/LiveApproach";

export default function LivePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="LIVE RECORDING"
          title="Live"
          subtitle="Record your approaches in real-time"
        />
        <div className="text-center py-16">
          <div className="inline-block w-4 h-4 bg-[#FF5500] rounded-full animate-pulse" />
          <p className="text-[#666666] text-sm mt-4">Loading recorder...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="LIVE RECORDING"
        title="Live"
        subtitle="Record your approaches in real-time"
      />
      {user && <LiveApproach />}
    </div>
  );
}
