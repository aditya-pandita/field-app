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
  Timestamp,
} from "firebase/firestore";
import { db } from "../client";
import type { Lead, NewLead, LeadStage } from "../types";

function toLead(id: string, data: any): Lead {
  return {
    leadId:           id,
    userId:           data.userId,
    stage:            data.stage ?? "lead",
    name:             data.name ?? "",
    photoUrl:         data.photoUrl ?? null,
    appearanceNotes:  data.appearanceNotes ?? "",
    vibeNotes:        data.vibeNotes ?? "",
    generalNotes:     data.generalNotes ?? "",
    phone:            data.phone ?? null,
    instagram:        data.instagram ?? null,
    snapchat:         data.snapchat ?? null,
    sourceApproachId: data.sourceApproachId ?? null,
    sourceSessionId:  data.sourceSessionId ?? null,
    pushPullTopics:   data.pushPullTopics ?? [],
    createdAt:        data.createdAt?.toDate?.() ?? new Date(),
    updatedAt:        data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getUserLeads(userId: string): Promise<Lead[]> {
  if (!db) return [];
  const q = query(collection(db, "leads"), where("userId", "==", userId));
  const snap = await getDocs(q);
  const leads = snap.docs.map((d) => toLead(d.id, d.data()));
  return leads.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getLeadById(leadId: string): Promise<Lead | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "leads", leadId));
  if (!snap.exists()) return null;
  return toLead(snap.id, snap.data());
}

export async function createLead(userId: string, data: NewLead): Promise<Lead> {
  if (!db) throw new Error("Database not configured");
  const ref = await addDoc(collection(db, "leads"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const created = await getDoc(ref);
  return toLead(ref.id, created.data());
}

export async function updateLead(
  leadId: string,
  data: Partial<Omit<Lead, "leadId" | "userId" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "leads", leadId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function moveLeadStage(leadId: string, stage: LeadStage): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "leads", leadId), {
    stage,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLead(leadId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "leads", leadId));
}
