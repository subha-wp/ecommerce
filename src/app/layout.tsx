// @ts-nocheck
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/auth";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { FacebookPixelEvents } from "@/components/pixel-events";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zaptray",
  description: "Ab Wholesale hua Asaan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="w-full">
        <GoogleAnalytics gaId="G-J8ERQE5JMX" />
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Suspense fallback={null}>
              <FacebookPixelEvents />
            </Suspense>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
