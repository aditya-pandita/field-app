"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full bg-[#111111] border border-[#252525] shadow-2xl",
          sizeClasses[size],
          "mx-4 max-h-[90dvh] overflow-hidden",
          "md:mx-0 md:rounded-none"
        )}
      >
        <div className="md:hidden absolute top-3 left-1/2 -translate-x-1/2">
          <div className="w-9 h-1 bg-[#333333] rounded-full" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#252525]">
            <h2 className="font-[family-name:var(--font-syne)] text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 text-[#666666] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(90dvh-80px)]">{children}</div>
      </div>
    </div>
  );
}
