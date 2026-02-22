import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../client";
import type { Session, NewSession } from "../types";

function toSession(id: string, data: any): Session {
  return {
    sessionId:       id,
    userId:          data.userId,
    sessionDate:     data.sessionDate?.toDate?.()  ?? new Date(),
    locationType:    data.locationType,
    locationName:    data.locationName   ?? "",
    weather:         data.weather,
    timeOfDay:       data.timeOfDay,
    moodBefore:      data.moodBefore,
    moodAfter:       data.moodAfter      ?? null,
    totalApproaches: data.totalApproaches ?? 0,
    notes:           data.notes          ?? "",
    isComplete:      data.isComplete     ?? false,
    createdAt:       data.createdAt?.toDate?.()    ?? new Date(),
    updatedAt:       data.updatedAt?.toDate?.()    ?? new Date(),
  };
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  if (!db) return [];
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    orderBy("sessionDate", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toSession(d.id, d.data()));
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "sessions", sessionId));
  if (!snap.exists()) return null;   // ← exists() is a FUNCTION, not a property
  return toSession(snap.id, snap.data());
}

export async function createSession(userId: string, data: NewSession): Promise<Session> {
  if (!db) throw new Error("Database not configured");

  const ref = await addDoc(collection(db, "sessions"), {
    ...data,
    userId,
    // Convert Date to Firestore Timestamp so it stores correctly
    sessionDate:     data.sessionDate instanceof Date
                       ? Timestamp.fromDate(data.sessionDate)
                       : data.sessionDate,
    moodAfter:       null,
    totalApproaches: 0,
    isComplete:      false,
    createdAt:       serverTimestamp(),
    updatedAt:       serverTimestamp(),
  });

  const created = await getDoc(ref);
  return toSession(ref.id, created.data());
}

export async function updateSession(
  sessionId: string,
  data: Partial<Session>
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "sessions", sessionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function completeSession(
  sessionId: string,
  moodAfter: string,
  notes: string
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "sessions", sessionId), {
    moodAfter,
    notes,
    isComplete:  true,
    updatedAt:   serverTimestamp(),
  });
}

export async function incrementApproachCount(sessionId: string): Promise<void> {
  if (!db) return;
  const snap = await getDoc(doc(db, "sessions", sessionId));
  if (!snap.exists()) return;   // ← exists() is a FUNCTION
  const current = snap.data()?.totalApproaches ?? 0;
  await updateDoc(doc(db, "sessions", sessionId), {
    totalApproaches: current + 1,
    updatedAt:       serverTimestamp(),
  });
}