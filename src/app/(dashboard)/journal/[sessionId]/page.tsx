"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSessionById } from "@/lib/firebase/queries/sessions";
import { getSessionApproaches } from "@/lib/firebase/queries/approaches";
import PageHeader from "@/components/layout/PageHeader";
import SectionLabel from "@/components/layout/SectionLabel";
import { Modal } from "@/components/ui/Modal";
import { ApproachLogger } from "@/components/approach/ApproachLogger";
import type { Session, Approach } from "@/lib/firebase/types";
import { formatDate, formatScore } from "@/lib/utils/format";
import { getScoreColor } from "@/lib/utils/scores";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogger, setShowLogger] = useState(false);

  const sessionId = params.sessionId as string;

  useEffect(() => {
    async function loadData() {
      if (!sessionId) return;
      try {
        const sessionData = await getSessionById(sessionId);
        if (sessionData) {
          setSession(sessionData);
          const approachData = await getSessionApproaches(sessionId);
          setApproaches(approachData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionId]);

  const handleApproachLogged = async () => {
    setShowLogger(false);
    const approachData = await getSessionApproaches(sessionId);
    setApproaches(approachData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] mb-4">Session not found</div>
        <button
          onClick={() => router.push("/journal")}
          className="bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3"
        >
          Back to Journal
        </button>
      </div>
    );
  }

  const avgScore =
    approaches.length > 0
      ? approaches.reduce((sum, a) => sum + a.scoreOverall, 0) / approaches.length
      : 0;

  return (
    <div>
      <PageHeader
        eyebrow="SESSION"
        title={formatDate(session.sessionDate, "long")}
        subtitle={`${session.locationName || session.locationType} · ${session.timeOfDay}`}
        action={
          <button
            onClick={() => setShowLogger(true)}
            className="bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 cursor-pointer transition-all duration-150 hover:bg-[#E64D00]"
          >
            + LOG APPROACH
          </button>
        }
      />

      <div className="flex gap-8 mb-8">
        <div>
          <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1">
            Weather
          </div>
          <div className="text-white capitalize">{session.weather}</div>
        </div>
        <div>
          <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1">
            Mood Before
          </div>
          <div className="text-white capitalize">{session.moodBefore}</div>
        </div>
        <div>
          <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1">
            Approaches
          </div>
          <div className="text-white">{session.totalApproaches}</div>
        </div>
        <div>
          <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1">
            Avg Score
          </div>
          <div className="text-white">{formatScore(avgScore)}</div>
        </div>
      </div>

      {session.notes && (
        <>
          <div className="h-[1px] bg-[#1A1A1A] my-8" />
          <SectionLabel>NOTES</SectionLabel>
          <div className="text-[#888888] italic mb-8">{session.notes}</div>
        </>
      )}

      <div className="h-[1px] bg-[#1A1A1A] my-8" />
      <SectionLabel>APPROACHES ({approaches.length})</SectionLabel>

      {approaches.length === 0 ? (
        <div className="text-center py-12 text-[#666666]">
          No approaches logged yet. Start logging your approaches!
        </div>
      ) : (
        <div className="space-y-4">
          {approaches.map((approach, index) => (
            <div
              key={approach.approachId}
              className="bg-[#111111] border border-[#252525] p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="font-['Syne'] text-[36px] font-bold text-[#252525]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#FF5500]">
                      {approach.phaseReached}
                    </div>
                    <div className="text-[12px] text-[#666666] capitalize">
                      {approach.outcome.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <div
                  className="font-['Syne'] text-[36px] font-bold"
                  style={{ color: getScoreColor(approach.scoreOverall) }}
                >
                  {formatScore(approach.scoreOverall)}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
                {[
                  { label: "Execution", value: approach.scoreExecution },
                  { label: "Tonality", value: approach.scoreTonality },
                  { label: "Investment", value: approach.scoreInvestment },
                  { label: "Close", value: approach.scoreClose },
                  { label: "Recovery", value: approach.scoreRecovery },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="font-['JetBrains_Mono'] text-[8px] tracking-[1px] uppercase text-[#4A4A4A]">
                      {metric.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#252525]">
                        <div
                          className="h-full bg-[#FF5500]"
                          style={{ width: `${metric.value * 10}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-white">{metric.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {approach.notableMoment && (
                <div className="bg-[rgba(255,85,0,0.07)] border-l-2 border-[#7A2900] px-4 py-3 text-[13px] italic text-[#AAAAAA]">
                  &quot;{approach.notableMoment}&quot;
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showLogger} onClose={() => setShowLogger(false)} title="Log Approach" size="lg">
        {userId && sessionId && (
          <div className="p-4">
            <ApproachLogger
              userId={userId}
              sessionId={sessionId}
              onSuccess={handleApproachLogged}
              onClose={() => setShowLogger(false)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
