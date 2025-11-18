"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import GlowingCard from "../UI/GlowingCard";
import { signup } from "@/app/lib/auth/signup";
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

const Checkbox = ({ id, checked, onCheckedChange, className = "" }) => {
  const { theme } = useTheme();
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 ${
          checked
            ? "bg-[#63EB25] border-transparent"
            : theme === "dark"
              ? "border-white/30 hover:border-white/50"
              : "border-slate-300 hover:border-slate-400"
        } ${className}`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </label>
    </div>
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

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme } = useTheme();

  const validateForm = () => {
    const newErrors = {};
    console.log(formData);
    if (!formData.name.trim()) {
      newErrors.name = "Vardas yra privalomas";
    }

    if (!formData.email) {
      newErrors.email = "El. paštas yra privalomas";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Neteisingas el. pašto formatas";
    }

    if (!formData.password) {
      newErrors.password = "Slaptažodis yra privalomas";
    } else if (formData.password.length < 8) {
      newErrors.password = "Slaptažodis turi būti bent 8 simbolių";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Slaptažodžiai nesutampa";
    }

    console.log(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signup(formData);
      console.log("Signing up with:", formData);
      // Handle successful sign up
    } catch (error) {
      console.error("Sign up error:", error);
      setErrors((prev) => ({ ...prev, alreadyExist: error }));
    } finally {
      setIsLoading(false);
      window.location.href = '/skydelis'
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Signing up with Google");
      // Handle Google sign up
    } catch (error) {
      console.error("Google sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <GlowingCard>
      <p className={`mb-8 ${theme === "dark" ? "text-white/70" : "text-slate-600"}`}>
        Susikurkite paskyrą
      </p>
      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="space-y-2">
            <Label htmlFor="name">Vardas</Label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === "dark" ? "text-white/50" : "text-slate-400"
              }`} />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Jūsų vardas"
                className="pl-10 h-12"
                error={!!errors.name}
              />
            </div>
            <p className="text-red-400 text-xs">{errors.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">El. paštas</Label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === "dark" ? "text-white/50" : "text-slate-400"
              }`} />
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="jusu@email.com"
                className="pl-10 h-12"
                error={!!errors.email}
              />
            </div>
            <p className="text-red-400 text-xs">{errors.email}</p>
          </div>
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
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
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
          <p className="text-red-400 text-xs">{errors.password}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Pakartokite slaptažodį</Label>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === "dark" ? "text-white/50" : "text-slate-400"
            }`} />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                updateFormData("confirmPassword", e.target.value)
              }
              placeholder="••••••••"
              className="pl-10 pr-10 h-12"
              error={!!errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                theme === "dark" ? "text-white/50 hover:text-white/80" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors?.alreadyExist && (
            <p className="text-red-400">Vartotojas jau egzistuoja</p>
          )}
        </div>

        {/* Terms and Conditions */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                updateFormData("agreeToTerms", checked)
              }
            />

            <span
              className={`text-sm ${
                errors?.agreeToTerms ? "text-red-400" : "text-white/80"
              } leading-relaxed`}
            >
              Sutinku su{" "}
              <Link
                href="/privacy"
                className={`cursor-pointer ${
                  errors?.agreeToTerms ? "text-red-400" : "text-[#2563EB]"
                }`}
              >
                privatumo politika
              </Link>{" "}
              {" ir "}
              <Link
                href="/terms"
                className={`cursor-pointer ${
                  errors?.agreeToTerms ? "text-red-400" : "text-[#2563EB]"
                }`}
              >
                naudojimo sąlygomis
              </Link>{" "}
            </span>
          </div>
        </div> */}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full flex justify-center h-12 group"
        >
          <span className="flex items-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registruojamasi...
              </>
            ) : (
              <>
                Sukurti paskyrą
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </span>
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <p className={theme === "dark" ? "text-white/70" : "text-slate-600"}>
          Jau turite paskyrą?{" "}
          <Link
            href="/prisijungti"
            className="text-[#2563EB] font-medium relative "
          >
            Prisijungti čia
          </Link>
        </p>
      </div>

      {/* Additional Links */}
      {/* <div className="mt-6 flex justify-center space-x-6 text-sm">
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
