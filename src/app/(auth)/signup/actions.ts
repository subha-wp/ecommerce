"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateId } from "lucia";
import { cookies } from "next/headers";

export async function signUp(
  credentials: SignUpValues & { identifierType: "email" | "phone" },
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { name, identifier, password, identifierType } = credentials;
    const hashedPassword = await hash(password);
    const userId = generateId(15);

    // Check if user already exists with the given identifier
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifierType === "email" ? identifier : undefined },
          { phoneNumber: identifierType === "phone" ? identifier : undefined },
        ],
      },
    });

    if (existingUser) {
      return {
        error: `User with this ${identifierType} already exists`,
      };
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id: userId,
        username: userId, // Using userId as username for now
        displayName: name,
        email: identifierType === "email" ? identifier : null,
        phoneNumber: identifierType === "phone" ? identifier : null,
        passwordHash: hashedPassword,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true };
  } catch (error) {
    console.error("Error in signUp:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
