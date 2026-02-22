"use client";

import { TopicCard } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  topic: TopicCard;
  nextTopic?: TopicCard;
}

export function TopicCardComponent({ topic, nextTopic }: TopicCardProps) {
  return (
    <div className="bg-white text-black p-6 border-l-4 border-l-[#FF5500]">
      <h3 className="font-[family-name:var(--font-syne)] text-2xl">{topic.topic}</h3>
      {nextTopic && (
        <p className="text-[#666666] text-sm mt-2 opacity-50">
          Next: {nextTopic.topic}
        </p>
      )}
      <p className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-widest mt-4 text-[#888888]">
        Tap to reveal ↓
      </p>
    </div>
  );
}
