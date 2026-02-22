import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] text-center">
        <div className="flex items-center gap-[10px] mb-12 justify-center">
          <div className="w-[10px] h-[10px] bg-[#FF5500]" />
          <span className="font-['Syne'] text-[20px] font-extrabold tracking-[6px] text-white">
            FIELD
          </span>
        </div>

        <h1 className="font-['Syne'] text-[48px] font-bold text-white mb-4">
          Master Your
          <br />
          <span className="text-[#FF5500]">Social Skills</span>
        </h1>
        
        <p className="text-[14px] text-[#666666] mb-12 max-w-[300px] mx-auto">
          Track your field approaches, practice with AI scenarios, and build real confidence.
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-[#FF5500] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase py-3.5 transition-all duration-150 hover:bg-[#E64D00]"
          >
            Sign In
          </Link>
          
          <Link
            href="/signup"
            className="block w-full bg-transparent border border-[#252525] text-white font-['JetBrains_Mono'] text-[10px] tracking-[3px] uppercase py-3.5 transition-all duration-150 hover:border-[#4A4A4A] hover:bg-[#111111]"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 text-left">
          <div>
            <div className="text-[24px] font-['Syne'] text-white">📝</div>
            <div className="text-[10px] text-[#666666] mt-1">Log Approaches</div>
          </div>
          <div>
            <div className="text-[24px] font-['Syne'] text-white">🎭</div>
            <div className="text-[10px] text-[#666666] mt-1">AI Practice</div>
          </div>
          <div>
            <div className="text-[24px] font-['Syne'] text-white">📊</div>
            <div className="text-[10px] text-[#666666] mt-1">Track Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}
