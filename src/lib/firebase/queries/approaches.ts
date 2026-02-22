import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../client";
import type { Approach, NewApproach } from "../types";
import { calcOverallScore } from "../../utils/scores";
import { incrementApproachCount } from "./sessions";

function toApproach(id: string, data: any): Approach {
  return {
    approachId:      id,
    userId:          data.userId,
    sessionId:       data.sessionId,
    phaseReached:    data.phaseReached,
    outcome:         data.outcome,
    openerType:      data.openerType,
    scoreExecution:  data.scoreExecution,
    scoreTonality:   data.scoreTonality,
    scoreInvestment: data.scoreInvestment,
    scoreClose:      data.scoreClose,
    scoreRecovery:   data.scoreRecovery,
    scoreOverall:    data.scoreOverall,
    whatWentWell:    data.whatWentWell   ?? "",
    whatToImprove:   data.whatToImprove  ?? "",
    notableMoment:   data.notableMoment  ?? "",
    tags:            data.tags           ?? [],
    // coachStyle:      data.coachStyle     ?? "",
    // environment:     data.environment    ?? "",
    loggedAt:        data.loggedAt?.toDate?.()  ?? new Date(),
    createdAt:       data.createdAt?.toDate?.() ?? new Date(),
  };
}

export async function getSessionApproaches(sessionId: string): Promise<Approach[]> {
  if (!db) return [];
  const q = query(
    collection(db, "approaches"),
    where("sessionId", "==", sessionId),
    orderBy("loggedAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toApproach(d.id, d.data()));
}

export async function logApproach(
  userId: string,
  data: NewApproach
): Promise<Approach> {
  if (!db) throw new Error("Database not configured");

  const scoreOverall = calcOverallScore({
    execution:  data.scoreExecution,
    tonality:   data.scoreTonality,
    investment: data.scoreInvestment,
    close:      data.scoreClose,
    recovery:   data.scoreRecovery,
  });

  const ref = await addDoc(collection(db, "approaches"), {
    ...data,
    userId,
    scoreOverall,
    loggedAt:  serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  if (data.sessionId) {
    incrementApproachCount(data.sessionId).catch(console.error);
  }

  // Use getDoc(ref) — the correct modular SDK pattern
  const created = await getDoc(ref);
  return toApproach(ref.id, created.data());
}

/** Update an existing approach — recalculates scoreOverall from new metric scores */
export async function updateApproach(
  approachId: string,
  data: Partial<NewApproach>
): Promise<void> {
  if (!db) return;

  // Recalculate overall score if any metric changed
  const existing = await getDoc(doc(db, "approaches", approachId));
  if (!existing.exists()) throw new Error("Approach not found");

  const merged = { ...existing.data(), ...data };
  const scoreOverall = calcOverallScore({
    execution:  merged.scoreExecution ?? 0,
    tonality:   merged.scoreTonality ?? 0,
    investment: merged.scoreInvestment ?? 0,
    close:      merged.scoreClose ?? 0,
    recovery:   merged.scoreRecovery ?? 0,
  });

  await updateDoc(doc(db, "approaches", approachId), {
    ...data,
    scoreOverall,
  });
}

export async function deleteApproach(approachId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "approaches", approachId));
}