"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, ShoppingCart } from "lucide-react";

const sidebarItems = [
  { name: "Products", href: "/next-admin/products", icon: Package },
  { name: "Customers", href: "/next-admin/customers", icon: Users },
  { name: "Orders", href: "/next-admin/orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col bg-white shadow-lg">
      <div className="flex h-20 items-center justify-center shadow-md">
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <span
                    className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
