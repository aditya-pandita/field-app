"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Mic, MessageSquare, Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/live", label: "Live", icon: Mic, isLive: true },
  { href: "/scenario", label: "Scenario", icon: MessageSquare },
  { href: "/adversary", label: "Adversary", icon: Shield, isAdversary: true },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-black border-t border-[#252525] z-50 safe-bottom">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isSpecial = item.isLive || item.isAdversary;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full flex-1 transition-colors duration-150 relative",
                isActive ? (isSpecial ? "text-[#EF4444]" : "text-[#FF5500]") : "text-[#4A4A4A]"
              )}
            >
              <item.icon size={20} />
              <span className="font-['JetBrains_Mono'] text-[8px] tracking-wider mt-1">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: isSpecial ? "#EF4444" : "#FF5500" }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
