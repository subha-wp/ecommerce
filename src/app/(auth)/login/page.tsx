import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login to ZapTray",
  description: "Access your ZapTray account",
};

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-8 p-8 md:w-1/2">
          <div className="space-y-2 text-center">
            {/* <Image
              src="/logo.svg"
              alt="ZapTray Logo"
              width={64}
              height={64}
              className="mx-auto"
            /> */}
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Log in to your ZapTray account
            </p>
          </div>
          <div className="space-y-6">
            <GoogleSignInButton />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <LoginForm />
            <div className="text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-gradient-to-br from-primary to-secondary p-12 md:block md:w-1/2">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-6 text-white">
              <h2 className="text-2xl font-bold">Streamline Your Workflow</h2>
              <p>
                ZapTray helps you manage tasks, collaborate with your team, and
                boost productivity.
              </p>
            </div>
            <Image
              src="/login-illustration.svg"
              alt="Login Illustration"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
