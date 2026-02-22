"use client";

// src/app/(dashboard)/journal/page.tsx
// Journal page with two tabs: Sessions list + approaches quick view.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import PageHeader from "@/components/layout/PageHeader";
import SessionList from "@/components/journal/SessionList";
import { EditSessionForm } from "@/components/journal/EditSessionForm";
import type { Session } from "@/lib/firebase/types";

type Tab = "sessions";

export default function JournalPage() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const { sessions, loading, refresh }   = useSessions(userId);
  const [editSession, setEditSession]    = useState<Session | null>(null);

  const isLoading = authLoading || loading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  const totalApproaches = sessions.reduce((sum, s) => sum + s.totalApproaches, 0);

  return (
    <div>
      <PageHeader
        eyebrow="FIELD SESSIONS"
        title="Journal"
        subtitle={`${sessions.length} sessions · ${totalApproaches} total approaches`}
        action={
          <Link
            href="/journal/new"
            className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 cursor-pointer transition-all duration-150 hover:bg-[#E64D00]"
          >
            + NEW SESSION
          </Link>
        }
      />

      <div className="h-px bg-[#1A1A1A] my-8" />

      {/* Edit panel — appears above list when editing */}
      {editSession && (
        <div className="mb-8 border border-[#252525] border-l-2 border-l-[#FF5500] p-5 bg-[#111111]">
          <EditSessionForm
            session={editSession}
            onSaved={async () => {
              await refresh();
              setEditSession(null);
            }}
            onCancel={() => setEditSession(null)}
          />
        </div>
      )}

      {/* Session list with edit callback */}
      <SessionList
        sessions={sessions}
        onSessionClick={(id) => router.push(`/journal/${id}`)}
        onSessionEdit={(session) => setEditSession(session)}
      />
    </div>
  );
}
