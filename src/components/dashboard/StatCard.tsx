import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  value: string | number;
  label: string;
  highlight?: boolean;
  trend?: string;
  unit?: string;
}

export default function StatCard({ value, label, highlight, trend, unit }: StatCardProps) {
  return (
    <div className="bg-[#111111] p-[28px_24px] relative overflow-hidden hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-[#FF5500] hover:after:scale-x-100 hover:after:transition-transform hover:after:duration-300 hover:after:origin-left">
      <div
        className={cn(
          "font-['Syne'] text-[48px] font-bold leading-none mb-2",
          highlight ? "text-[#FF5500]" : "text-white"
        )}
      >
        {value}
        {unit && <span className="text-[20px] text-[#666666]">{unit}</span>}
      </div>
      <div className="font-['JetBrains_Mono'] text-[9px] tracking-[3px] uppercase text-[#666666]">
        {label}
      </div>
      {trend && (
        <div className="text-[11px] text-[#22C55E] mt-[6px]">{trend}</div>
      )}
    </div>
  );
}
