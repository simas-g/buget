"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,

  Heart,
  Shield,
  Zap,
  TrendingUp,
  Star,
  ExternalLink,
  Info,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {

  const footerSections = [
    {
      title: "Produktas",
      links: [
        {
          href: "/#kaip-tai-veikia",
          label: "Funkcijos",
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          href: "/#kainos",
          label: "Kainos",
          icon: <DollarSign className="h-4 w-4" />,
        },
        {
          href: "/#demo",
          label: "Demonstracija",
          icon: <ExternalLink className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Pagalba",
      links: [
        { href: "/duk", label: "DUK", icon: <Info className="h-4 w-4" /> },
      ],
    },
    {
      title: "Papildoma informacija",
      links: [
        {
          href: "/privatumo-politika",
          label: "Privatumo politika",
          icon: <Shield className="h-4 w-4" />,
        },
        {
          href: "/naudojimosi-salygos",
          label: "Naudojimosi sąlygos",
          icon: <Shield className="h-4 w-4" />,
        }
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "El. paštas",
      value: "simas@buget.lt",
      href: "mailto:simas@buget.lt",
    },
  ];

  return (
    <footer className="relative shadow-[0_0_20px_rgba(37,99,235,0.3)] backdrop-blur-3xl sm:px-4 px-2 bg-[#0A0A20] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#EB2563]/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[30%] h-[200px] w-[200px] rounded-full bg-[#63EB25]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top section with logo and description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-col">
            {/* Logo and description */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center space-x-3 mb-6 "
              >
                <Image
                  width={100}
                  height={100}
                  src="/logo.svg"
                />
              </Link>
              <p className="text-lg text-white/80 mb-6 leading-relaxed max-w-md">
                Išmanus finansų valdymo įrankis, padedantis tau sekti savo
                išlaidas ir pajamas. Susiek savo banko sąskaitą su Buget,
                priskirk kategorijas operacijoms ir stebėk savo finansus.
              </p>
            </div>
            {/* Contact information */}
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    className="flex items-center w-fit space-x-4 p-4 px-8 rounded-lg bg-[#1A1A40]/30 border border-white/10 hover:border-white/20 hover:bg-[#1A1A40]/50 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#63EB25] text-white group-hover:shadow-[0_0_15px_rgba(99,235,37,0.3)] transition-all duration-300">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{contact.label}</p>
                      <p className="text-white font-medium">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
          </div>
        </motion.div>

        {/* Links sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16"
        >
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="group flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-300"
                    >
                      <span className="text-white/40 group-hover:text-[#63EB25] transition-colors duration-300">
                        {link.icon}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex items-center space-x-2 text-white/50">
            <span>
              © {new Date().getFullYear()} Buget. Visos teisės saugomos.
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
