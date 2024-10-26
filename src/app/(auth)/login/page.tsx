import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-fit w-full max-w-fit overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full min-w-[360px] space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-2xl font-bold">Login to ZapTray</h1>
          <div className="space-y-5">
            {/* <GoogleSignInButton /> */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              {/* <span>OR</span> */}
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        {/* <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        /> */}
      </div>
    </main>
  );
}
