"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <Icon className="w-8 h-8 text-[#333333] mb-4" />
      <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-[#666666] text-sm max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
