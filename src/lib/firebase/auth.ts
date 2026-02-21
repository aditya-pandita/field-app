import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./client";

const googleProvider = new GoogleAuthProvider();

export async function signIn(email: string, password: string) {
  if (!auth) throw new Error("Firebase not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string, displayName: string) {
  if (!auth) throw new Error("Firebase not configured");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  await createUserProfile(cred.user.uid, { displayName, email });
  return cred;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not configured");
  const cred = await signInWithPopup(auth, googleProvider);
  const displayName = cred.user.displayName || "";
  const email = cred.user.email || "";
  await createUserProfile(cred.user.uid, { displayName, email });
  return cred;
}

export async function signOut() {
  if (!auth) return;
  return firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  if (!auth?.currentUser) return null;
  return auth.currentUser.getIdToken() ?? null;
}

async function createUserProfile(
  uid: string,
  { displayName, email }: { displayName: string; email: string }
) {
  if (!db) return;
  const ref = doc(db, "profiles", uid);
  const exists = await getDoc(ref);
  if (!exists.exists()) {
    await setDoc(ref, {
      userId: uid,
      displayName,
      email,
      username: "",
      city: "",
      skillLevel: "beginner",
      totalApproaches: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
