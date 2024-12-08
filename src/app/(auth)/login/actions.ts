"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { LoginValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";

export async function login(
  credentials: LoginValues & { identifierType: "email" | "phone" },
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { identifier, password, identifierType } = credentials;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifierType === "email" ? identifier : undefined },
          { phoneNumber: identifierType === "phone" ? identifier : undefined },
        ],
      },
    });

    if (!user || !user.passwordHash) {
      return {
        error: "Invalid credentials",
      };
    }

    const validPassword = await verify(user.passwordHash, password);
    if (!validPassword) {
      return {
        error: "Invalid credentials",
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true };
  } catch (error) {
    console.error("Error in login:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
