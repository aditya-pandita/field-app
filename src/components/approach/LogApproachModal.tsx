"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApproachLogger } from "./ApproachLogger";
import { getUserSessions } from "@/lib/firebase/queries/sessions";
import type { Session } from "@/lib/firebase/types";
import type { ProgramMeta } from "@/hooks/useApproachLogger";

interface LogApproachModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  userId:       string;
  programMeta?: ProgramMeta;
  onSuccess?:   (approachId: string) => void;
}

export function LogApproachModal({
  isOpen,
  onClose,
  userId,
  programMeta,
  onSuccess,
}: LogApproachModalProps) {
  const [sessions,  setSessions]  = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;
    setSessionsLoading(true);
    getUserSessions(userId)
      .then(setSessions)
      .catch(console.error)
      .finally(() => setSessionsLoading(false));
  }, [isOpen, userId]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSessions([]);
      setSessionsLoading(true);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Approach" size="lg">
      <div className="p-6">
        {sessionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#444444] uppercase tracking-widest">
              Loading sessions...
            </span>
          </div>
        ) : (
          // key forces remount with correct initial state once sessions are ready
          <ApproachLogger
            key={sessions[0]?.sessionId ?? "no-session"}
            userId={userId}
            sessionId=""
            initialSessionId={sessions[0]?.sessionId}
            availableSessions={sessions}
            programMeta={programMeta}
            onSuccessWithId={onSuccess}
            onClose={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
