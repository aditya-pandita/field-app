"use client";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import { AdversaryModule } from "@/components/adversary/AdversaryModule";

export default function AdversaryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="PSYCHOLOGICAL RESILIENCE"
          title="Adversary"
          subtitle="Build mental toughness through practice"
        />
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#EF4444] rounded-full animate-pulse" />
            <span className="text-[#666666] text-sm">Preparing...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="PSYCHOLOGICAL RESILIENCE"
        title="Adversary"
        subtitle="Build mental toughness through practice"
      />
      {user && <AdversaryModule />}
    </div>
  );
}
