import { cn } from "@/lib/utils/cn";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-5", className)}>
      <div className="flex-1 h-[1px] bg-[#1A1A1A]" />
      <span className="font-['JetBrains_Mono'] text-[9px] tracking-[3px] uppercase text-[#4A4A4A] whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-[1px] bg-[#1A1A1A]" />
    </div>
  );
}
