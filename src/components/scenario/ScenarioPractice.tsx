"use client";

import { useScenarioPractice } from "@/hooks/useScenarioPractice";
import { useAuth } from "@/hooks/useAuth";
import { ScenarioPicker } from "./ScenarioPicker";
import { DifficultyPicker } from "./DifficultyPicker";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScenarioFeedbackComponent } from "./ScenarioFeedback";
import { Skeleton } from "@/components/ui/Skeleton";

export function ScenarioPractice() {
  const { user } = useAuth();
  const {
    phase,
    selectedScenarioId,
    difficulty,
    messages,
    loading,
    error,
    feedback,
    selectScenario,
    selectDifficulty,
    startSession,
    sendMessage,
    endSession,
    resetSession,
  } = useScenarioPractice(user?.uid || "");

  if (phase === "setup") {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl mb-2">Choose a Scenario</h2>
          <p className="text-[#666666] text-sm">Practice approaching different characters</p>
        </div>
        
        <ScenarioPicker selectedId={selectedScenarioId} onSelect={selectScenario} />
        
        {selectedScenarioId && (
          <>
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-lg mb-4">Select Difficulty</h3>
              <DifficultyPicker selected={difficulty} onSelect={selectDifficulty} />
            </div>
            
            <button
              onClick={startSession}
              disabled={loading}
              className="w-full bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Practice"}
            </button>
          </>
        )}
      </div>
    );
  }

  if (phase === "feedback") {
    return (
      <ScenarioFeedbackComponent
        feedback={feedback!}
        onDone={resetSession}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] border-l-2 border-[#FF5500] px-4 py-2">
              <p className="text-sm text-[#666666] animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput onSend={sendMessage} disabled={loading} />
      
      <button
        onClick={endSession}
        className="w-full border border-[#252525] text-[#666666] py-2 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest hover:border-[#333333] hover:text-white transition-colors"
      >
        End Session
      </button>
    </div>
  );
}
