"use client";

import { ScenarioMessage } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ScenarioMessage;
  name?: string;
}

export function ChatMessage({ message, name = "AI" }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] px-4 py-2",
        isUser
          ? "bg-[#FF5500] text-white"
          : "bg-[#1A1A1A] border-l-2 border-[#FF5500] text-white"
      )}>
        <span className="text-[10px] font-[family-name:var(--font-jetbrains)] uppercase tracking-wider text-[#666666] mb-1 block">
          {isUser ? "You" : name}
        </span>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
