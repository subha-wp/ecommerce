import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider } from "./SidebarContext";
import AdminMainContent from "./AdminMainContent";

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
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <AdminMainContent>{children}</AdminMainContent>
      </div>
    </SidebarProvider>
  );
}
