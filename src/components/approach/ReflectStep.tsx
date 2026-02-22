"use client";

interface ReflectStepProps {
  whatWentWell: string;
  whatToImprove: string;
  notableMoment: string;
  onWhatWentWellChange: (value: string) => void;
  onWhatToImproveChange: (value: string) => void;
  onNotableMomentChange: (value: string) => void;
}

export function ReflectStep({
  whatWentWell,
  whatToImprove,
  notableMoment,
  onWhatWentWellChange,
  onWhatToImproveChange,
  onNotableMomentChange,
}: ReflectStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          What Went Well
        </label>
        <textarea
          value={whatWentWell}
          onChange={(e) => onWhatWentWellChange(e.target.value)}
          rows={3}
          placeholder="What did you do well in this approach?"
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500] resize-none"
        />
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          What To Improve
        </label>
        <textarea
          value={whatToImprove}
          onChange={(e) => onWhatToImproveChange(e.target.value)}
          rows={3}
          placeholder="What would you do differently?"
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500] resize-none"
        />
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Notable Moment
        </label>
        <input
          type="text"
          value={notableMoment}
          onChange={(e) => onNotableMomentChange(e.target.value)}
          placeholder="Any specific moment worth remembering?"
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500]"
        />
      </div>
    </div>
  );
}
