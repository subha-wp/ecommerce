// @ts-nocheck
import { validateRequest } from "@/auth";

import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <CartProvider>
      <Header user={session.user} />
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full grow gap-5">{children}</div>
      </div>
      <Footer/>
      <Toaster />
    </CartProvider>
  );
}
