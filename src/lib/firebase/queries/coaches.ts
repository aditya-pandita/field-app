import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../client";
import type { CoachStyle } from "../types";

export async function getAllCoachStyles(): Promise<CoachStyle[]> {
  if (!db) return [];
  const q = query(collection(db, "coaches"), orderBy("bestFor", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ slug: d.id, ...d.data() })) as CoachStyle[];
}

export async function getCoachStyleBySlug(slug: string): Promise<CoachStyle | null> {
  if (!db) return null;
  const snap = await getDocs(query(collection(db, "coaches")));
  const match = snap.docs.find((d) => d.id === slug);
  if (!match) return null;
  return { slug: match.id, ...match.data() } as CoachStyle;
}
