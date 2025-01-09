"use client";
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const FacebookPixelEvents: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Skip tracking for admin routes
    if (pathname.startsWith("/next-admin")) {
      return;
    }

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("753724590272379");
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};
