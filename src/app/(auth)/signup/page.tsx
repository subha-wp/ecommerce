// import signupImage from "@/assets/signup-image2.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[36rem] w-fit overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:min-w-[420px]">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">Sign up to ZapTray</h1>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        {/* <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        /> */}
      </div>
    </main>
  );
}
