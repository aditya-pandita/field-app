"use client";

import { AdversaryMessage } from "./AdversaryMessage";
import { ChatInput } from "../scenario/ChatInput";
import type { ScenarioMessage } from "@/lib/firebase/types";

interface AdversaryChatProps {
  messages: ScenarioMessage[];
  loading: boolean;
  onSend: (message: string) => void;
  onEnd: () => void;
}

export function AdversaryChat({ messages, loading, onSend, onEnd }: AdversaryChatProps) {
  return (
    <div className="flex flex-col h-[calc(100dvh-200px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <AdversaryMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] border-l-2 border-[#EF4444] px-4 py-2">
              <p className="text-sm text-[#666666] animate-pulse">Resisting...</p>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput onSend={onSend} disabled={loading} />
      
      <button
        onClick={onEnd}
        className="w-full border border-[#252525] text-[#666666] py-2 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
      >
        End Session
      </button>
    </div>
  );
}
