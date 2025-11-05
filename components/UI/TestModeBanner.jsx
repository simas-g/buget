"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Home } from "lucide-react";
import { isTestMode, exitTestMode, getTestUser } from "@/app/lib/testMode";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TestModeBanner = () => {
  const [inTestMode, setInTestMode] = useState(false);
  const [testUser, setTestUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setInTestMode(isTestMode());
    setTestUser(getTestUser());
  }, []);

  const handleExit = () => {
    exitTestMode();
    document.cookie = "TEST_MODE=; path=/; max-age=0";
    router.push("/");
  };

  if (!inTestMode) return null;

  return (
    <div className="mx-auto z-10 px-4 sm:px-6 lg:px-8 w-full border-b border-white/20 bg-gradient-to-r from-[#2563EB] to-[#EB2563]">
      <div className="flex items-center justify-between py-6">
        <Link
          href={"/"}
          className="flex gap-2 items-center bg-white/10 rounded-xl px-5 py-2.5 text-white hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Home className="w-4 h-4" />
          <p className="hidden sm:inline font-medium">Pradžia</p>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
            <AlertCircle className="h-5 w-5 text-white" />
            <span className="font-medium text-white">
              Test režimas: {testUser?.name} {testUser?.avatar}
            </span>
            <span className="text-sm text-white/90 hidden lg:inline">
              Naudojate test vartotojo duomenis
            </span>
          </div>
          
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 text-white font-medium shadow-md hover:shadow-lg"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Išeiti iš test režimo</span>
            <span className="sm:hidden">Išeiti</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestModeBanner;

