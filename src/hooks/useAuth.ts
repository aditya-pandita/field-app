"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { onAuthChange, signOut as fbSignOut } from "@/lib/firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        document.cookie = `field-token=${token}; path=/; max-age=3600; SameSite=Strict`;
      } else {
        document.cookie = "field-token=; path=/; max-age=0";
      }
    });
    return unsub;
  }, []);

  async function signOut() {
    await fbSignOut();
    document.cookie = "field-token=; path=/; max-age=0";
    router.push("/login");
  }

  return { user, userId: user?.uid ?? null, loading, signOut };
}
