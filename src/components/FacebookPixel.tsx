"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

declare global {
  interface Window {
    fbq: any;
  }
}

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Load the Facebook Pixel script
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.fbq("init", FB_PIXEL_ID);
      window.fbq("track", "PageView");
      setIsLoaded(true);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && FB_PIXEL_ID && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [isLoaded, pathname, searchParams]);

  return null;
}

// Utility function to track custom events
export const trackFacebookEvent = (eventName: string, eventParams = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, eventParams);
  } else {
    console.warn("Facebook Pixel is not initialized yet.");
  }
};
