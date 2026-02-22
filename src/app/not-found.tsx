import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <h1 className="font-[family-name:var(--font-syne)] text-[120px] text-[#333333] leading-none">
        404
      </h1>
      <h2 className="font-[family-name:var(--font-syne)] text-3xl mt-4 mb-2">Page not found</h2>
      <p className="text-[#666666] text-sm mb-8">
        The page you're looking for doesn't exist
      </p>
      <Link
        href="/dashboard"
        className="bg-[#FF5500] text-white px-6 py-3 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-widest hover:bg-[#E64D00] transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
