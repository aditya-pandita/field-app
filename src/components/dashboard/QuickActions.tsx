"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function QuickActions() {
  const actions = [
    { label: "Log Today's Approach", href: "/journal/new", primary: true, icon: "+" },
    { label: "Practice Scenario", href: "/scenario", icon: "◎" },
    { label: "Conversation Drill", href: "/trainer", icon: "⚡" },
    { label: "Review Flashcards", href: "/flashcards", subtitle: "3 due", icon: "◈" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {actions.map((action, index) => (
        <Link
          key={action.label}
          href={action.href}
          className={cn(
            "w-full px-4 py-3.5 bg-transparent border border-[#252525] text-[#888888] font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-150 flex items-center gap-3",
            "hover:border-[#4A4A4A] hover:text-white hover:bg-[#111111]",
            action.primary && "border-[#7A2900] text-[#FF5500] bg-[rgba(255,85,0,0.07)]",
            action.primary && "hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.12)]"
          )}
        >
          <span>{action.icon}</span>
          <span className="flex-1">{action.label}</span>
          {action.subtitle && (
            <span className="text-[9px] text-[#666666]">{action.subtitle}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
