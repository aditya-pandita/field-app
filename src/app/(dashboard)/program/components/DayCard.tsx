"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TaskItem } from "./TaskItem";
import type { DayDef, TrackId } from "@/lib/programData";
import type { DayData } from "@/lib/programUtils";
import type { TaskDef } from "@/lib/programData";

interface DayCardProps {
  trackId:       TrackId;
  dayDef:        DayDef;
  dayData:       DayData | undefined;
  isActive:      boolean;
  isLocked:      boolean;
  isCompleted:   boolean;
  completing:    boolean;
  accentColor:   string;
  onToggleTask:  (dayNum: number, taskId: string, val: boolean) => void;
  onCompleteDay: (dayNum: number) => void;
  onLogApproach: (dayNum: number, task: TaskDef) => void;
}

export function DayCard({
  trackId,
  dayDef,
  dayData,
  isActive,
  isLocked,
  isCompleted,
  completing,
  accentColor,
  onToggleTask,
  onCompleteDay,
  onLogApproach,
}: DayCardProps) {
  const [open, setOpen] = useState(isActive);

  const tasks       = dayDef.tasks;
  const totalTasks  = tasks.length;
  const doneTasks   = tasks.filter((t) => dayData?.tasks[t.id]?.completed).length;
  const allDone     = doneTasks === totalTasks;
  const pct         = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  return (
    <div className={cn(
      "border transition-all duration-200",
      isCompleted ? "border-[#1A1A1A] opacity-60" : isLocked ? "border-[#1A1A1A]" : "border-[#252525]"
    )}>
      {/* Header — always visible */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => !isLocked && setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          isLocked ? "cursor-not-allowed" : "hover:bg-[#0A0A0A]"
        )}
      >
        {/* Status icon */}
        <div className="flex-shrink-0 w-5 flex items-center justify-center">
          {isLocked ? (
            <Lock size={13} className="text-[#333333]" />
          ) : isCompleted ? (
            <CheckCircle2 size={13} className="text-[#22C55E]" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          )}
        </div>

        {/* Day label */}
        <span className={cn(
          "font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase w-10 flex-shrink-0",
          isLocked ? "text-[#333333]" : isCompleted ? "text-[#444444]" : "text-[#666666]"
        )}>
          DAY {dayDef.day}
        </span>

        {/* Title */}
        <span className={cn(
          "font-['Syne'] text-sm font-bold flex-1",
          isLocked ? "text-[#333333]" : isCompleted ? "text-[#666666]" : "text-white"
        )}>
          {dayDef.title}
        </span>

        {/* Task count when collapsed */}
        {!open && !isLocked && (
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] mr-1">
            {doneTasks}/{totalTasks}
          </span>
        )}

        {/* Chevron */}
        {!isLocked && (
          <div className="flex-shrink-0 text-[#4A4A4A]">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        )}
      </button>

      {/* Progress bar (active day only) */}
      {isActive && (
        <div className="h-[2px] bg-[#1A1A1A]">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: accentColor }}
          />
        </div>
      )}

      {/* Expanded content */}
      {open && !isLocked && (
        <div className="px-4 pb-4">
          {/* Description */}
          <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] leading-relaxed mt-3 mb-4">
            {dayDef.description}
          </p>

          {/* Task list */}
          <div className="mb-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                taskData={dayData?.tasks[task.id] ?? { completed: false, completedAt: null, approachId: null }}
                dayLocked={isLocked || isCompleted}
                onToggle={(taskId, val) => onToggleTask(dayDef.day, taskId, val)}
                onLogApproach={(t) => onLogApproach(dayDef.day, t)}
              />
            ))}
          </div>

          {/* Complete Day / status */}
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#22C55E]" />
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#22C55E] uppercase tracking-[2px]">
                Completed
              </span>
            </div>
          ) : (
            <button
              type="button"
              disabled={!allDone || completing}
              onClick={() => onCompleteDay(dayDef.day)}
              className={cn(
                "w-full py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase border transition-all",
                allDone && !completing
                  ? "text-white border-transparent"
                  : "text-[#333333] border-[#1A1A1A] cursor-not-allowed"
              )}
              style={allDone && !completing ? { backgroundColor: accentColor } : {}}
            >
              {completing
                ? "Saving..."
                : allDone
                ? "✓ Complete Day"
                : `${totalTasks - doneTasks} task${totalTasks - doneTasks !== 1 ? "s" : ""} remaining`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
