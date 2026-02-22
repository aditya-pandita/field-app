"use client";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import { FlashcardDeck } from "@/components/flashcards/FlashcardDeck";

export default function FlashcardsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="SPACED REPETITION"
          title="Flashcards"
          subtitle="Review key concepts and techniques"
        />
        <div className="space-y-4 animate-pulse">
          <div className="h-64 bg-[#1A1A1A]" />
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-12 bg-[#1A1A1A]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="SPACED REPETITION"
        title="Flashcards"
        subtitle="Review key concepts and techniques"
      />
      {user && <FlashcardDeck />}
    </div>
  );
}
