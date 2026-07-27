import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh">
      <Sidebar email={user.email ?? ""} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">{children}</div>
      </main>
    </div>
  );
}
