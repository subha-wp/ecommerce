"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Users,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
  FolderTree,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarContext";

const sidebarItems = [
  { name: "Dashboard", href: "/next-admin", icon: LayoutDashboard },
  { name: "Products", href: "/next-admin/products", icon: Package },
  { name: "Categories", href: "/next-admin/categories", icon: FolderTree },
  { name: "Coupons", href: "/next-admin/coupons", icon: BadgePercent },
  { name: "Customers", href: "/next-admin/customers", icon: Users },
  { name: "Orders", href: "/next-admin/orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white shadow-lg transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="space-y-2 px-2">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <span
                    className={cn(
                      "flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100",
                      isActive ? "bg-gray-200" : "",
                      isCollapsed ? "justify-center" : "",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
