"use client";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import { ScenarioPractice } from "@/components/scenario/ScenarioPractice";

export default function ScenarioPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="AI PRACTICE"
          title="Scenario"
          subtitle="Practice approaching in different situations"
        />
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI PRACTICE"
        title="Scenario"
        subtitle="Practice approaching in different situations"
      />
      {user && <ScenarioPractice />}
    </div>
  );
}
