"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PasswordInput } from "@/components/PasswordInput";
import { signUp } from "./actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [error, setError] = useState<string>();
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email",
  );
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    setIsPending(true);
    try {
      const result = await signUp({
        ...values,
        identifierType,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Sign up with</FormLabel>
          <RadioGroup
            defaultValue="email"
            onValueChange={(value) =>
              setIdentifierType(value as "email" | "phone")
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <FormLabel htmlFor="email">Email</FormLabel>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <FormLabel htmlFor="phone">Phone</FormLabel>
            </div>
          </RadioGroup>
        </div>

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {identifierType === "email" ? "Email Address" : "Phone Number"}
              </FormLabel>
              <FormControl>
                <Input
                  type={identifierType === "email" ? "email" : "tel"}
                  placeholder={
                    identifierType === "email"
                      ? "Enter your email"
                      : "Enter your 10-digit phone number"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
