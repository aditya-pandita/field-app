"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import {
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/lib/firebase/queries/journalEntries";
import type { JournalEntry } from "@/lib/firebase/types";

const MOOD_ICONS: Record<number, string> = { 1: "😔", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };
const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Very Low" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export default function JournalEntryDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const entryId = params.entryId as string;

  const [entry, setEntry]     = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]           = useState(false);

  // Edit state
  const [editTitle, setEditTitle]     = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood]       = useState<number | null>(null);
  const [editTagInput, setEditTagInput] = useState("");
  const [editTags, setEditTags]       = useState<string[]>([]);

  useEffect(() => {
    if (!entryId) return;
    getJournalEntryById(entryId)
      .then((data) => {
        setEntry(data);
        if (data) {
          setEditTitle(data.title);
          setEditContent(data.content);
          setEditMood(data.mood);
          setEditTags(data.tags);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [entryId]);

  const handleSave = async () => {
    if (!entry) return;
    setSaving(true);
    try {
      await updateJournalEntry(entry.entryId, {
        title:   editTitle.trim(),
        content: editContent.trim(),
        mood:    editMood,
        tags:    editTags,
      });
      setEntry((prev) =>
        prev
          ? { ...prev, title: editTitle.trim(), content: editContent.trim(), mood: editMood, tags: editTags, updatedAt: new Date() }
          : prev
      );
      setEditing(false);
    } catch (err) {
      console.error("Failed to update entry:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    setDeleting(true);
    try {
      await deleteJournalEntry(entry.entryId);
      router.push("/journal");
    } catch (err) {
      console.error("Failed to delete entry:", err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const addTag = () => {
    const trimmed = editTagInput.trim().toLowerCase();
    if (trimmed && !editTags.includes(trimmed)) setEditTags((p) => [...p, trimmed]);
    setEditTagInput("");
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#666666] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (!entry || !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="font-[family-name:var(--font-syne)] text-xl text-white mb-4">Entry not found</p>
        <button
          onClick={() => router.push("/journal")}
          className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-widest uppercase px-7 py-3 hover:bg-[#E64D00] transition-colors"
        >
          BACK TO JOURNAL
        </button>
      </div>
    );
  }

  const date = entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt);

  return (
    <div className="max-w-[720px]">
      {/* Back nav */}
      <button
        onClick={() => router.push("/journal")}
        className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#555555] uppercase tracking-widest hover:text-[#FF5500] transition-colors mb-8 flex items-center gap-1"
      >
        ← JOURNAL
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#444444] uppercase tracking-widest mb-2">
          {format(date, "EEEE, MMMM d, yyyy")}
        </p>
        {editing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full bg-transparent border-b border-[#333333] text-white font-[family-name:var(--font-syne)] text-3xl font-bold pb-2 outline-none focus:border-[#FF5500] transition-colors"
          />
        ) : (
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white">
            {entry.title || <span className="text-[#444444] italic">Untitled</span>}
          </h1>
        )}

        {/* Mood display */}
        {!editing && entry.mood !== null && (
          <span className="text-2xl mt-2 block">{MOOD_ICONS[entry.mood]}</span>
        )}
      </div>

      <div className="h-px bg-[#1A1A1A] mb-8" />

      {/* Content */}
      {editing ? (
        <div className="space-y-6">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={10}
            className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors resize-none text-sm leading-relaxed"
            required
          />

          {/* Mood editor */}
          <div>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
              Mood
            </label>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setEditMood(editMood === m.value ? null : m.value)}
                  title={m.label}
                  className={`w-10 h-10 border flex items-center justify-center text-xl transition-all ${
                    editMood === m.value
                      ? "border-[#FF5500] bg-[#FF5500]/10"
                      : "border-[#252525] bg-[#1A1A1A] hover:border-[#333333]"
                  }`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Tags editor */}
          <div>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#666666] mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag, press Enter"
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
            {editTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {editTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setEditTags((p) => p.filter((t) => t !== tag))}
                    className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase tracking-wider text-[#FF5500] border border-[#FF5500]/40 px-2 py-0.5 hover:bg-[#FF5500]/10 transition-colors"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setEditing(false); setEditTitle(entry.title); setEditContent(entry.content); setEditMood(entry.mood); setEditTags(entry.tags); }}
              className="border border-[#333333] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest px-5 py-2 hover:text-white hover:border-[#4A4A4A] transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editContent.trim()}
              className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest px-5 py-2 hover:bg-[#E64D00] disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "SAVE"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Read view */}
          <div className="text-[#CCCCCC] text-sm leading-relaxed whitespace-pre-wrap mb-8">
            {entry.content || <span className="text-[#444444] italic">No content.</span>}
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-8">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-[family-name:var(--font-jetbrains)] text-[8px] uppercase tracking-wider text-[#444444] border border-[#252525] px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Updated timestamp */}
          <p className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#333333] uppercase tracking-widest mb-8">
            Updated {format(entry.updatedAt instanceof Date ? entry.updatedAt : new Date(entry.updatedAt), "MMM d, yyyy · HH:mm")}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest border border-[#252525] text-[#888888] px-5 py-2 hover:border-[#4A4A4A] hover:text-white transition-colors"
            >
              ✎ EDIT
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-widest border border-[#252525] text-[#444444] px-5 py-2 hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
              >
                DELETE
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-jetbrains)] text-[9px] text-[#EF4444] uppercase">
                  Delete this entry?
                </span>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase border border-[#333333] text-[#888888] px-3 py-1 hover:text-white transition-colors"
                >
                  NO
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase bg-[#EF4444] text-white px-3 py-1 hover:bg-[#DC2626] disabled:opacity-50 transition-colors"
                >
                  {deleting ? "..." : "YES"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
