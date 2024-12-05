"use client";

import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Logout() {
  return (
    <Button onClick={() => logout()} variant="outline">
      Logout
    </Button>
  );
}
