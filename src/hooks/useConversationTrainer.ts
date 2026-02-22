import { useState, useCallback, useRef, useEffect } from "react";
import type { TrainerDifficulty, SelfRating, TopicCard, TransitionPhrase } from "@/lib/firebase/types";
import { getTopicBank, getTransitionPhrases, createTrainerSession, logTrainerPivot, completeTrainerSession } from "@/lib/firebase/queries/trainer";

export type TrainerPhase = "idle" | "topic" | "transition" | "rating" | "complete";

const DIFFICULTY_CONFIG: Record<TrainerDifficulty, { timeLimit: number; topicCount: number }> = {
  easy: { timeLimit: 60, topicCount: 5 },
  medium: { timeLimit: 45, topicCount: 6 },
  hard: { timeLimit: 30, topicCount: 7 },
};

interface PivotLog {
  topicId: string;
  phraseId: string;
  rating: SelfRating;
}

export function useConversationTrainer(userId: string) {
  const [phase, setPhase] = useState<TrainerPhase>("idle");
  const [difficulty, setDifficulty] = useState<TrainerDifficulty | null>(null);
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [phrases, setPhrases] = useState<TransitionPhrase[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [pivotLogs, setPivotLogs] = useState<PivotLog[]>([]);
  const [rating, setRating] = useState<SelfRating | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const config = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  const loadTopicsAndPhrases = useCallback(async () => {
    setLoading(true);
    try {
      const difficultyNum = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
      const [loadedTopics, loadedPhrases] = await Promise.all([
        getTopicBank(difficultyNum),
        getTransitionPhrases(difficultyNum),
      ]);
      setTopics(loadedTopics);
      setPhrases(loadedPhrases);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  const setDifficultyAndStart = useCallback(async (d: TrainerDifficulty) => {
    setDifficulty(d);
    await loadTopicsAndPhrases();
  }, [loadTopicsAndPhrases]);

  const startSession = useCallback(async () => {
    if (!difficulty || topics.length === 0) return;

    setLoading(true);
    try {
      const newSessionId = await createTrainerSession(userId, difficulty);
      setSessionId(newSessionId);
      setCurrentTopicIndex(0);
      setPivotLogs([]);
      setRating(null);
      setElapsedSecs(0);
      setPhase("topic");

      timerRef.current = setInterval(() => {
        setElapsedSecs((s) => {
          if (s >= config!.timeLimit) {
            handleTimerEnd();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start session");
    } finally {
      setLoading(false);
    }
  }, [userId, difficulty, topics.length, config]);

  const handleTimerEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase("transition");
  }, []);

  const advanceFromTransition = useCallback(async (selectedRating: SelfRating) => {
    setRating(selectedRating);
    
    const currentTopic = topics[currentTopicIndex];
    const nextTopicIndex = currentTopicIndex + 1;
    
    if (sessionId && currentTopic) {
      await logTrainerPivot(sessionId, {
        topicId: currentTopic.id,
        phraseId: phrases[Math.floor(Math.random() * phrases.length)]?.id || "",
        rating: selectedRating,
      });
    }

    setPivotLogs((prev) => [...prev, {
      topicId: currentTopic?.id || "",
      phraseId: "",
      rating: selectedRating,
    }]);

    if (nextTopicIndex >= topics.length) {
      setPhase("rating");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setCurrentTopicIndex(nextTopicIndex);
      setRating(null);
      setPhase("topic");
    }
  }, [currentTopicIndex, topics, phrases, sessionId]);

  const ratePivot = useCallback((r: SelfRating) => {
    advanceFromTransition(r);
  }, [advanceFromTransition]);

  const finishSession = useCallback(async () => {
    if (sessionId) {
      await completeTrainerSession(sessionId, pivotLogs.length);
    }
    setPhase("complete");
  }, [sessionId, pivotLogs.length]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase("idle");
    setDifficulty(null);
    setTopics([]);
    setPhrases([]);
    setCurrentTopicIndex(0);
    setPivotLogs([]);
    setRating(null);
    setElapsedSecs(0);
    setError(null);
    setSessionId(null);
  }, []);

  const currentTopic = topics[currentTopicIndex] || null;
  const nextTopic = topics[currentTopicIndex + 1] || null;
  const progressPct = config ? ((currentTopicIndex) / config.topicCount) * 100 : 0;
  
  const smoothCount = pivotLogs.filter((p) => p.rating === "smooth").length;
  const awkwardCount = pivotLogs.filter((p) => p.rating === "awkward").length;
  const blankCount = pivotLogs.filter((p) => p.rating === "blank").length;
  const smoothPct = pivotLogs.length > 0 ? (smoothCount / pivotLogs.length) * 100 : 0;

  const remainingSecs = config ? config.timeLimit - elapsedSecs : 0;

  return {
    phase,
    difficulty,
    currentTopic,
    nextTopic,
    progressPct,
    remainingSecs,
    elapsedSecs,
    loading,
    error,
    smoothCount,
    awkwardCount,
    blankCount,
    smoothPct,
    pivotLogs,
    rating,
    setDifficulty: setDifficultyAndStart,
    startSession,
    handleTimerEnd,
    advanceFromTransition,
    ratePivot,
    finishSession,
    reset,
  };
}
