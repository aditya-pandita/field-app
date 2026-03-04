"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  Mic,
  BarChart2,
  Zap,
  MessageSquare,
  Shield,
  Layers,
  Users,
  BookMarked,
  Target,
  CalendarDays,
  Kanban,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "HOME", icon: LayoutDashboard, num: "01" },
  { href: "/journal", label: "JOURNAL", icon: BookOpen, num: "02" },
  { href: '/sessions', label: 'SESSIONS', icon: CalendarDays, num: '03' },
  { href: '/approaches', label: 'APPROACHES', icon: Target, num: '04' },
  { href: "/live", label: "LIVE", icon: Mic, num: "05", isLive: true },
  { href: "/analytics", label: "ANALYTICS", icon: BarChart2, num: "06" },
  { href: "/program", label: "PROGRAM", icon: Trophy, num: "07" },
  { href: "/trainer", label: "TRAINER", icon: Zap, num: "08" },
  { href: "/scenario", label: "SCENARIO", icon: MessageSquare, num: "09" },
  { href: "/adversary", label: "ADVERSARY", icon: Shield, num: "10", isAdversary: true },
  { href: "/flashcards", label: "CARDS", icon: Layers, num: "11" },
  { href: "/coaches", label: "COACHES", icon: Users, num: "12" },
  { href: '/reference', label: 'REFERENCE', icon: BookMarked, num: '13' },
  { href: '/pipeline',  label: 'PIPELINE',  icon: Kanban,     num: '14' },
];

interface SidebarProps {
  userId: string;
  displayName: string;
}

export default function Sidebar({ userId, displayName }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-black border-r border-[#252525] h-screen fixed left-0 top-0 z-40">
      <div className="flex items-center gap-[10px] px-5 py-7 border-b border-[#1A1A1A] mb-4">
        <div className="w-[10px] h-[10px] bg-[#FF5500] flex-shrink-0" />
        <span className="font-['Syne'] text-[16px] font-extrabold tracking-[4px] text-white">
          FIELD
        </span>
      </div>

      <nav className="flex flex-col flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-[11px] cursor-pointer transition-all duration-150 border-l-[3px] border-transparent text-decoration-none",
                "hover:bg-[#111111]",
                isActive && (item.isAdversary || item.isLive)
                  ? "border-l-[#EF4444] bg-[#111111]"
                  : isActive
                  ? "border-l-[#FF5500] bg-[#111111]"
                  : ""
              )}
            >
              <span
                className={cn(
                  "text-[18px] w-[18px] flex items-center justify-center transition-colors duration-150",
                  isActive && (item.isAdversary || item.isLive)
                    ? "text-[#EF4444]"
                    : isActive
                    ? "text-[#FF5500]"
                    : "text-[#4A4A4A]"
                )}
              >
                <item.icon size={16} />
              </span>
              <span
                className={cn(
                  "font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase flex-1 transition-colors duration-150",
                  isActive ? "text-white" : "text-[#666666]"
                )}
              >
                {item.label}
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#252525] tracking-[1px]">
                {item.num}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#1A1A1A]">
        <div className="text-[12px] text-[#666666] mb-2 truncate overflow-hidden whitespace-nowrap">
          {displayName || "User"}
        </div>
        <button
          onClick={signOut}
          className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
