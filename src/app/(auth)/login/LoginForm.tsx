"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/lib/validation";
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
import { login } from "./actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email",
  );
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    setIsPending(true);
    try {
      const result = await login({
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

        <div className="space-y-2">
          <FormLabel>Sign in with</FormLabel>
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
                      : "Enter your phone number"
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
                <PasswordInput placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
