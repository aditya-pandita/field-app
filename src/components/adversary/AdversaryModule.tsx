"use client";

import { useAdversary } from "@/hooks/useAdversary";
import { useAuth } from "@/hooks/useAuth";
import { ArchetypePicker } from "./ArchetypePicker";
import { AdversarySetup } from "./AdversarySetup";
import { BreathingExercise } from "./BreathingExercise";
import { AdversaryChat } from "./AdversaryChat";
import { ResilienceDebrief } from "./ResilienceDebrief";

export function AdversaryModule() {
  const { user } = useAuth();
  const {
    phase,
    selectedArchetype,
    intensity,
    messages,
    loading,
    error,
    debrief,
    debriefLoading,
    canBegin,
    selectArchetype,
    setIntensity,
    beginSession,
    sendMessage,
    endSession,
    reset,
  } = useAdversary(user?.uid || "");

  if (phase === "zone-entry") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl mb-2">Zone Entry</h2>
          <p className="text-[#666666] text-sm">Prepare your mind for resilience training</p>
        </div>
        <BreathingExercise onComplete={() => {}} />
        <button
          onClick={reset}
          className="text-[#EF4444] text-sm font-[family-name:var(--font-jetbrains)] uppercase tracking-widest"
        >
          Skip →
        </button>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl mb-2">Choose Your Adversary</h2>
          <p className="text-[#666666] text-sm">Face your fears through psychological simulation</p>
        </div>
        <ArchetypePicker selected={selectedArchetype} onSelect={selectArchetype} />
        <AdversarySetup
          selectedArchetype={selectedArchetype}
          intensity={intensity}
          onIntensityChange={setIntensity}
          onBegin={beginSession}
          canBegin={canBegin}
        />
      </div>
    );
  }

  if (phase === "chat") {
    return (
      <AdversaryChat
        messages={messages}
        loading={loading}
        onSend={sendMessage}
        onEnd={endSession}
      />
    );
  }

  if (phase === "debrief") {
    return (
      <ResilienceDebrief
        debrief={debrief!}
        loading={debriefLoading || false}
        onDone={reset}
      />
    );
  }

  return null;
}
