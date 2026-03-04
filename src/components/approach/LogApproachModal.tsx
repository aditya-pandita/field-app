"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApproachLogger } from "./ApproachLogger";
import { getUserSessions } from "@/lib/firebase/queries/sessions";
import type { Approach, Session } from "@/lib/firebase/types";
import type { ProgramMeta } from "@/hooks/useApproachLogger";

interface LogApproachModalProps {
  isOpen:            boolean;
  onClose:           () => void;
  userId:            string;
  existingApproach?: Approach;   // set → edit mode
  programMeta?:      ProgramMeta;
  onSuccess?:        (approachId: string) => void;
}

export function LogApproachModal({
  isOpen,
  onClose,
  userId,
  existingApproach,
  programMeta,
  onSuccess,
}: LogApproachModalProps) {
  const isEditMode = !!existingApproach;

  const [sessions,        setSessions]        = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(!isEditMode);

  useEffect(() => {
    // Edit mode doesn't need a session list — session is already on the approach
    if (isEditMode || !isOpen || !userId) return;
    setSessionsLoading(true);
    getUserSessions(userId)
      .then(setSessions)
      .catch(console.error)
      .finally(() => setSessionsLoading(false));
  }, [isOpen, userId, isEditMode]);

  useEffect(() => {
    if (!isOpen) {
      setSessions([]);
      setSessionsLoading(!isEditMode);
    }
  }, [isOpen, isEditMode]);

  const title = isEditMode ? "Edit Approach" : "Log Approach";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="p-6">
        {sessionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#444444] uppercase tracking-widest">
              Loading sessions...
            </span>
          </div>
        ) : isEditMode ? (
          <ApproachLogger
            key={existingApproach!.approachId}
            userId={userId}
            sessionId={existingApproach!.sessionId}
            existingApproach={existingApproach}
            onSuccess={() => { onSuccess?.(existingApproach!.approachId); onClose(); }}
            onClose={onClose}
          />
        ) : (
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
