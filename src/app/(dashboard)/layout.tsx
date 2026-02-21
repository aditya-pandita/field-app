import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/firebase/auth.server";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-black">
      <Sidebar userId={user.uid} displayName={user.name || ""} />
      <main className="lg:ml-[220px] pb-20 lg:pb-0 min-h-screen">
        <div className="p-6 lg:p-12 max-w-[1200px]">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
