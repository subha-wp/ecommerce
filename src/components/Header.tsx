"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import logo from "@/assets/jaldhara-logo.png";
import Image from "next/image";

export default function Header({ user }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky -top-1 z-40 bg-white shadow-md">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-1">
        <Link href="/" className="border p-1 text-xl font-bold">
          {/* <Image src={logo} alt="Adda Baji" height={50} width={50} /> */}
          <p>CHIN TAPAK</p>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-900">
            Products
          </Link>
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
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleMenu}
            >
              Products
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
