import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../client";
import type { ApproachRecording, NewRecording } from "../types";

function toRecording(id: string, data: any): ApproachRecording {
  return {
    recordingId:  id,
    userId:       data.userId,
    sessionId:    data.sessionId    ?? null,
    approachId:   data.approachId   ?? null,   // ← new field for linking
    recordedAt:   data.recordedAt?.toDate?.()  ?? new Date(),
    durationSecs: data.durationSecs ?? 0,
    transcript:   data.transcript   ?? "",
    notes:        data.notes        ?? "",
    tags:         data.tags         ?? [],
    isReviewed:   data.isReviewed   ?? false,
    createdAt:    data.createdAt?.toDate?.()   ?? new Date(),
  };
}

export async function saveRecording(
  userId: string,
  data: NewRecording
): Promise<ApproachRecording> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "approachRecordings"), {
    ...data,
    userId,
    approachId: null,
    createdAt:  serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return toRecording(ref.id, snap.data());
}

export async function getUserRecordings(
  userId: string,
  limitCount = 50
): Promise<ApproachRecording[]> {
  if (!db) return [];
  const q = query(
    collection(db, "approachRecordings"),
    where("userId", "==", userId),
    orderBy("recordedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.slice(0, limitCount).map((d) => toRecording(d.id, d.data()));
}

export async function getSessionRecordings(sessionId: string): Promise<ApproachRecording[]> {
  if (!db) return [];
  const q = query(
    collection(db, "approachRecordings"),
    where("sessionId", "==", sessionId),
    orderBy("recordedAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toRecording(d.id, d.data()));
}

export async function updateRecording(
  recordingId: string,
  data: Partial<ApproachRecording>
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "approachRecordings", recordingId), data);
}

/** Link a recording to a specific approach */
export async function linkRecordingToApproach(
  recordingId: string,
  approachId:  string
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "approachRecordings", recordingId), { approachId });
}

/** Unlink a recording from its approach */
export async function unlinkRecording(recordingId: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "approachRecordings", recordingId), { approachId: null });
}

export async function deleteRecording(recordingId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "approachRecordings", recordingId));
}