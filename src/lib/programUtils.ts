import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase/client";
import { PROGRAM_TRACKS } from "./programData";
import type { TrackId, TrackDef } from "./programData";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TaskData {
  completed:   boolean;
  completedAt: Date | null;
  approachId:  string | null;
}

export interface DayData {
  completedAt: Date | null;
  tasks:       Record<string, TaskData>;
}

export interface TrackData {
  track:      TrackId;
  startedAt:  Date;
  status:     "active" | "completed";
  currentDay: number;
  days:       Record<string, DayData>;
}

export interface TrackStats {
  totalTasks:     number;
  completedTasks: number;
  daysCompleted:  number;
  pct:            number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function trackRef(userId: string, trackId: TrackId) {
  return doc(db!, "users", userId, "programs", trackId);
}

function buildBlankDays(trackDef: TrackDef): Record<string, DayData> {
  const days: Record<string, DayData> = {};
  for (const dayDef of trackDef.days) {
    const tasks: Record<string, TaskData> = {};
    for (const task of dayDef.tasks) {
      tasks[task.id] = { completed: false, completedAt: null, approachId: null };
    }
    days[String(dayDef.day)] = { completedAt: null, tasks };
  }
  return days;
}

function fromFirestore(data: any): TrackData {
  const days: Record<string, DayData> = {};
  for (const [dayKey, dayRaw] of Object.entries(data.days ?? {})) {
    const d = dayRaw as any;
    const tasks: Record<string, TaskData> = {};
    for (const [taskKey, taskRaw] of Object.entries(d.tasks ?? {})) {
      const t = taskRaw as any;
      tasks[taskKey] = {
        completed:   t.completed   ?? false,
        completedAt: t.completedAt instanceof Timestamp ? t.completedAt.toDate() : null,
        approachId:  t.approachId  ?? null,
      };
    }
    days[dayKey] = {
      completedAt: d.completedAt instanceof Timestamp ? d.completedAt.toDate() : null,
      tasks,
    };
  }
  return {
    track:      data.track,
    startedAt:  data.startedAt instanceof Timestamp ? data.startedAt.toDate() : new Date(),
    status:     data.status  ?? "active",
    currentDay: data.currentDay ?? 1,
    days,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Idempotent init — creates the doc with blank state if it doesn't exist.
 * Safe to call on every page mount.
 */
export async function initTrack(userId: string, trackId: TrackId): Promise<TrackData> {
  if (!db) throw new Error("Database not configured");
  const ref  = trackRef(userId, trackId);
  const snap = await getDoc(ref);
  if (snap.exists()) return fromFirestore(snap.data());

  const blankDays = buildBlankDays(PROGRAM_TRACKS[trackId]);
  const newDoc = {
    track:      trackId,
    startedAt:  serverTimestamp(),
    status:     "active",
    currentDay: 1,
    days:       blankDays,
  };
  await setDoc(ref, newDoc);

  // Re-read so Timestamps are resolved
  const created = await getDoc(ref);
  return fromFirestore(created.data());
}

/**
 * Simple read — returns null if doc doesn't exist.
 */
export async function getTrackData(userId: string, trackId: TrackId): Promise<TrackData | null> {
  if (!db) return null;
  const snap = await getDoc(trackRef(userId, trackId));
  if (!snap.exists()) return null;
  return fromFirestore(snap.data());
}

/**
 * Toggle a task on/off and optionally store the linked approachId.
 */
export async function toggleTask(
  userId:     string,
  trackId:    TrackId,
  dayNum:     number,
  taskId:     string,
  completed:  boolean,
  approachId: string | null = null
): Promise<void> {
  if (!db) return;
  await updateDoc(trackRef(userId, trackId), {
    [`days.${dayNum}.tasks.${taskId}.completed`]:   completed,
    [`days.${dayNum}.tasks.${taskId}.completedAt`]: completed ? serverTimestamp() : null,
    [`days.${dayNum}.tasks.${taskId}.approachId`]:  approachId,
  });
}

/**
 * Mark a day complete — writes completedAt, advances currentDay.
 * If it's the final day, sets status: 'completed'.
 */
export async function completeDay(
  userId:  string,
  trackId: TrackId,
  dayNum:  number
): Promise<void> {
  if (!db) return;
  const totalDays = PROGRAM_TRACKS[trackId].days.length;
  const isLast    = dayNum >= totalDays;

  await updateDoc(trackRef(userId, trackId), {
    [`days.${dayNum}.completedAt`]: serverTimestamp(),
    currentDay: isLast ? dayNum : dayNum + 1,
    ...(isLast ? { status: "completed" } : {}),
  });
}

/**
 * Overwrite the whole document with a fresh blank state.
 * Caller should show a confirm() dialog before calling.
 */
export async function resetTrack(userId: string, trackId: TrackId): Promise<TrackData> {
  if (!db) throw new Error("Database not configured");
  const blankDays = buildBlankDays(PROGRAM_TRACKS[trackId]);
  const fresh = {
    track:      trackId,
    startedAt:  serverTimestamp(),
    status:     "active",
    currentDay: 1,
    days:       blankDays,
  };
  await setDoc(trackRef(userId, trackId), fresh);
  const snap = await getDoc(trackRef(userId, trackId));
  return fromFirestore(snap.data());
}

/**
 * Pure stats computation — no async.
 */
export function computeTrackStats(trackData: TrackData, trackDef: TrackDef): TrackStats {
  let totalTasks     = 0;
  let completedTasks = 0;
  let daysCompleted  = 0;

  for (const dayDef of trackDef.days) {
    const dayData = trackData.days[String(dayDef.day)];
    if (dayData?.completedAt) daysCompleted++;

    for (const taskDef of dayDef.tasks) {
      totalTasks++;
      if (dayData?.tasks[taskDef.id]?.completed) completedTasks++;
    }
  }

  return {
    totalTasks,
    completedTasks,
    daysCompleted,
    pct: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
}
