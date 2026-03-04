"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createJournalEntry } from "@/lib/firebase/queries/journalEntries";
import { getUserSessions } from "@/lib/firebase/queries/sessions";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Session, Approach, NewJournalEntry } from "@/lib/firebase/types";

const MOOD_OPTIONS = [
  { value: 1, label: "Very Low", emoji: "😔" },
  { value: 2, label: "Low", emoji: "😕" },
  { value: 3, label: "Neutral", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Great", emoji: "😄" },
];

export function NewJournalEntryForm() {
  const router = useRouter();
  const { userId } = useAuth();

  const [title, setTitle]             = useState("");
  const [content, setContent]         = useState("");
  const [mood, setMood]               = useState<number | null>(null);
  const [sessionId, setSessionId]     = useState<string>("");
  const [approachId, setApproachId]   = useState<string>("");
  const [tagInput, setTagInput]       = useState("");
  const [tags, setTags]               = useState<string[]>([]);
  const [saving, setSaving]           = useState(false);

  const [sessions, setSessions]       = useState<Session[]>([]);
  const [approaches, setApproaches]   = useState<Approach[]>([]);
  const [loadingApproaches, setLoadingApproaches] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getUserSessions(userId).then(setSessions).catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!sessionId || !db) {
      setApproaches([]);
      setApproachId("");
      return;
    }
    setLoadingApproaches(true);
    const q = query(
      collection(db, "approaches"),
      where("sessionId", "==", sessionId)
    );
    getDocs(q)
      .then((snap) => {
        const data = snap.docs.map((d) => ({
          ...d.data(),
          approachId: d.id,
          loggedAt:  d.data().loggedAt?.toDate?.()  ?? new Date(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        })) as Approach[];
        data.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
        setApproaches(data);
        setApproachId("");
      })
      .catch(console.error)
      .finally(() => setLoadingApproaches(false));
  }, [sessionId]);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const data: NewJournalEntry = {
        userId,
        title: title.trim(),
        content: content.trim(),
        mood,
        sessionId:  sessionId  || null,
        approachId: approachId || null,
        tags,
      };
      await createJournalEntry(userId, data);
      router.push("/journal");
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[640px] space-y-8">

      {/* Title */}
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this entry a title…"
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors font-[family-name:var(--font-syne)]"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
          Entry
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="What happened? What did you notice? What will you do differently?"
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors resize-none text-sm leading-relaxed"
          required
        />
      </div>

      {/* Mood */}
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
          Mood
        </label>
        <div className="flex gap-2">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? null : m.value)}
              title={m.label}
              className={`w-10 h-10 border flex items-center justify-center text-xl transition-all ${
                mood === m.value
                  ? "border-[#FF5500] bg-[#FF5500]/10"
                  : "border-[#252525] bg-[#1A1A1A] hover:border-[#333333]"
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Session picker */}
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
          Link to Session (optional)
        </label>
        <select
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
        >
          <option value="">— No session —</option>
          {sessions.map((s) => (
            <option key={s.sessionId} value={s.sessionId}>
              {new Date(s.sessionDate).toLocaleDateString()} · {s.locationName || s.locationType}
            </option>
          ))}
        </select>
      </div>

      {/* Approach picker — lazy loaded when session chosen */}
      {sessionId && (
        <div>
          <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
            Link to Approach (optional)
          </label>
          <select
            value={approachId}
            onChange={(e) => setApproachId(e.target.value)}
            disabled={loadingApproaches}
            className="w-full bg-[#111111] border border-[#252525] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors disabled:opacity-50"
          >
            <option value="">— No approach —</option>
            {approaches.map((a, i) => (
              <option key={a.approachId} value={a.approachId}>
                #{i + 1} · {a.openerType} · {a.outcome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag, press Enter"
            className="flex-1 bg-[#111111] border border-[#252525] text-white px-4 py-2 text-sm outline-none focus:border-[#4A4A4A] transition-colors"
          />
          <button
            type="button"
            onClick={addTag}
            className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest border border-[#252525] text-[#888888] px-3 py-2 hover:border-[#4A4A4A] hover:text-white transition-colors"
          >
            ADD
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase tracking-wider text-[#FF5500] border border-[#FF5500]/40 px-2 py-0.5 hover:bg-[#FF5500]/10 transition-colors"
              >
                {tag} ×
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-transparent border border-[#333333] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:border-[#4A4A4A] hover:text-white hover:bg-[#111111] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "SAVE ENTRY"}
        </button>
      </div>
    </form>
  );
}
