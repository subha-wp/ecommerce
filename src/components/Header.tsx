"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SearchBar from "./SearchBar";
import { useCart } from "@/context/CartContext";
import { categories } from "../../categories";

export default function Header({ user }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { cart } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`z-50 bg-white shadow-md transition-all duration-300 ${isSticky ? "sticky top-0" : ""}`}
    >
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            CHIN TAPAK
          </Link>
          <nav className="hidden space-x-6 md:flex">
            {categories.map((category) => (
              <div key={category.name} className="group relative">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  {category.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="invisible absolute left-0 z-50 mt-2 w-48 rounded-md bg-white opacity-0 shadow-lg transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      href={`/products?category=${category.name}&subcategory=${subcategory}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="mx-4 hidden max-w-md flex-1 md:block">
            <SearchBar />
          </div>
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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        <div className="mt-4 w-full md:hidden">
          <SearchBar />
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center justify-between font-semibold text-gray-600 hover:text-gray-900"
                >
                  <Link href={`/products?category=${category.name}`}>
                    {category.name}
                  </Link>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="space-y-2 pl-4">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      href={`/products?category=${category.name}&subcategory=${subcategory}`}
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
