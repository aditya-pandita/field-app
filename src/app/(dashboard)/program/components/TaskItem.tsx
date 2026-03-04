"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TASK_TYPE_META } from "@/lib/programData";
import type { TaskDef } from "@/lib/programData";
import type { TaskData } from "@/lib/programUtils";

interface TaskItemProps {
  task:           TaskDef;
  taskData:       TaskData;
  dayLocked:      boolean;
  onToggle:       (taskId: string, val: boolean) => void;
  onLogApproach:  (task: TaskDef) => void;
}

export function TaskItem({ task, taskData, dayLocked, onToggle, onLogApproach }: TaskItemProps) {
  const meta       = TASK_TYPE_META[task.type];
  const isLogged   = !!taskData.approachId;
  const isChecked  = taskData.completed;
  const canLog     = meta.loggable && !dayLocked && !isLogged;

  return (
    <div className={cn(
      "flex items-center gap-3 py-2.5 border-b border-[#111111] last:border-0 transition-opacity",
      isChecked && !isLogged ? "opacity-50" : ""
    )}>
      {/* Checkbox */}
      <button
        type="button"
        disabled={dayLocked}
        onClick={() => !dayLocked && onToggle(task.id, !isChecked)}
        className={cn(
          "w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-all",
          dayLocked
            ? "border-[#1A1A1A] cursor-not-allowed"
            : isChecked
            ? "bg-white border-white"
            : "border-[#333333] hover:border-[#666666]"
        )}
      >
        {isChecked && <Check size={11} strokeWidth={3} className="text-black" />}
      </button>

      {/* Type tag */}
      <span
        className="font-['JetBrains_Mono'] text-[8px] tracking-[1.5px] uppercase px-1.5 py-0.5 border flex-shrink-0"
        style={{ color: meta.color, borderColor: `${meta.color}40` }}
      >
        {meta.tag}
      </span>

      {/* Label */}
      <span className={cn(
        "font-['JetBrains_Mono'] text-[11px] flex-1 transition-colors",
        isChecked ? "text-[#444444] line-through" : "text-[#888888]"
      )}>
        {task.label}
      </span>

      {/* Log button / logged badge */}
      {meta.loggable && (
        isLogged ? (
          <span className="font-['JetBrains_Mono'] text-[8px] tracking-[1px] uppercase text-[#22C55E] flex items-center gap-1">
            <Check size={9} strokeWidth={3} />
            Logged
          </span>
        ) : !dayLocked ? (
          <button
            type="button"
            onClick={() => onLogApproach(task)}
            className="font-['JetBrains_Mono'] text-[8px] tracking-[1px] uppercase text-[#FF5500] border border-[#FF5500]/30 px-2 py-1 hover:border-[#FF5500] hover:bg-[rgba(255,85,0,0.07)] transition-colors flex-shrink-0"
          >
            + LOG
          </button>
        ) : null
      )}
    </div>
  );
}
