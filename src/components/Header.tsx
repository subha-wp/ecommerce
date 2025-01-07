"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header({ user }: any) {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const menuItems = [
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/return-refund-policy", label: "Return & Refund Policy" },
    { href: "/cancellation-policy", label: "Cancellation Policy" },
  ];

  return (
    <header
      className={`z-50 bg-gradient-to-r from-green-50 to-green-100 shadow-sm transition-all duration-300 ${isSticky ? "sticky top-0" : ""} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto max-w-7xl px-4 py-2 sm:py-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/">
            <span className="text-lg font-bold text-green-700">ZapTray</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cart.length}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
            {user ? (
              <Link href="/user/account" aria-label="User account">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/login" aria-label="Login">
                <User className="h-6 w-6 text-green-600" />
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-green-600" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white">
                <SheetHeader>
                  <SheetTitle>Important Links</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <SheetFooter>
                  <p>Hello</p>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <form onSubmit={handleSearch} className="mt-2 flex w-full">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full border-green-200 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-green-600"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}
