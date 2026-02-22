import { useState, useCallback, useEffect } from "react";
import type { FlashcardTemplate, FlashcardCategory } from "@/lib/firebase/types";
import { getFlashcardsForReview, recordFlashcardResult, getFlashcardTemplates } from "@/lib/firebase/queries/flashcards";

interface FlashcardWithProgress {
  template: FlashcardTemplate;
  progress: {
    easeCount: number;
    hardCount: number;
    blankCount: number;
    masteryLevel: number;
  } | null;
}

export function useFlashcards(userId: string) {
  const [cards, setCards] = useState<FlashcardWithProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory | "all">("all");

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedCards = await getFlashcardsForReview(userId, 10);
      setCards(loadedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const flip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const rate = useCallback(async (result: "easy" | "hard" | "blank") => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await recordFlashcardResult(userId, currentCard.template.id, result);
      
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsFlipped(false);
      } else {
        await loadCards();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to record result");
    }
  }, [userId, currentIndex, cards, loadCards]);

  const skip = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const currentCard = cards[currentIndex]?.template || null;
  const isComplete = currentIndex >= cards.length && cards.length > 0;
  const progressPct = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0;

  const categories: FlashcardCategory[] = ["opener", "stack", "rapport", "close", "recovery", "frame"];

  return {
    cards,
    currentIndex,
    currentCard,
    isFlipped,
    loading,
    error,
    isComplete,
    progressPct,
    categories,
    selectedCategory,
    setSelectedCategory,
    flip,
    rate,
    skip,
    refresh: loadCards,
  };
}
