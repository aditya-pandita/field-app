import {
  collection,
  doc,
  addDoc,
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
    approachId: id,
    userId: data.userId,
    sessionId: data.sessionId,
    phaseReached: data.phaseReached,
    outcome: data.outcome,
    openerType: data.openerType,
    scoreExecution: data.scoreExecution,
    scoreTonality: data.scoreTonality,
    scoreInvestment: data.scoreInvestment,
    scoreClose: data.scoreClose,
    scoreRecovery: data.scoreRecovery,
    scoreOverall: data.scoreOverall,
    whatWentWell: data.whatWentWell ?? "",
    whatToImprove: data.whatToImprove ?? "",
    notableMoment: data.notableMoment ?? "",
    tags: data.tags ?? [],
    loggedAt: data.loggedAt?.toDate?.() ?? new Date(),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
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
    execution: data.scoreExecution,
    tonality: data.scoreTonality,
    investment: data.scoreInvestment,
    close: data.scoreClose,
    recovery: data.scoreRecovery,
  });

  const ref = await addDoc(collection(db, "approaches"), {
    ...data,
    userId,
    scoreOverall,
    loggedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  incrementApproachCount(data.sessionId).catch(console.error);

  const snap = await getDocs(query(collection(db, "approaches"), where("__name__", "==", ref.id)));
  return toApproach(ref.id, snap.docs[0]?.data());
}

export async function deleteApproach(approachId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "approaches", approachId));
}
