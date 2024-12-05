"use client";

import { Home, Compass, User, Package, PackageSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t bg-white pb-safe md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link
          href="/categories"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === "/categories"
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <PackageSearch className="h-5 w-5" />
          <span className="ml-1 text-[10px]"> Categories</span>
        </Link>

        <Link href="/products" className="relative flex flex-col items-center">
          <div className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
            <Compass className="h-6 w-6" />
          </div>
          <span className="mt-6 text-[10px]">Explore</span>
        </Link>

        <Link
          href="/my-orders"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === "/my-orders"
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <Package className="h-5 w-5" />
          <span className="text-[10px]">My Orders</span>
        </Link>

        <Link
          href="/user/account"
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === "/user/account"
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </div>
  );
}
