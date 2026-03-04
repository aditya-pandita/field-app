"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PushPullTopic } from "@/lib/firebase/types";

interface PushPullTopicsProps {
  topics: PushPullTopic[];
  onChange: (topics: PushPullTopic[]) => void;
}

const TYPE_STYLES: Record<PushPullTopic["type"], string> = {
  push:    "border-[#FF5500]/50 text-[#FF5500] bg-[rgba(255,85,0,0.07)]",
  pull:    "border-[#22C55E]/50 text-[#22C55E] bg-[rgba(34,197,94,0.07)]",
  neutral: "border-[#4A4A4A] text-[#888888] bg-transparent",
};

const TYPE_LABELS: Record<PushPullTopic["type"], string> = {
  push:    "Push",
  pull:    "Pull",
  neutral: "Neutral",
};

export function PushPullTopics({ topics, onChange }: PushPullTopicsProps) {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<PushPullTopic["type"]>("neutral");
  const [note, setNote] = useState("");

  const handleAdd = () => {
    if (!topic.trim()) return;
    onChange([...topics, { topic: topic.trim(), type, note: note.trim() }]);
    setTopic("");
    setNote("");
    setType("neutral");
  };

  const handleRemove = (index: number) => {
    onChange(topics.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Existing chips */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topics.map((t, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 border font-['JetBrains_Mono'] text-[9px] tracking-[1px] uppercase",
                TYPE_STYLES[t.type]
              )}
            >
              <span>{t.topic}</span>
              {t.note && (
                <span className="text-[#4A4A4A] normal-case tracking-normal">— {t.note}</span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={8} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add row */}
      <div className="flex gap-2 items-start flex-wrap">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder="Topic..."
          className="flex-1 min-w-[120px] bg-[#111111] border border-[#252525] text-white px-3 py-2 font-['JetBrains_Mono'] text-[10px] outline-none focus:border-[#4A4A4A] transition-colors placeholder:text-[#333333]"
        />
        {/* Type selector */}
        <div className="flex gap-1">
          {(["push", "pull", "neutral"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "px-2 py-2 border font-['JetBrains_Mono'] text-[9px] tracking-[1px] uppercase transition-colors",
                type === t ? TYPE_STYLES[t] : "border-[#252525] text-[#4A4A4A] hover:border-[#333333]"
              )}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)..."
          className="flex-1 min-w-[120px] bg-[#111111] border border-[#252525] text-white px-3 py-2 font-['JetBrains_Mono'] text-[10px] outline-none focus:border-[#4A4A4A] transition-colors placeholder:text-[#333333]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!topic.trim()}
          className="flex items-center gap-1 px-3 py-2 border border-[#FF5500]/40 text-[#FF5500] hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.07)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-['JetBrains_Mono'] text-[9px] tracking-[1px] uppercase"
        >
          <Plus size={10} />
          Add
        </button>
      </div>
    </div>
  );
}
