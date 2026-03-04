"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { PushPullTopics } from "./PushPullTopics";
import type { Lead, NewLead, LeadStage, PushPullTopic } from "@/lib/firebase/types";

interface LeadProfileFormProps {
  initialData?: Partial<Lead>;
  defaultApproachId?: string | null;
  defaultSessionId?: string | null;
  onSave: (data: NewLead) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const STAGES: { value: LeadStage; label: string }[] = [
  { value: "lead",     label: "Lead"     },
  { value: "texting",  label: "Texting"  },
  { value: "date_set", label: "Date Set" },
  { value: "dating",   label: "Dating"   },
  { value: "intimate", label: "Intimate" },
  { value: "dead",     label: "Dead"     },
];

const LABEL_CLASS =
  "block font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2";
const INPUT_CLASS =
  "w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors font-['JetBrains_Mono'] text-[12px] placeholder:text-[#333333]";
const TEXTAREA_CLASS =
  "w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors resize-none font-['JetBrains_Mono'] text-[12px] placeholder:text-[#333333]";

export function LeadProfileForm({
  initialData,
  defaultApproachId,
  defaultSessionId,
  onSave,
  onCancel,
  loading = false,
}: LeadProfileFormProps) {
  const [stage, setStage] = useState<LeadStage>(initialData?.stage ?? "lead");
  const [name, setName] = useState(initialData?.name ?? "");
  const [appearanceNotes, setAppearanceNotes] = useState(initialData?.appearanceNotes ?? "");
  const [vibeNotes, setVibeNotes] = useState(initialData?.vibeNotes ?? "");
  const [generalNotes, setGeneralNotes] = useState(initialData?.generalNotes ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [instagram, setInstagram] = useState(initialData?.instagram ?? "");
  const [snapchat, setSnapchat] = useState(initialData?.snapchat ?? "");
  const [pushPullTopics, setPushPullTopics] = useState<PushPullTopic[]>(
    initialData?.pushPullTopics ?? []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: NewLead = {
      userId:           initialData?.userId ?? "",
      stage,
      name:             name.trim(),
      photoUrl:         initialData?.photoUrl ?? null,
      appearanceNotes:  appearanceNotes.trim(),
      vibeNotes:        vibeNotes.trim(),
      generalNotes:     generalNotes.trim(),
      phone:            phone.trim() || null,
      instagram:        instagram.trim() || null,
      snapchat:         snapchat.trim() || null,
      sourceApproachId: initialData?.sourceApproachId ?? defaultApproachId ?? null,
      sourceSessionId:  initialData?.sourceSessionId ?? defaultSessionId ?? null,
      pushPullTopics,
    };

    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[640px] space-y-8">
      {/* Stage */}
      <div>
        <label className={LABEL_CLASS}>Stage</label>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStage(s.value)}
              className={cn(
                "px-4 py-2 border font-['JetBrains_Mono'] text-[10px] tracking-[2px] uppercase transition-colors",
                stage === s.value
                  ? "border-[#FF5500] text-[#FF5500] bg-[rgba(255,85,0,0.07)]"
                  : "border-[#252525] text-[#666666] hover:border-[#4A4A4A]"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className={LABEL_CLASS}>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Her name or nickname"
          required
          className={INPUT_CLASS}
        />
      </div>

      {/* Profile notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={LABEL_CLASS}>Appearance Notes</label>
          <textarea
            value={appearanceNotes}
            onChange={(e) => setAppearanceNotes(e.target.value)}
            rows={3}
            placeholder="Height, hair, style..."
            className={TEXTAREA_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Vibe / Personality</label>
          <textarea
            value={vibeNotes}
            onChange={(e) => setVibeNotes(e.target.value)}
            rows={3}
            placeholder="Energy, personality type..."
            className={TEXTAREA_CLASS}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>General Notes</label>
        <textarea
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          rows={3}
          placeholder="Anything else worth remembering..."
          className={TEXTAREA_CLASS}
        />
      </div>

      {/* Contact */}
      <div>
        <label className={LABEL_CLASS}>Contact</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555..."
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1.5">
              Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@handle"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block font-['JetBrains_Mono'] text-[9px] tracking-[2px] uppercase text-[#4A4A4A] mb-1.5">
              Snapchat
            </label>
            <input
              type="text"
              value={snapchat}
              onChange={(e) => setSnapchat(e.target.value)}
              placeholder="username"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Push/Pull Topics */}
      <div>
        <label className={LABEL_CLASS}>Push / Pull Topics</label>
        <p className="font-['JetBrains_Mono'] text-[9px] text-[#4A4A4A] tracking-[1px] mb-3">
          Tag conversation threads as push (tension), pull (investment), or neutral
        </p>
        <PushPullTopics topics={pushPullTopics} onChange={setPushPullTopics} />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent border border-[#333333] text-[#888888] font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:border-[#4A4A4A] hover:text-white hover:bg-[#111111] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : "Save Lead"}
        </button>
      </div>
    </form>
  );
}
