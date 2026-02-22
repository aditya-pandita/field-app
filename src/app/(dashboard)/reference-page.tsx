"use client";

// src/app/(dashboard)/reference/page.tsx
// Reference hub: Conversation Flow + Scoring System

import { useState } from "react";
import { ConversationFlow } from "@/components/reference/ConversationFlow";
import { ScoringSystem } from "@/components/reference/ScoringSystem";

type Tab = "flow" | "scoring";

export default function ReferencePage() {
  const [active, setActive] = useState<Tab>("flow");

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest mb-3">
          FIELD REFERENCE
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold text-white mb-2">
          Reference
        </h1>
        <p className="text-[#666666] text-sm">
          The universal framework and scoring system used across all coach styles.
        </p>
      </div>

      <div className="h-px bg-[#252525] mb-8" />

      {/* Tabs */}
      <div className="flex border-b border-[#1A1A1A] mb-10">
        {(
          [
            { id: "flow",    label: "CONVERSATION FLOW" },
            { id: "scoring", label: "SCORING SYSTEM" },
          ] as { id: Tab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={[
              "px-5 py-3 font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase transition-colors",
              active === tab.id
                ? "text-[#FF5500] border-b-2 border-[#FF5500] -mb-px"
                : "text-[#444444] hover:text-[#888888]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === "flow"    && <ConversationFlow />}
      {active === "scoring" && <ScoringSystem />}
    </div>
  );
}
