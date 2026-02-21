"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signInWithGoogle } from "@/lib/firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cred = await signIn(email, password);
      // Set cookie immediately — don't wait for useAuth listener
      const token = await cred.user.getIdToken();
      document.cookie = `field-token=${token}; path=/; max-age=3600; SameSite=Strict`;
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithGoogle();
      // Set cookie immediately
      const token = await cred.user.getIdToken();
      document.cookie = `field-token=${token}; path=/; max-age=3600; SameSite=Strict`;
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-[10px] mb-12 justify-center">
          <div className="w-[10px] h-[10px] bg-[#FF5500]" />
          <span className="font-['Syne'] text-[20px] font-extrabold tracking-[6px] text-white">
            FIELD
          </span>
        </div>

        <h1 className="font-['Syne'] text-[32px] font-bold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-[14px] text-[#666666] text-center mb-8">
          Sign in to continue your practice
        </p>

        {error && (
          <div className="bg-[rgba(239,68,68,0.1)] border border-[#EF4444] text-[#EF4444] px-4 py-3 mb-6 text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase py-3.5 cursor-pointer transition-all duration-150 hover:bg-[#E64D00] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#252525]" />
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="bg-black px-4 text-[#4A4A4A]">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-transparent border border-[#252525] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase py-3.5 cursor-pointer transition-all duration-150 hover:border-[#4A4A4A] hover:bg-[#111111] disabled:opacity-50"
        >
          Continue with Google
        </button>

        <p className="text-[13px] text-[#666666] text-center mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FF5500] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
