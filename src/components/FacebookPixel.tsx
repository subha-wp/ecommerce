"use client";

import { useEffect } from "react";
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
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Track page views on route changes
    window.fbq("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}

// Utility function to track custom events
export const trackFacebookEvent = (eventName: string, eventParams = {}) => {
  if (window.fbq) {
    window.fbq("track", eventName, eventParams);
  }
};
