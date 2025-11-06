"use client";
import { ArrowLeft } from "lucide-react";
import PossibleBanks from "./PossibleBanks";
import Link from "next/link";
import { Suspense } from "react";
import DashboardBackground from "@/components/Dashboard/DashboardBackground";
import SharedNav from "@/components/Dashboard/SharedNav";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import ClientLayoutWrapper from "@/app/lib/ClientLayoutWrapper";
import QueryProvider from "@/app/lib/QueryWrapper";

export default () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <QueryProvider>
      <ClientLayoutWrapper>
        <DashboardBackground>
          <div className="min-h-screen relative">
            <SharedNav />
            <div className="w-full flex flex-col items-center px-5 sm:px-20 relative z-10">
              <Link href={"/skydelis"} className={`absolute left-4 top-4 md:hidden ${currentTheme.textPrimary}`}>
                <ArrowLeft size={32} />
              </Link>
              <h1 className={`font-semibold text-2xl text-center max-w-xl mb-7 pt-20 ${currentTheme.textHeading}`}>
                Pasirink banką
              </h1>

              <div className="w-full max-w-xl pb-10">
                <Suspense fallback={<p className={currentTheme.textPrimary}>Kraunama...</p>}>
                  <PossibleBanks />
                </Suspense>
              </div>
            </div>
          </div>
        </DashboardBackground>
      </ClientLayoutWrapper>
    </QueryProvider>
  );
}
