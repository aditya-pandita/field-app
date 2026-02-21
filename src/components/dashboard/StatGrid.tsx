import { cn } from "@/lib/utils/cn";

interface StatGridProps {
  children: React.ReactNode;
}

export default function StatGrid({ children }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[1px] bg-[#252525] mb-[1px]">
      {children}
    </div>
  );
}
