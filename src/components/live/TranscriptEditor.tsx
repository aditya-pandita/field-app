"use client";

interface TranscriptEditorProps {
  transcript: string;
  notes: string;
  tags: string[];
  durationSecs: number;
  onTranscriptChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onSave: () => void;
  onDiscard: () => void;
  canSave?: boolean;
}

const TAGS = [
  "strong-open", "awkward-start", "she-hooked", "lost-frame",
  "great-vibe", "number-close", "instant-date", "declined",
  "went-blank", "good-recovery"
];

export function TranscriptEditor({
  transcript,
  notes,
  tags,
  durationSecs,
  onTranscriptChange,
  onNotesChange,
  onToggleTag,
  onSave,
  onDiscard,
  canSave,
}: TranscriptEditorProps) {
  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#FF5500]">
          Transcript
        </span>
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#666666]">
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      <textarea
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        rows={8}
        placeholder="Groq Whisper is accurate but not perfect — fix any errors."
        className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500] resize-none font-[family-name:var(--font-dm-sans)]"
      />

      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={3}
        placeholder="Any notes about this approach..."
        className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500] resize-none"
      />

      <div>
        <span className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`px-3 py-1.5 text-xs font-[family-name:var(--font-jetbrains)] uppercase tracking-wider border transition-all ${
                tags.includes(tag)
                  ? "border-[#FF5500] bg-[#FF5500]/10 text-white"
                  : "border-[#252525] text-[#666666] hover:border-[#333333]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex-1 bg-[#FF5500] text-white py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors disabled:opacity-50"
        >
          Save to Firestore
        </button>
        <button
          onClick={onDiscard}
          className="flex-1 border border-[#252525] text-[#888888] py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:border-[#333333] hover:text-white transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
