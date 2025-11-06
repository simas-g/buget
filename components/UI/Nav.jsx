"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/app/lib/ThemeContext";

export default function Navigation({
  navLinks = [],
  loginButtons = false,
  actions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  let buttons;
  console.log(actions, 'our actions')
  if (actions == true ) {
    buttons = (
      <>
        <Link href="/skydelis">
          <Button variant="primaryGradient" className="px-4 py-2 w-full">
            Valdymo skydelis
          </Button>
        </Link>
      </>
    );
  } else {
    buttons = (
      <div className="flex items-center justify-center flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Link href="/test-mode">
          <Button variant="" className="px-4 py-2 w-full">
            Išbandyti testiniame režime
          </Button>
        </Link>
        <Link href="/prisijungti">
          <Button variant="basic" className="px-4 py-2 w-full">
            Prisijungti
          </Button>
        </Link>
        <Link href="/registracija">
          <Button variant="primaryGradient" className="px-4 py-2 w-full">
            Registruotis
          </Button>
        </Link>
      </div>
    );
  }
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === "dark"
            ? "bg-[#0A0A20]/80 backdrop-blur-lg py-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            : "bg-white/80 backdrop-blur-lg py-3 shadow-lg shadow-slate-200/50"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" width={60} height={60} alt="buget.lt" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors relative ${
                    theme === "dark"
                      ? "text-white/80 hover:text-white"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {actions && <ThemeToggle />}
          {loginButtons === true && buttons}
        </div>

        {/* Mobile Theme Toggle & Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {actions && <ThemeToggle />}
          <button
            className="z-50 w-10 h-10 relative focus:outline-none cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="block w-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                className={`block absolute h-0.5 w-8 transform transition duration-300 ease-in-out ${
                  theme === "dark" ? "bg-white" : "bg-slate-900"
                } ${isOpen ? "rotate-45" : "-translate-y-2.5"}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-8 transform transition duration-300 ease-in-out ${
                  theme === "dark" ? "bg-white" : "bg-slate-900"
                } ${isOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-8 transform transition duration-300 ease-in-out ${
                  theme === "dark" ? "bg-white" : "bg-slate-900"
                } ${isOpen ? "-rotate-45" : "translate-y-2.5"}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`fixed inset-0 h-screen backdrop-blur-lg flex flex-col justify-center items-center z-40 md:hidden px-6 ${
                theme === "dark" ? "bg-[#0A0A20]/95" : "bg-white/95"
              }`}
            >
              <ul className="flex flex-col space-y-8 text-center w-full">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl font-bold transition-colors ${
                        theme === "dark"
                          ? "text-white hover:text-[#2563EB]"
                          : "text-slate-900 hover:text-[#2563EB]"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col mt-12 w-full"
              >
                {buttons}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
