"use client";

import { cn } from "@/lib/utils";

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const TAGS = [
  "strong-open", "awkward-start", "she-smiled", "she-hooked",
  "lost-frame", "great-vibe", "number-close", "instant-date",
  "rejected", "went-blank", "good-recovery", "cold-read",
  "compliment", "question", "joke"
];

export function TagSelector({ value, onChange }: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888]">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={cn(
              "px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] uppercase tracking-wider border transition-all",
              value.includes(tag)
                ? "border-[#FF5500] bg-[#FF5500]/10 text-white"
                : "border-[#252525] text-[#666666] hover:border-[#333333]"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
