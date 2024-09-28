import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <AdminSidebar />
      <main className="w-full flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
        <div className="px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
