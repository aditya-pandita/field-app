"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { LogApproachModal } from "@/components/approach/LogApproachModal";

interface QuickActionsProps {
  userId: string;
}

export default function QuickActions({ userId }: QuickActionsProps) {
  const [logOpen, setLogOpen] = useState(false);

  const links = [
    { label: "New Session", href: "/sessions/new", icon: "▸" },
    { label: "Practice Scenario", href: "/scenario", icon: "◎" },
    { label: "Conversation Drill", href: "/trainer", icon: "⚡" },
    { label: "Review Flashcards", href: "/flashcards", icon: "◈" },
  ];

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Log Approach — opens modal */}
        <button
          onClick={() => setLogOpen(true)}
          className={cn(
            "w-full px-4 py-3.5 bg-transparent border font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-150 flex items-center gap-3",
            "border-[#7A2900] text-[#FF5500] bg-[rgba(255,85,0,0.07)]",
            "hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.12)]"
          )}
        >
          <span>+</span>
          <span className="flex-1 text-left">Log Today's Approach</span>
        </button>

        {/* Link-based actions */}
        {links.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="w-full px-4 py-3.5 bg-transparent border border-[#252525] text-[#888888] font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-150 flex items-center gap-3 hover:border-[#4A4A4A] hover:text-white hover:bg-[#111111]"
          >
            <span>{action.icon}</span>
            <span className="flex-1">{action.label}</span>
          </Link>
        ))}
      </div>

      <LogApproachModal
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
        userId={userId}
      />
    </>
  );
}
