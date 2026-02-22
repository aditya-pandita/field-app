import { useState, useCallback, useRef } from "react";
import type { AdversaryArchetype, AdversaryIntensity, AdversaryDebrief } from "@/lib/firebase/types";
import { getArchetypeById } from "@/lib/adversary/archetypes";
import { buildAdversarySystemPrompt } from "@/lib/adversary/prompts";
import { createAdversarySession, saveAdversaryMessages, saveAdversaryDebrief, completeAdversarySession } from "@/lib/firebase/queries/adversary";

export type AdversaryPhase = "zone-entry" | "setup" | "chat" | "debrief";
export type ZoneStep = 0 | 1 | 2 | 3;

export function useAdversary(userId: string) {
  const [phase, setPhase] = useState<AdversaryPhase>("zone-entry");
  const [zoneStep, setZoneStep] = useState<ZoneStep>(0);
  const [intention, setIntention] = useState("");
  const [anchorPhrase, setAnchorPhrase] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<AdversaryArchetype | null>(null);
  const [intensity, setIntensity] = useState<AdversaryIntensity>("controlled");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; timestamp: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [debrief, setDebrief] = useState<AdversaryDebrief | null>(null);
  const [debriefLoading, setDebriefLoading] = useState(false);
  
  const messagesRef = useRef<{ role: "user" | "assistant"; content: string; timestamp: number }[]>([]);

  const setIntentionText = useCallback((text: string) => {
    setIntention(text);
  }, []);

  const advanceZoneStep = useCallback(() => {
    setZoneStep((s) => (s < 3 ? (s + 1) as ZoneStep : 3));
  }, []);

  const setAnchor = useCallback((phrase: string) => {
    setAnchorPhrase(phrase);
  }, []);

  const skipZoneEntry = useCallback(() => {
    setZoneStep(3);
  }, []);

  const selectArchetype = useCallback((id: AdversaryArchetype) => {
    setSelectedArchetype(id);
  }, []);

  const setIntensityLevel = useCallback((i: AdversaryIntensity) => {
    setIntensity(i);
  }, []);

  const canBegin = !!(selectedArchetype && zoneStep === 3);

  const beginSession = useCallback(async () => {
    if (!selectedArchetype || zoneStep !== 3) return;

    setLoading(true);
    setError(null);

    try {
      const archetype = getArchetypeById(selectedArchetype);
      if (!archetype) throw new Error("Archetype not found");

      const newSessionId = await createAdversarySession(userId, selectedArchetype, intensity);
      setSessionId(newSessionId);

      const systemPrompt = buildAdversarySystemPrompt(archetype, intensity);
      const initialMessage = {
        role: "assistant" as const,
        content: `(${archetype.name} looks at you with ${archetype.tagline.toLowerCase()})`,
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
  }, [userId, selectedArchetype, intensity, zoneStep]);

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || !selectedArchetype) return;

    const userMessage = {
      role: "user" as const,
      content,
      timestamp: Date.now(),
    };

    messagesRef.current = [...messagesRef.current, userMessage];
    setMessages([...messagesRef.current]);
    setLoading(true);

    try {
      const response = await fetch("/api/adversary/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesRef.current,
          archetypeId: selectedArchetype,
          intensity,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage = {
        role: "assistant" as const,
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
  }, [sessionId, selectedArchetype, intensity]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      await saveAdversaryMessages(sessionId, messagesRef.current);

      setDebriefLoading(true);
      const response = await fetch("/api/adversary/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesRef.current,
          archetypeId: selectedArchetype,
          intensity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDebrief(data);
        await saveAdversaryDebrief(sessionId, data);
      }

      await completeAdversarySession(sessionId, messagesRef.current.length);
      setPhase("debrief");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to end session");
    } finally {
      setLoading(false);
      setDebriefLoading(false);
    }
  }, [sessionId, selectedArchetype, intensity]);

  const reset = useCallback(() => {
    setPhase("zone-entry");
    setZoneStep(0);
    setIntention("");
    setAnchorPhrase("");
    setSelectedArchetype(null);
    setIntensity("controlled");
    setMessages([]);
    setError(null);
    setSessionId(null);
    setDebrief(null);
    messagesRef.current = [];
  }, []);

  const messageCount = messages.filter((m) => m.role === "user").length;

  return {
    phase,
    zoneStep,
    intention,
    anchorPhrase,
    selectedArchetype,
    intensity,
    messages,
    loading,
    error,
    sessionId,
    debrief,
    debriefLoading,
    canBegin,
    messageCount,
    setIntention: setIntentionText,
    advanceZoneStep,
    setAnchorPhrase: setAnchor,
    skipZoneEntry,
    selectArchetype,
    setIntensity: setIntensityLevel,
    beginSession,
    sendMessage,
    endSession,
    reset,
  };
}
