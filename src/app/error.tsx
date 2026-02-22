"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="w-12 h-12 rounded-full bg-[#FF5500]/20 flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-[#FF5500]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-syne)] text-2xl mb-2">Something went wrong</h2>
      <p className="text-[#666666] text-sm mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={() => reset()}
        className="bg-[#FF5500] text-white px-6 py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
      >
        Try Again
      </button>
      <a
        href="/dashboard"
        className="mt-4 text-[#666666] text-sm hover:text-white transition-colors"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
