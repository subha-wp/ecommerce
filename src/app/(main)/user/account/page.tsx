// @ts-nocheck
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "./Logout";
import { UserProfile } from "./UserProfile";
import { AddressList } from "./AddressList";
import { OrderHistory } from "./OrderHistory";

export default async function UserAccountPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Account</h1>
          <p className="text-sm text-gray-500">
            Manage your account settings and view your orders
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <UserProfile user={user} />
            <AddressList userId={user.id} />
          </div>
          <div>
            <OrderHistory userId={user.id} />
          </div>
        </div>

        <Logout />
      </div>
    </main>
  );
}
