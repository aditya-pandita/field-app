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
import type { ScenarioSession, ScenarioMessage, ScenarioFeedback, Difficulty } from "../types";

export async function createScenarioSession(
  userId: string,
  scenarioId: string,
  scenarioLabel: string,
  difficulty: Difficulty
): Promise<string> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "scenarioSessions"), {
    userId,
    scenarioId,
    scenarioLabel,
    difficulty,
    startedAt: serverTimestamp(),
    endedAt: null,
    messageCount: 0,
    isComplete: false,
  });
  return ref.id;
}

export async function saveScenarioMessages(
  sessionId: string,
  messages: ScenarioMessage[]
): Promise<void> {
  if (!db) return;
  const batch: Promise<any>[] = [];
  for (const msg of messages) {
    batch.push(
      addDoc(collection(db, "scenarioSessions", sessionId, "messages"), {
        ...msg,
        timestamp: msg.timestamp,
      })
    );
  }
  await Promise.all(batch);
}

export async function saveScenarioFeedback(
  sessionId: string,
  feedback: ScenarioFeedback
): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, "scenarioSessions", sessionId, "feedback"), {
    ...feedback,
  });
}

export async function completeScenarioSession(
  sessionId: string,
  messageCount: number
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "scenarioSessions", sessionId), {
    endedAt: serverTimestamp(),
    messageCount,
    isComplete: true,
  });
}

export async function getUserScenarioSessions(
  userId: string,
  limit = 20
): Promise<ScenarioSession[]> {
  if (!db) return [];
  const q = query(
    collection(db, "scenarioSessions"),
    where("userId", "==", userId),
    orderBy("startedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => ({
    sessionId: d.id,
    ...d.data(),
    startedAt: d.data().startedAt?.toDate?.() ?? new Date(),
    endedAt: d.data().endedAt?.toDate?.() ?? null,
  })) as ScenarioSession[];
}
