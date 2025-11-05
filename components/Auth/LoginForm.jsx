"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import GlowingCard from "../UI/GlowingCard";
import { login } from "@/app/lib/auth/login";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/lib/ThemeContext";

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const { theme } = useTheme();
  const baseClasses =
    "inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#2563EB] to-[#EB2563] text-white hover:shadow-[0_0_20px_var(--color-secondary)] focus:ring-[#2563EB]",
    outline: theme === "dark"
      ? "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 focus:ring-white/20"
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-300",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", error = false, ...props }) => {
  const { theme } = useTheme();
  const baseClasses =
    "w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const themeClasses = theme === "dark"
    ? "bg-[#1A1A40]/50 text-white placeholder:text-white/50 focus:ring-offset-[#0A0A20]"
    : "bg-white text-slate-900 placeholder:text-slate-400 focus:ring-offset-white";
  const errorClasses = error
    ? "border-[#EB2563] focus:border-[#EB2563] focus:ring-[#EB2563]/20"
    : theme === "dark"
      ? "border-white/20 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
      : "border-slate-300 focus:border-[#2563EB] focus:ring-[#2563EB]/20";

  return (
    <input
      className={`${baseClasses} ${themeClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};

const Label = ({ className = "", children, ...props }) => {
  const { theme } = useTheme();
  return (
    <label
      className={`block text-sm font-medium ${
        theme === "dark" ? "text-white/90" : "text-slate-700"
      } ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

const Separator = ({ className }) => {
  const { theme } = useTheme();
  return <div className={`h-px ${
    theme === "dark" ? "bg-white/20" : "bg-slate-200"
  } ${className}`} />;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { theme } = useTheme();
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "El. paštas yra privalomas";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Neteisingas el. pašto formatas";
    }

    if (!password) {
      newErrors.password = "Slaptažodis yra privalomas";
    } else if (password.length < 6) {
      newErrors.password = "Slaptažodis turi būti bent 6 simbolių";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const data = {
      email,
      password,
    };
    try {
      await login(data);
    } catch (error) {
      setErrors(prev => ({
        ...prev, account: "Neteisingas slaptažodis"}
      ))
    } finally {
      router.push('/skydelis')
      setIsLoading(false)
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    // Simulate Google OAuth
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Signing in with Google");
      // Handle Google sign in
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlowingCard>
      <p className={`mb-8 ${theme === "dark" ? "text-white/70" : "text-slate-600"}`}>
        Prisijunkite prie savo paskyros
      </p>

      {/* Google Sign In */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        className="w-full mb-6 h-12"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? "Prisijungiama..." : "Tęsti su Google"}
      </Button>

      {/* Divider */}
      <div className="relative mb-6">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`px-4 text-sm ${
            theme === "dark" ? "bg-[#0A0A20] text-white/50" : "bg-white text-slate-500"
          }`}>
            arba
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">El. paštas</Label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === "dark" ? "text-white/50" : "text-slate-400"
            }`} />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jusu@email.com"
              className="pl-10 h-12"
              error={!!errors.email}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#EB2563]"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Slaptažodis</Label>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === "dark" ? "text-white/50" : "text-slate-400"
            }`} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10 h-12"
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                theme === "dark" ? "text-white/50 hover:text-white/80" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#EB2563]"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-[#2563EB] transition-colors duration-300"
          >
            Pamiršote slaptažodį?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 group"
        >
          <span className="flex items-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Prisijungiama...
              </>
            ) : (
              <>
                Prisijungti
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </span>
        </Button>
        <p className="text-red-400 text-sm">{errors?.account}</p>
      </form>

      {/* Sign Up Link */}
      <div className="mt-2 text-center">
        <p className={theme === "dark" ? "text-white/70" : "text-slate-600"}>
          Neturite paskyros?{" "}
          <Link
            href="/registracija"
            className="text-[#2563EB] font-medium transition-colors duration-300 relative"
          >
            Registruotis čia
          </Link>
        </p>
      </div>

      {/* Additional Links
      <div className="mt-6 flex justify-center space-x-6 text-sm">
        <Link
          href="/privacy"
          className="text-white/50 hover:text-white/80 transition-colors duration-300"
        >
          Privatumo politika
        </Link>
        <Link
          href="/terms"
          className="text-white/50 hover:text-white/80 transition-colors duration-300"
        >
          Naudojimo sąlygos
        </Link>
      </div> */}
    </GlowingCard>
  );
}
