// @ts-nocheck
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "./Logout";
import { UserProfile } from "./UserProfile";
import { AddressList } from "./AddressList";
import { OrderHistory } from "@/components/OrderHistory";

export default async function UserAccountPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto max-w-7xl space-y-8 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold md:text-3xl">Account</h1>
          <Logout />
        </div>
        <p className="text-sm text-gray-500">
          Manage your account settings and view your orders
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <UserProfile user={user} />
          <AddressList userId={user.id} />
        </div>
      </div>
    </main>
  );
}
