// @ts-nocheck
import { validateRequest } from "@/auth";

import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

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
        <div className="mx-auto mb-6 flex w-full grow gap-5">{children}</div>
      </div>
      <BottomNav />
      {/* <Footer/> */}
      <Toaster />
    </CartProvider>
  );
}
