import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  eyebrow: string;
  title: string | React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="font-['JetBrains_Mono'] text-[10px] tracking-[4px] uppercase text-[#FF5500] mb-[10px]">
        {eyebrow}
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-['Syne'] text-[clamp(28px,5vw,52px)] font-bold text-white leading-[1.05] mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14px] text-[#888888]">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="h-[1px] bg-[#1A1A1A] mt-8" />
    </div>
  );
}
