"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApproachLogger } from "./ApproachLogger";
import { getUserSessions } from "@/lib/firebase/queries/sessions";
import type { Session } from "@/lib/firebase/types";
import type { ProgramMeta } from "@/hooks/useApproachLogger";

interface LogApproachModalProps {
  isOpen:          boolean;
  onClose:         () => void;
  userId:          string;
  programMeta?:    ProgramMeta;
  onSuccess?:      (approachId: string) => void;
}

export function LogApproachModal({
  isOpen,
  onClose,
  userId,
  programMeta,
  onSuccess,
}: LogApproachModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!isOpen || !userId) return;
    getUserSessions(userId).then(setSessions).catch(console.error);
  }, [isOpen, userId]);

  const handleSuccessWithId = (approachId: string) => {
    onSuccess?.(approachId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Approach" size="lg">
      <div className="p-6">
        {isOpen && (
          <ApproachLogger
            userId={userId}
            sessionId=""
            availableSessions={sessions}
            programMeta={programMeta}
            onSuccessWithId={handleSuccessWithId}
            onClose={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
