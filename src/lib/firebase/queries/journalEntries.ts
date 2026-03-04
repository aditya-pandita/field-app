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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../client";
import type { JournalEntry, NewJournalEntry } from "../types";

function toEntry(id: string, data: any): JournalEntry {
  return {
    entryId:    id,
    userId:     data.userId,
    title:      data.title      ?? "",
    content:    data.content    ?? "",
    sessionId:  data.sessionId  ?? null,
    approachId: data.approachId ?? null,
    mood:       data.mood       ?? null,
    tags:       data.tags       ?? [],
    createdAt:  data.createdAt?.toDate?.() ?? new Date(),
    updatedAt:  data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getUserJournalEntries(userId: string): Promise<JournalEntry[]> {
  if (!db) return [];
  const q = query(collection(db, "journalEntries"), where("userId", "==", userId));
  const snap = await getDocs(q);
  const entries = snap.docs.map((d) => toEntry(d.id, d.data()));
  entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return entries;
}

export async function getJournalEntryById(entryId: string): Promise<JournalEntry | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "journalEntries", entryId));
  if (!snap.exists()) return null;
  return toEntry(snap.id, snap.data());
}

export async function createJournalEntry(
  userId: string,
  data: NewJournalEntry
): Promise<JournalEntry> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "journalEntries"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const created = await getDoc(ref);
  return toEntry(ref.id, created.data());
}

export async function updateJournalEntry(
  entryId: string,
  data: Partial<Omit<JournalEntry, "entryId" | "userId" | "createdAt">>
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "journalEntries", entryId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "journalEntries", entryId));
}
