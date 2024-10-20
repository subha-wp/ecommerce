"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Smartphones", "Refrigerator", "AC", "Accessories"],
  },
  { name: "Clothing", subcategories: ["Men", "Women", "Kids"] },
  { name: "Home Appliances", subcategories: ["Furniture", "Decor", "Kitchen"] },
];

export default function Header({ user }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky -top-1 z-40 bg-white shadow-md">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-1">
        <Link href="/" className="border p-1 text-xl font-bold">
          <p>CHIN TAPAK</p>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          {categories.map((category) => (
            <div key={category.name} className="group relative">
              <Link
                href={`/products?category=${category.name}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {category.name}
              </Link>
              <div className="invisible absolute left-0 mt-2 w-48 rounded-md bg-white opacity-0 shadow-lg transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
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
        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <ShoppingCart className="h-6 w-6 text-gray-600" />
          </Link>
          {user ? (
            <Link href="/user/account">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
                <AvatarFallback>
                  {user?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/login">
              <User className="h-6 w-6 text-gray-600" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-2 px-4 py-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleMenu}
            >
              Home
            </Link>
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <Link
                  href={`/products?category=${category.name}`}
                  className="font-semibold text-gray-600 hover:text-gray-900"
                  onClick={toggleMenu}
                >
                  {category.name}
                </Link>
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/products?category=${category.name}&subcategory=${subcategory}`}
                    className="block pl-4 text-sm text-gray-600 hover:text-gray-900"
                    onClick={toggleMenu}
                  >
                    {subcategory}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
