"use client";

import { useState, useEffect } from "react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Layers } from "lucide-react";

export function FlashcardDeck() {
  const { user } = useAuth();
  const {
    cards,
    currentIndex,
    currentCard,
    isFlipped,
    loading,
    error,
    isComplete,
    flip,
    rate,
    skip,
  } = useFlashcards(user?.uid || "");

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-64 bg-[#1A1A1A]" />
        <div className="flex justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-12 bg-[#1A1A1A]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState icon={Layers} title="Error" description={error} />;
  }

  if (!currentCard) {
    return <EmptyState icon={Layers} title="No cards to review" description="All caught up!" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-xs text-[#666666] font-[family-name:var(--font-jetbrains)]">
        <span>{currentIndex + 1} / {cards.length}</span>
        <span>EASY · HARD · BLANK</span>
      </div>

      <div
        onClick={flip}
        className={cn(
          "min-h-[230px] bg-[#111111] border border-[#252525] p-6 cursor-pointer transition-all hover:border-[#333333]",
          isFlipped && "bg-[#1A1A1A]"
        )}
      >
        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest text-[#FF5500]">
              {currentCard.category}
            </span>
            <p className="font-[family-name:var(--font-syne)] text-xl italic">
              {currentCard.prompt}
            </p>
            <span className="text-[10px] text-[#666666]">TAP TO REVEAL ↓</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[#888888]">{currentCard.response}</p>
            {currentCard.exampleLine && (
              <div className="p-3 bg-[rgba(255,85,0,0.07)] border-l-2 border-[#FF5500]">
                <p className="text-sm text-white italic">"{currentCard.exampleLine}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isFlipped && (
        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          <button
            onClick={() => rate("easy")}
            className="py-4 border border-[#22C55E] text-[#22C55E] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:bg-[#22C55E] hover:text-white transition-colors"
          >
            Easy
            <span className="block text-[10px] mt-1 opacity-70">7 days</span>
          </button>
          <button
            onClick={() => rate("hard")}
            className="py-4 border border-[#EAB308] text-[#EAB308] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:bg-[#EAB308] hover:text-white transition-colors"
          >
            Hard
            <span className="block text-[10px] mt-1 opacity-70">1 day</span>
          </button>
          <button
            onClick={() => rate("blank")}
            className="py-4 border border-[#EF4444] text-[#EF4444] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest hover:bg-[#EF4444] hover:text-white transition-colors"
          >
            Blank
            <span className="block text-[10px] mt-1 opacity-70">4 hours</span>
          </button>
        </div>
      )}
    </div>
  );
}
