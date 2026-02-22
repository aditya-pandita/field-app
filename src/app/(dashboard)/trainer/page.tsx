"use client";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import { ConversationTrainer } from "@/components/trainer/ConversationTrainer";

export default function TrainerPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="CONVERSATION DRILLS"
          title="Trainer"
          subtitle="Practice transitions and pivots"
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
        eyebrow="CONVERSATION DRILLS"
        title="Trainer"
        subtitle="Practice transitions and pivots"
      />
      {user && <ConversationTrainer />}
    </div>
  );
}
