"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, MessageSquare, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/scenario", label: "Scenario", icon: MessageSquare },
  { href: "/adversary", label: "Adversary", icon: Shield },
  { href: "/trainer", label: "Trainer", icon: Zap },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-black border-t border-[#252525] z-50 safe-bottom">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full flex-1 transition-colors duration-150",
                isActive ? "text-[#FF5500]" : "text-[#4A4A4A]"
              )}
            >
              <item.icon size={20} />
              <span className="font-['JetBrains_Mono'] text-[8px] tracking-wider mt-1">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF5500]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
