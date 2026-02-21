import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./admin";

export async function getServerUser() {
  if (!adminAuth) {
    return null;
  }
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("field-token")?.value;
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email, name: decoded.name };
  } catch {
    return null;
  }
}

export async function getServerProfile() {
  const user = await getServerUser();
  if (!user || !adminDb) return null;
  const snap = await adminDb.collection("profiles").doc(user.uid).get();
  if (!snap.exists) return null;
  const d = snap.data();
  return {
    ...d,
    userId: snap.id,
    createdAt: d?.createdAt?.toDate?.() ?? null,
    updatedAt: d?.updatedAt?.toDate?.() ?? null,
  };
}
