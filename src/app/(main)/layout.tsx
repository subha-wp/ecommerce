// @ts-nocheck
import { validateRequest } from "@/auth";

import SessionProvider from "./SessionProvider";

import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <SessionProvider value={session}>
      <CartProvider>
        <Header user={session.user} />
        <div className="flex min-h-screen flex-col">
          <div className="mx-auto flex w-full grow gap-5">{children}</div>
        </div>
        <Toaster />
      </CartProvider>
    </SessionProvider>
  );
}
