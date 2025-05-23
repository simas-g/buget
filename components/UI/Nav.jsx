"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const navLinks = [
    { href: "#kaip-tai-veikia", label: "Kaip tai veikia?" },
    { href: "#kainos", label: "Kainos" },
    { href: "/skydelis", label: "Skydelis" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A20]/80 backdrop-blur-lg py-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/">
            <Image src="/logo.svg" width={60} height={60} alt="buget.lt"/>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#2563EB] after:to-[#EB2563] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            <Link
              href="/prisijungti"
              className="px-4 py-2 rounded-lg border border-[#EB2563] text-[#EB2563] hover:bg-[#EB2563] hover:text-white transition-all duration-300"
            >
              Prisijungti
            </Link>
            <Link
              href="/registruotis"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#63EB25] text-white hover:shadow-[0_0_20px_rgba(99,235,37,0.5)] transition-all duration-300"
            >
              Registruotis
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 w-10 h-10 relative focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
          aria-expanded={isOpen}
        >
          <div className="block w-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out ${
                isOpen ? "rotate-45" : "-translate-y-2.5"
              }`}
            ></span>
            <span
              className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block absolute h-0.5 w-8 bg-white transform transition duration-300 ease-in-out ${
                isOpen ? "-rotate-45" : "translate-y-2.5"
              }`}
            ></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 h-screen bg-[#0A0A20]/95 backdrop-blur-lg flex flex-col justify-center items-center z-40 md:hidden"
            >
              <ul className="flex flex-col space-y-8 text-center">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-2xl font-bold text-white hover:text-[#2563EB] transition-colors"
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
                className="flex flex-col space-y-4 mt-12"
              >
                <Link
                  href="/prisijungti"
                  className="px-8 py-3 rounded-xl border-2 border-[#EB2563] text-[#EB2563] text-lg font-medium hover:bg-[#EB2563] hover:text-white transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Prisijungti
                </Link>
                <Link
                  href="/registruotis"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#63EB25] text-white text-lg font-medium hover:shadow-[0_0_20px_rgba(99,235,37,0.5)] transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Registruotis
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}