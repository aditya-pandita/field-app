"use client";

import { useConversationTrainer } from "@/hooks/useConversationTrainer";
import { useAuth } from "@/hooks/useAuth";
import { TrainerSetup } from "./TrainerSetup";
import { TopicCardComponent } from "./TopicCard";
import { TimerRing } from "./TimerRing";
import { PivotRating } from "./PivotRating";
import { TrainerSummary } from "./TrainerSummary";

const DIFFICULTY_CONFIG = {
  easy: { timeLimit: 60, topicCount: 5 },
  medium: { timeLimit: 45, topicCount: 6 },
  hard: { timeLimit: 30, topicCount: 7 },
};

export function ConversationTrainer() {
  const { user } = useAuth();
  const {
    phase,
    difficulty,
    currentTopic,
    nextTopic,
    remainingSecs,
    pivotLogs,
    smoothCount,
    awkwardCount,
    blankCount,
    smoothPct,
    setDifficulty,
    startSession,
    handleTimerEnd,
    ratePivot,
    finishSession,
    reset,
  } = useConversationTrainer(user?.uid || "");

  const config = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;

  if (phase === "idle") {
    return <TrainerSetup onSelect={setDifficulty} selected={difficulty} />;
  }

  if (phase === "topic" && config && currentTopic) {
    return (
      <div className="space-y-8 text-center">
        <TimerRing remainingSecs={remainingSecs} totalSecs={config.timeLimit} />
        <TopicCardComponent topic={currentTopic} nextTopic={nextTopic} />
        <button
          onClick={handleTimerEnd}
          className="text-[#FF5500] text-sm font-[family-name:var(--font-jetbrains)] uppercase tracking-widest"
        >
          Skip to Pivot →
        </button>
      </div>
    );
  }

  if (phase === "transition" || phase === "rating") {
    return <PivotRating onRate={ratePivot} />;
  }

  if (phase === "complete") {
    return (
      <TrainerSummary
        totalPivots={pivotLogs.length}
        smoothCount={smoothCount}
        awkwardCount={awkwardCount}
        blankCount={blankCount}
        smoothPct={smoothPct}
        onDone={reset}
        onRetry={() => {
          reset();
          if (difficulty) setDifficulty(difficulty);
        }}
      />
    );
  }

  return null;
}
