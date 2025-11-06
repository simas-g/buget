"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTestMode, exitTestMode } from "@/app/lib/testMode";

export const TestModeGuard = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (isTestMode()) {
      const isAllowedPath = pathname.startsWith("/test-mode") || 
                           pathname.startsWith("/skydelis") ||
                           pathname.startsWith("/api/");
      
      if (!isAllowedPath) {
        exitTestMode();
      }
    }
  }, [pathname]);

  return null;
};

