"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

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

      if (currentScrollY > 100) {
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

  return (
    <header
      className={`z-50 bg-white shadow-md transition-all duration-300 ${
        isSticky ? "sticky top-0" : ""
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="text-right">
            <p className="-mb-3 text-xl font-bold">ZapTray</p>
            <small className="text-[7px]">JSR TRADERS</small>
          </Link>
          <form
            onSubmit={handleSearch}
            className="mx-4 hidden max-w-xl flex-1 lg:flex"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
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
                <User className="h-6 w-6 text-gray-600" />
              </Link>
            )}
          </div>
        </div>
        <form onSubmit={handleSearch} className="mt-4 flex lg:hidden">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
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
