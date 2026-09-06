import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";
import { CustomJwtPayload, getCurrentUser } from "@/service/auth.sevice";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentUser()) as CustomJwtPayload | null;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* 💡 সাইডবার এখানেই থাকে! */}
      <Sidebar role={user.role} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
