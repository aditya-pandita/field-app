"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BreathingExerciseProps {
  onComplete: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [round, setRound] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const intervals = {
      inhale: () => {
        setPhase("inhale");
        setScale(1.5);
      },
      hold: () => {
        setPhase("hold");
      },
      exhale: () => {
        setPhase("exhale");
        setScale(1);
      },
    };

    const timer = setInterval(() => {
      const currentPhase = phase;
      if (currentPhase === "inhale") {
        intervals.hold();
      } else if (currentPhase === "hold") {
        intervals.exhale();
      } else {
        if (round >= 3) {
          clearInterval(timer);
          onComplete();
        } else {
          setRound((r) => r + 1);
          intervals.inhale();
        }
      }
    }, phase === "inhale" ? 4000 : phase === "hold" ? 7000 : 8000);

    return () => clearInterval(timer);
  }, [phase, round, onComplete]);

  const phaseText = {
    inhale: "BREATHE IN",
    hold: "HOLD",
    exhale: "BREATHE OUT",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={cn(
          "w-48 h-48 rounded-full border-4 border-[#EF4444] flex items-center justify-center transition-all duration-[4000ms]",
          phase === "inhale" && "scale-150",
          phase === "hold" && "scale-150",
          phase === "exhale" && "scale-100"
        )}
      >
        <span className="font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest text-[#EF4444]">
          {phaseText[phase]}
        </span>
      </div>
      <p className="mt-6 text-[#666666] font-[family-name:var(--font-jetbrains)] text-sm">
        Round {round} of 3
      </p>
    </div>
  );
}
