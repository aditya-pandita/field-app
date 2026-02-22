import { useState, useCallback, useRef } from "react";
import type { Difficulty, ScenarioMessage, ScenarioFeedback } from "@/lib/firebase/types";
import { getScenarioById } from "@/lib/scenario/scenarios";
import { buildSystemPrompt, FEEDBACK_SYSTEM_PROMPT } from "@/lib/scenario/prompts";
import { createScenarioSession, saveScenarioMessages, saveScenarioFeedback, completeScenarioSession } from "@/lib/firebase/queries/scenario";

export type ScenarioPhase = "setup" | "chat" | "feedback";

export function useScenarioPractice(userId: string) {
  const [phase, setPhase] = useState<ScenarioPhase>("setup");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("neutral");
  const [messages, setMessages] = useState<ScenarioMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ScenarioFeedback | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesRef = useRef<ScenarioMessage[]>([]);

  const selectScenario = useCallback((id: string) => {
    setSelectedScenarioId(id);
  }, []);

  const selectDifficulty = useCallback((d: Difficulty) => {
    setDifficulty(d);
  }, []);

  const startSession = useCallback(async () => {
    if (!selectedScenarioId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const scenario = getScenarioById(selectedScenarioId);
      if (!scenario) throw new Error("Scenario not found");

      const newSessionId = await createScenarioSession(userId, selectedScenarioId, scenario.name, difficulty);
      setSessionId(newSessionId);
      
      const systemPrompt = buildSystemPrompt(scenario, difficulty);
      const initialMessage: ScenarioMessage = {
        role: "assistant",
        content: `(${scenario.name} looks up as you approach)`,
        timestamp: Date.now(),
      };
      
      messagesRef.current = [initialMessage];
      setMessages([initialMessage]);
      setPhase("chat");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start session");
    } finally {
      setLoading(false);
    }
  }, [userId, selectedScenarioId, difficulty]);

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || !selectedScenarioId) return;

    const userMessage: ScenarioMessage = {
      role: "user",
      content,
      timestamp: Date.now(),
    };

    messagesRef.current = [...messagesRef.current, userMessage];
    setMessages([...messagesRef.current]);
    setLoading(true);

    try {
      const response = await fetch("/api/scenario/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesRef.current,
          scenarioId: selectedScenarioId,
          difficulty,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: ScenarioMessage = {
        role: "assistant",
        content: data.reply,
        timestamp: Date.now(),
      };

      messagesRef.current = [...messagesRef.current, assistantMessage];
      setMessages([...messagesRef.current]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  }, [sessionId, selectedScenarioId, difficulty]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      await saveScenarioMessages(sessionId, messagesRef.current);

      const response = await fetch("/api/scenario/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesRef.current,
          scenarioId: selectedScenarioId,
          difficulty,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
        await saveScenarioFeedback(sessionId, data);
      }

      await completeScenarioSession(sessionId, messagesRef.current.length);
      setPhase("feedback");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to end session");
    } finally {
      setLoading(false);
    }
  }, [sessionId, selectedScenarioId, difficulty]);

  const resetSession = useCallback(() => {
    setPhase("setup");
    setSelectedScenarioId(null);
    setDifficulty("neutral");
    setMessages([]);
    setError(null);
    setFeedback(null);
    setSessionId(null);
    messagesRef.current = [];
  }, []);

  const messageCount = messages.filter((m) => m.role === "user").length;

  return {
    phase,
    selectedScenarioId,
    difficulty,
    messages,
    loading,
    error,
    feedback,
    sessionId,
    messageCount,
    selectScenario,
    selectDifficulty,
    startSession,
    sendMessage,
    endSession,
    resetSession,
  };
}
