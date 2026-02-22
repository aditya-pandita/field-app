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

export async function saveRecording(
  userId: string,
  data: NewRecording
): Promise<ApproachRecording> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "approachRecordings"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return {
    recordingId: ref.id,
    ...snap.data(),
    recordedAt: snap.data()?.recordedAt?.toDate?.() ?? new Date(),
    createdAt: snap.data()?.createdAt?.toDate?.() ?? new Date(),
  } as ApproachRecording;
}

export async function getUserRecordings(
  userId: string,
  limit = 50
): Promise<ApproachRecording[]> {
  if (!db) return [];
  const q = query(
    collection(db, "approachRecordings"),
    where("userId", "==", userId),
    orderBy("recordedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => ({
    recordingId: d.id,
    ...d.data(),
    recordedAt: d.data().recordedAt?.toDate?.() ?? new Date(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as ApproachRecording[];
}

export async function getSessionRecordings(sessionId: string): Promise<ApproachRecording[]> {
  if (!db) return [];
  const q = query(
    collection(db, "approachRecordings"),
    where("sessionId", "==", sessionId),
    orderBy("recordedAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    recordingId: d.id,
    ...d.data(),
    recordedAt: d.data().recordedAt?.toDate?.() ?? new Date(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as ApproachRecording[];
}

export async function updateRecording(
  recordingId: string,
  data: Partial<ApproachRecording>
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "approachRecordings", recordingId), data);
}

export async function deleteRecording(recordingId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "approachRecordings", recordingId));
}
