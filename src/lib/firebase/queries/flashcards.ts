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
import type { FlashcardTemplate, UserFlashcardProgress, FlashcardCategory } from "../types";

const EASY_DAYS = 7;
const HARD_DAYS = 1;
const BLANK_HOURS = 4;

export async function getFlashcardsForReview(
  userId: string,
  limit = 10
): Promise<{ template: FlashcardTemplate; progress: UserFlashcardProgress | null }[]> {
  if (!db) return [];

  const now = new Date();
  
  const progressQ = query(
    collection(db, "flashcardProgress"),
    where("userId", "==", userId),
    orderBy("nextReviewAt", "asc")
  );
  const progressSnap = await getDocs(progressQ);
  const progressMap = new Map<string, UserFlashcardProgress>();
  progressSnap.docs.forEach((d) => {
    const data = d.data();
    progressMap.set(data.flashcardId, {
      ...data,
      lastSeenAt: data.lastSeenAt?.toDate?.() ?? new Date(),
      nextReviewAt: data.nextReviewAt?.toDate?.() ?? new Date(),
    } as UserFlashcardProgress);
  });

  const templatesSnap = await getDocs(collection(db, "flashcardTemplates"));
  const templates = templatesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as FlashcardTemplate[];

  const dueCards: { template: FlashcardTemplate; progress: UserFlashcardProgress | null }[] = [];
  const newCards: { template: FlashcardTemplate; progress: UserFlashcardProgress | null }[] = [];

  for (const template of templates) {
    const progress = progressMap.get(template.id);
    if (!progress) {
      newCards.push({ template, progress: null });
    } else if (progress.nextReviewAt <= now) {
      dueCards.push({ template, progress });
    }
  }

  const result = [...dueCards, ...newCards].slice(0, limit);
  return result;
}

export async function recordFlashcardResult(
  userId: string,
  flashcardId: string,
  result: "easy" | "hard" | "blank"
): Promise<void> {
  if (!db) return;

  const docId = `${userId}_${flashcardId}`;
  const now = new Date();
  const existing = await getDoc(doc(db, "flashcardProgress", docId));

  let easeCount = 0;
  let hardCount = 0;
  let blankCount = 0;
  let masteryLevel = 0;

  if (existing.exists()) {
    const data = existing.data();
    easeCount = data.easeCount ?? 0;
    hardCount = data.hardCount ?? 0;
    blankCount = data.blankCount ?? 0;
    masteryLevel = data.masteryLevel ?? 0;
  }

  const daysToAdd = result === "easy" ? EASY_DAYS : result === "hard" ? HARD_DAYS : BLANK_HOURS / 24;
  const nextReview = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  if (result === "easy") easeCount++;
  if (result === "hard") hardCount++;
  if (result === "blank") blankCount++;
  masteryLevel = Math.min(10, masteryLevel + (result === "easy" ? 1 : result === "hard" ? 0.5 : -0.5));

  await updateDoc(doc(db, "flashcardProgress", docId), {
    userId,
    flashcardId,
    easeCount,
    hardCount,
    blankCount,
    masteryLevel,
    lastSeenAt: now,
    nextReviewAt: nextReview,
  });
}

export async function getFlashcardTemplates(category?: FlashcardCategory): Promise<FlashcardTemplate[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "flashcardTemplates"));
  let templates = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FlashcardTemplate[];
  if (category) {
    templates = templates.filter((t) => t.category === category);
  }
  return templates;
}
