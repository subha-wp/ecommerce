import { validateRequest } from "@/auth";

import React from "react";
import Logout from "./Logout";

export default async function page() {
  const { user } = await validateRequest();

  return (
    <main className="container mx-auto max-w-7xl p-2">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="text-sm text-gray-500">Manage your account settings</p>
          <p>{user?.email}</p>
          <p>{user?.displayName}</p>
        </div>
        <Logout />
      </div>
    </main>
  );
}
