"use client";

import { useState, useEffect } from "react";
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
  Grid2x2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ── Pinned tabs (always visible in the bottom bar) ────────────────────────────
const PINNED = [
  { href: "/dashboard",  label: "Home",      icon: LayoutDashboard, isLive: false, isAdversary: false },
  { href: "/live",       label: "Live",      icon: Mic,             isLive: true,  isAdversary: false },
  { href: "/approaches", label: "Approaches",icon: Target,          isLive: false, isAdversary: false },
  { href: "/program",    label: "Program",   icon: Trophy,          isLive: false, isAdversary: false },
  { href: "/pipeline",   label: "Pipeline",  icon: Kanban,          isLive: false, isAdversary: false },
];

// ── All tabs shown in the More sheet ─────────────────────────────────────────
const ALL_ITEMS = [
  { href: "/dashboard",  label: "HOME",       icon: LayoutDashboard },
  { href: "/journal",    label: "JOURNAL",    icon: BookOpen },
  { href: "/sessions",   label: "SESSIONS",   icon: CalendarDays },
  { href: "/approaches", label: "APPROACHES", icon: Target },
  { href: "/live",       label: "LIVE",       icon: Mic,        isLive: true },
  { href: "/analytics",  label: "ANALYTICS",  icon: BarChart2 },
  { href: "/program",    label: "PROGRAM",    icon: Trophy },
  { href: "/trainer",    label: "TRAINER",    icon: Zap },
  { href: "/scenario",   label: "SCENARIO",   icon: MessageSquare },
  { href: "/adversary",  label: "ADVERSARY",  icon: Shield,     isAdversary: true },
  { href: "/flashcards", label: "CARDS",      icon: Layers },
  { href: "/coaches",    label: "COACHES",    icon: Users },
  { href: "/reference",  label: "REFERENCE",  icon: BookMarked },
  { href: "/pipeline",   label: "PIPELINE",   icon: Kanban },
];

export default function MobileNav() {
  const pathname        = usePathname();
  const { signOut }     = useAuth();
  const [open, setOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const pinnedHrefs  = PINNED.map((p) => p.href);
  const isMoreActive = !pinnedHrefs.some(
    (h) => pathname === h || pathname.startsWith(`${h}/`)
  );

  return (
    <>
      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-black border-t border-[#252525] z-50">
        <div className="flex items-center justify-around h-full">
          {PINNED.map((item) => {
            const isActive  = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isSpecial = item.isLive || item.isAdversary;
            const color     = isActive ? (isSpecial ? "#EF4444" : "#FF5500") : "#4A4A4A";
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center h-full flex-1 transition-colors duration-150 relative"
                style={{ color }}
              >
                <item.icon size={20} />
                <span className="font-['JetBrains_Mono'] text-[8px] tracking-wider mt-1">
                  {item.label}
                </span>
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: color }}
                  />
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center h-full flex-1 transition-colors duration-150 relative",
              isMoreActive ? "text-[#FF5500]" : "text-[#4A4A4A]"
            )}
          >
            <Grid2x2 size={20} />
            <span className="font-['JetBrains_Mono'] text-[8px] tracking-wider mt-1">More</span>
            {isMoreActive && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF5500]" />
            )}
          </button>
        </div>
      </nav>

      {/* ── More sheet ──────────────────────────────────────────────────── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-black border-t border-[#252525] rounded-t-none">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 bg-[#333333] rounded-full" />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF5500]" />
                <span className="font-['Syne'] text-[14px] font-extrabold tracking-[4px] text-white">
                  FIELD
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#4A4A4A] hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav grid */}
            <div className="grid grid-cols-2 gap-px bg-[#111111] border-b border-[#1A1A1A]">
              {ALL_ITEMS.map((item) => {
                const isActive  = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const isSpecial = item.isLive || item.isAdversary;
                const color     = isActive ? (isSpecial ? "#EF4444" : "#FF5500") : "#666666";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 bg-black transition-colors",
                      isActive ? "bg-[#0D0D0D]" : "active:bg-[#111111]"
                    )}
                  >
                    <span style={{ color }}>
                      <item.icon size={15} />
                    </span>
                    <span
                      className="font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase"
                      style={{ color: isActive ? "white" : "#666666" }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <div
                        className="ml-auto w-1 h-1 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Sign out */}
            <div className="px-5 py-4">
              <button
                onClick={signOut}
                className="font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
