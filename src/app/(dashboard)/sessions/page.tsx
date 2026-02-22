"use client";

// src/app/(dashboard)/sessions/page.tsx
// All sessions — filterable, sortable, with inline edit.

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { AllSessionsList } from "@/components/journal/AllSessionsList";
import { EditSessionForm } from "@/components/journal/EditSessionForm";
import type { Session } from "@/lib/firebase/types";

export default function SessionsPage() {
  const { userId, loading: authLoading } = useAuth();
  const { sessions, loading, refresh }   = useSessions(userId);
  const [editSession, setEditSession]    = useState<Session | null>(null);

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase">Loading...</div>
    </div>
  );

  if (!userId) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
          FIELD LOG
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold text-white mb-2">
          All Sessions
        </h1>
        <p className="text-[#666666] text-sm">
          Every field session. Click to open, hover to edit.
        </p>
      </div>

      <div className="h-px bg-[#252525] mb-8" />

      {/* Inline edit panel */}
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

      <AllSessionsList
        sessions={sessions}
        loading={loading}
        onEdit={(session) => setEditSession(session)}
      />
    </div>
  );
}
