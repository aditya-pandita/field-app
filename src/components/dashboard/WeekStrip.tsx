"use client";

import { cn } from "@/lib/utils/cn";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const data = [
  { count: 1, height: "20%" },
  { count: 3, height: "60%" },
  { count: 2, height: "40%" },
  { count: 4, height: "80%" },
  { count: 2, height: "40%" },
  { count: 5, height: "100%" },
  { count: 1, height: "20%" },
];

export default function WeekStrip() {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      {days.map((day, i) => (
        <div key={day} className={cn("flex flex-col items-center gap-[6px]", i === todayIndex && "today")}>
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] tracking-[1px]">
            {day}
          </div>
          <div
            className={cn(
              "w-full h-14 bg-[#1A1A1A] border border-[#252525] flex items-end overflow-hidden cursor-pointer transition-colors duration-150",
              "hover:border-[#333333]",
              i === todayIndex && "today"
            )}
            style={{ height: "56px" }}
          >
            <div
              className={cn(
                "w-full transition-colors duration-150",
                i === todayIndex ? "bg-[#FF5500]" : "bg-[#333333]",
                i === todayIndex ? "hover:bg-[#E64D00]" : "hover:bg-[#4A4A4A]"
              )}
              style={{ height: data[i].height }}
            />
          </div>
          <div
            className={cn(
              "font-['JetBrains_Mono'] text-[10px]",
              i === todayIndex ? "text-[#FF5500]" : "text-[#666666]"
            )}
          >
            {data[i].count}
          </div>
        </div>
      ))}
    </div>
  );
}
