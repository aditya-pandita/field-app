"use client";

interface TrainerSummaryProps {
  totalPivots: number;
  smoothCount: number;
  awkwardCount: number;
  blankCount: number;
  smoothPct: number;
  onDone: () => void;
  onRetry: () => void;
}

export function TrainerSummary({
  totalPivots,
  smoothCount,
  awkwardCount,
  blankCount,
  smoothPct,
  onDone,
  onRetry,
}: TrainerSummaryProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-syne)] text-2xl mb-2">Session Complete</h2>
        <p className="text-[#666666]">{totalPivots} pivots completed</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-[#111111] border border-[#252525]">
          <span className="block text-[#22C55E] font-[family-name:var(--font-syne)] text-2xl">{smoothCount}</span>
          <span className="text-xs text-[#666666] uppercase">Smooth</span>
        </div>
        <div className="p-4 bg-[#111111] border border-[#252525]">
          <span className="block text-[#EAB308] font-[family-name:var(--font-syne)] text-2xl">{awkwardCount}</span>
          <span className="text-xs text-[#666666] uppercase">Awkward</span>
        </div>
        <div className="p-4 bg-[#111111] border border-[#252525]">
          <span className="block text-[#EF4444] font-[family-name:var(--font-syne)] text-2xl">{blankCount}</span>
          <span className="text-xs text-[#666666] uppercase">Blank</span>
        </div>
      </div>

      <div className="p-4 bg-[#111111] border border-[#252525]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#666666]">Smooth Rate</span>
          <span className="text-[#FF5500]">{smoothPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-[#252525]">
          <div
            className="h-full bg-[#22C55E] transition-all"
            style={{ width: `${smoothPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onDone}
          className="w-full border border-[#252525] text-[#888888] py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:border-[#333333] hover:text-white transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
