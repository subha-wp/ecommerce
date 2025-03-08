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
import { headers } from "next/headers";

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
  title: "Zaptray - Ab Wholesale hua Asaan",
  description:
    "Discover wholesale prices on a wide range of products. Zaptray makes wholesale shopping easy and accessible for everyone.",
  keywords:
    "wholesale, online shopping, bulk purchase, retail, Indian marketplace",
  authors: [{ name: "Zaptray" }],
  creator: "Zaptray",
  publisher: "Zaptray",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zaptray.com"),
  openGraph: {
    title: "Zaptray - Ab Wholesale hua Asaan",
    description:
      "Discover wholesale prices on a wide range of products. Zaptray makes wholesale shopping easy and accessible for everyone.",
    url: "https://zaptray.com",
    siteName: "Zaptray",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "EyvFuMTDd3xjqQ_1mRBsNW6_6lA7lULeoh3MliYKLjU",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/next-admin");

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="EyvFuMTDd3xjqQ_1mRBsNW6_6lA7lULeoh3MliYKLjU"
        />
        <link rel="canonical" href="https://yourdomain.com" />
      </head>
      <body className="w-full">
        {!isAdminRoute && (
          <>
            <GoogleAnalytics gaId="G-J8ERQE5JMX" />
            <Suspense fallback={null}>
              <FacebookPixelEvents />
            </Suspense>
          </>
        )}
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
