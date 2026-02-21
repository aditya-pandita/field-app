"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import PageHeader from "@/components/layout/PageHeader";
import SectionLabel from "@/components/layout/SectionLabel";
import SessionList from "@/components/journal/SessionList";

export default function JournalPage() {
  const { userId, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading } = useSessions(userId);
  const router = useRouter();

  const loading = authLoading || sessionsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase">
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
            className="bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 cursor-pointer transition-all duration-150 hover:bg-[#E64D00]"
          >
            + NEW SESSION
          </Link>
        }
      />

      <div className="h-[1px] bg-[#1A1A1A] my-8" />
      <SectionLabel>FEBRUARY 2026</SectionLabel>

      <SessionList
        sessions={sessions}
        onSessionClick={(id) => router.push(`/journal/${id}`)}
      />
    </div>
  );
}
