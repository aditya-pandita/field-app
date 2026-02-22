"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <AlertCircle className="w-8 h-8 text-[#FF5500] mb-4" />
      <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold mb-2">{title}</h3>
      {message && (
        <p className="text-[#666666] text-sm max-w-sm mb-6">{message}</p>
      )}
      {action}
    </div>
  );
}
