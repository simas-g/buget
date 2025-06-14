"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { themes } from "@/lib/themes";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Mail,
  Plus,
  Settings,
  Bell,
  Download,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Zap,
  Shield,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";
import BankConnection from "./BankConnection";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const mockData = {
  accounts: [
    {
      id: 1,
      name: "Swedbank",
      balance: 2847.32,
      currency: "EUR",
      lastSync: "2024-01-15T10:30:00Z",
      status: "connected",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "SEB",
      balance: 15420.18,
      currency: "EUR",
      lastSync: "2024-01-15T09:15:00Z",
      status: "connected",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Revolut",
      balance: 543.67,
      currency: "EUR",
      lastSync: "2024-01-15T11:00:00Z",
      status: "connected",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ],
  gmail: {
    connected: true,
    email: "simas@gmail.com",
    lastSync: "2024-01-15T11:30:00Z",
    receiptsFound: 23,
    billsFound: 8,
  },
  transactions: [
    {
      id: 1,
      description: "Maxima",
      amount: -45.67,
      category: "Maistas",
      date: "2024-01-15",
      account: "Swedbank",
      type: "expense",
    },
    {
      id: 2,
      description: "Atlyginimas",
      amount: 2500.0,
      category: "Pajamos",
      date: "2024-01-15",
      account: "Swedbank",
      type: "income",
    },
    {
      id: 3,
      description: "Netflix",
      amount: -12.99,
      category: "Pramogos",
      date: "2024-01-14",
      account: "Revolut",
      type: "expense",
    },
    {
      id: 4,
      description: "Elektros sąskaita",
      amount: -89.34,
      category: "Komunaliniai",
      date: "2024-01-14",
      account: "Swedbank",
      type: "expense",
    },
  ],
  analytics: {
    totalBalance: 18811.17,
    monthlyIncome: 2500.0,
    monthlyExpenses: 1247.83,
    savingsRate: 50.1,
    categories: [
      { name: "Maistas", amount: 456.78, percentage: 36.6, color: "#2563EB" },
      {
        name: "Transportas",
        amount: 234.56,
        percentage: 18.8,
        color: "#EB2563",
      },
      { name: "Pramogos", amount: 189.34, percentage: 15.2, color: "#63EB25" },
      {
        name: "Komunaliniai",
        amount: 167.89,
        percentage: 13.4,
        color: "#F59E0B",
      },
      { name: "Kita", amount: 199.26, percentage: 16.0, color: "#8B5CF6" },
    ],
  },
};

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter()
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };
  const navigateToAddConnection = () => {
    router.push('/skydelis/nauja-saskaita')
  }
  const [theme, setTheme] = useState("dark");
  const currentTheme = themes[theme];
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <div className="min-h-screen bg-[#0A0A20] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[5%] left-[5%] h-[300px] w-[300px] rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#EB2563]/10 blur-[100px]" />
        <div className="absolute top-[60%] left-[70%] h-[250px] w-[250px] rounded-full bg-[#63EB25]/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#0A0A20]/80 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#2563EB] via-[#EB2563] to-[#63EB25] p-[2px]">
                  <div className="h-full w-full rounded-[calc(0.75rem-2px)] bg-[#0A0A20] flex items-center justify-center">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#EB2563] to-[#63EB25]">
                      B
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Valdymo skydas
                  </h1>
                  <p className="text-sm text-white/60">Sveiki, Simai! 👋</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Atnaujinti</span>
                </button>
                <button className="flex items-center space-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Pranešimai</span>
                </button>
                <button className="flex items-center space-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Nustatymai</span>
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
              </div>
            </div>
          </div>

          <div className=" gap-8 mb-8 p-8 md:px-16">
            {/* Bank Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-[#1A1A40]/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-[#2563EB]" />
                    <span>Sąskaitos</span>
                  </h3>
                  <button onClick={() => navigateToAddConnection()} className="flex items-center space-x-2 rounded-lg bg-secondary px-4 py-2 text-white font-medium transition-all cursor-pointer duration-300">
                    <Plus className="h-4 w-4" />
                    <span>Pridėti</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {mockData.accounts.map((account) => (
                    <BankConnection
                      bank={account.name}
                      currentBalance={account.balance}
                      lastConnected={account.lastSync}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
