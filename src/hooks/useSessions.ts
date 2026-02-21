"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserSessions, createSession as createSessionQuery } from "@/lib/firebase/queries/sessions";
import type { Session, NewSession } from "@/lib/firebase/types";

export function useSessions(userId: string | null) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserSessions(userId);
      setSessions(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSession = useCallback(
    async (data: NewSession) => {
      if (!userId) return null;
      const created = await createSessionQuery(userId, data);
      setSessions((prev) => [created, ...prev]);
      return created;
    },
    [userId]
  );

  return { sessions, loading, error, refresh, createSession };
}
