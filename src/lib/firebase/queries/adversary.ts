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
} from "firebase/firestore";
import { db } from "../client";
import type { AdversarySession, AdversaryDebrief, AdversaryArchetype, AdversaryIntensity } from "../types";

export async function createAdversarySession(
  userId: string,
  archetype: AdversaryArchetype,
  intensity: AdversaryIntensity
): Promise<string> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "adversarySessions"), {
    userId,
    archetype,
    intensity,
    startedAt: serverTimestamp(),
    endedAt: null,
    messageCount: 0,
    isComplete: false,
  });
  return ref.id;
}

export async function saveAdversaryMessages(
  sessionId: string,
  messages: { role: "user" | "assistant"; content: string; timestamp: number }[]
): Promise<void> {
  if (!db) return;
  const batch: Promise<any>[] = [];
  for (const msg of messages) {
    batch.push(
      addDoc(collection(db, "adversarySessions", sessionId, "messages"), msg)
    );
  }
  await Promise.all(batch);
}

export async function saveAdversaryDebrief(
  sessionId: string,
  debrief: AdversaryDebrief
): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, "adversarySessions", sessionId, "debrief"), {
    ...debrief,
  });
}

export async function completeAdversarySession(
  sessionId: string,
  messageCount: number
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "adversarySessions", sessionId), {
    endedAt: serverTimestamp(),
    messageCount,
    isComplete: true,
  });
}

export async function getUserAdversarySessions(
  userId: string,
  limit = 20
): Promise<AdversarySession[]> {
  if (!db) return [];
  const q = query(
    collection(db, "adversarySessions"),
    where("userId", "==", userId),
    orderBy("startedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => ({
    sessionId: d.id,
    ...d.data(),
    startedAt: d.data().startedAt?.toDate?.() ?? new Date(),
    endedAt: d.data().endedAt?.toDate?.() ?? null,
  })) as AdversarySession[];
}
