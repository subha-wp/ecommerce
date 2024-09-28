"use client";

import { useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";

export default function AdminMainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 p-8 transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64",
      )}
    >
      {children}
    </main>
  );
}
