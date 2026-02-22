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
  limit as firestoreLimit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../client";
import type { TrainerSession, TrainerPivot, TrainerDifficulty, SelfRating, TopicCard, TransitionPhrase } from "../types";

export async function getTopicBank(maxDifficulty?: number): Promise<TopicCard[]> {
  if (!db) return [];
  let q = query(collection(db, "topicBank"), orderBy("difficulty", "asc"));
  const snap = await getDocs(q);
  let topics = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TopicCard[];
  if (maxDifficulty !== undefined) {
    topics = topics.filter((t) => t.difficulty <= maxDifficulty);
  }
  return topics;
}

export async function getTransitionPhrases(maxDifficulty?: number): Promise<TransitionPhrase[]> {
  if (!db) return [];
  let q = query(collection(db, "transitionPhrases"), orderBy("difficulty", "asc"));
  const snap = await getDocs(q);
  let phrases = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TransitionPhrase[];
  if (maxDifficulty !== undefined) {
    phrases = phrases.filter((p) => p.difficulty <= maxDifficulty);
  }
  return phrases;
}

export async function createTrainerSession(
  userId: string,
  difficulty: TrainerDifficulty
): Promise<string> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "trainerSessions"), {
    userId,
    difficulty,
    startedAt: serverTimestamp(),
    completedAt: null,
    totalPivots: 0,
    isComplete: false,
  });
  return ref.id;
}

export async function completeTrainerSession(
  sessionId: string,
  totalPivots: number
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "trainerSessions", sessionId), {
    completedAt: serverTimestamp(),
    totalPivots,
    isComplete: true,
  });
}

export async function logTrainerPivot(
  sessionId: string,
  data: {
    topicId: string;
    phraseId: string;
    rating: SelfRating;
  }
): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, "trainerSessions", sessionId, "pivots"), {
    ...data,
    timestamp: Date.now(),
  });
}
