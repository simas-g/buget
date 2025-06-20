"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { themes } from "@/app/lib/themes";
import { Settings, Moon, Sun, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUserSession } from "@/app/lib/auth/session";
import Link from "next/link";
import Connected from "./Connected";
// Mock data for demonstration

export default function Dashboard({ user, sessionId }) {
  const router = useRouter();
  const [token, setToken] = useState("");

  const [theme, setTheme] = useState("dark");
  const currentTheme = themes[theme];
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const logout = async () => {
    await deleteUserSession();
    router.push("/prisijungti");
  };
  // Fetch the token
  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
      setToken(access_token);
      return;
    }
    async function getToken() {
      try {
        const res = await fetch("/api/goCardLessToken", {
          headers: {
            Authorization: "Bearer " + sessionId,
          },
        });
        const parsed = await res.json();
        console.log(parsed, "parsed");
        setToken(parsed);
        sessionStorage.setItem("access_token", JSON.stringify(parsed));
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    getToken();
  }, [sessionId]);
  useEffect(() => {
    async function listAccounts() {
      try {
        const res = await fetch("/api/listAccounts", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + sessionId,
          },
          body: JSON.stringify({
            requisitionId: sessionStorage.getItem("req_id"),
            access_token: token,
          }),
        });
        const data = await res.json();
        console.log(data, "our banks");
      } catch (error) {
        console.log(error, "error");
      }
    }
    listAccounts();
  }, []);
  return (
    <div className="relative z-10">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0A20]/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href={"/"}>Pradžia</Link>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Nustatymai</span>
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center space-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Atsijungti</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`flex w-16 cursor-pointer p-1 border h-8 rounded-full items-center transition-all duration-300 ${
                  currentTheme.toggleBg
                } ${theme === "light" ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30,
                  }}
                  className="h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                >
                  {theme === "dark" ? (
                    <Moon className="h-3 w-3 text-gray-700" />
                  ) : (
                    <Sun className="h-3 w-3 text-yellow-500" />
                  )}
                </motion.div>
              </button>
              <button className="text-white">{user.name}</button>
            </div>
          </div>
        </div>
        
        {/**Connected bank accounts */}
        <Connected />
      </div>
    </div>
  );
}
