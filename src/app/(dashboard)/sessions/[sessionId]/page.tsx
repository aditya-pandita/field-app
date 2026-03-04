"use client";

// src/app/(dashboard)/sessions/[sessionId]/page.tsx
// Session detail + approach logger (moved from /journal/[sessionId]).

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSessionById } from "@/lib/firebase/queries/sessions";
import { SessionDetail } from "@/components/journal/SessionDetail";
import type { Session } from "@/lib/firebase/types";

export default function SessionDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = params.sessionId as string;

  useEffect(() => {
    async function loadSession() {
      if (!sessionId) return;
      try {
        const data = await getSessionById(sessionId);
        setSession(data);
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="font-[family-name:var(--font-syne)] text-xl text-white mb-4">
          Session not found
        </p>
        <button
          onClick={() => router.push("/sessions")}
          className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
        >
          BACK TO SESSIONS
        </button>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div>
      <SessionDetail session={session} userId={userId} />
    </div>
  );
}
