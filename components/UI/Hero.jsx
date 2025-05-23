"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  PieChart,
  TrendingUp,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    const colors = ["#2563EB", "#EB2563", "#63EB25"];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
      });
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    "Automatinis išlaidų sekimas",
    "Išmanus biudžeto planavimas",
    "Finansinės įžvalgos",
    "Saugus duomenų šifravimas",
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />

      {/* Background gradient blobs */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#2563EB] opacity-30 blur-[150px] animate-[pulse_15s_ease-in-out_infinite]"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />
        <div
          className="absolute top-[30%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-[#EB2563] opacity-30 blur-[150px] animate-[pulse_20s_ease-in-out_infinite_2s]"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-[#63EB25] opacity-30 blur-[150px] animate-[pulse_18s_ease-in-out_infinite_1s]"
          style={{ transform: `translateY(${scrollY * 0.03}px)` }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-10 md:pt-20">
          {/* Left column - Text content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-4 py-1 text-sm font-medium text-[#2563EB] backdrop-blur-sm mb-6">
              <Sparkles className="mr-2 h-4 w-4 text-[#63EB25]" />
              Naujos kartos finansų valdymas
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="block text-white drop-shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                Valdykite savo
              </span>
              <div className="relative inline-block mt-1">
                {/* Animated gradient background */}
                <span className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] via-[#EB2563] to-[#63EB25] opacity-50 blur-xl rounded-lg animate-pulse"></span>

                {/* Animated gradient text */}
                <span className="relative bg-gradient-to-r from-[#2563EB] via-[#EB2563] to-[#63EB25] bg-clip-text text-transparent animate-gradient">
                  finansus išmaniai
                </span>
              </div>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
              Lengvai sekite savo išlaidas, planuokite biudžetą, gaukite mėnesines ataskaitas ir pasiekite savo finansinius tikslus.
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 text-[#63EB25] mr-2 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link
                  href="/registruotis"
                  className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,235,37,0.7)] border border-white/10 w-full sm:w-auto flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center">
                    Pradėti nemokamai
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r bg-rred from-bgreen to-bblue opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Link
                  href="#kaip-tai-veikia"
                  className="rounded-xl border-2 border-bblue bg-transparent px-8 py-4 text-lg font-medium text-bred transition-all duration-300 hover:bg-bred hover:text-white hover:shadow-[0_0_30px_rgba(235,37,99,0.7)] w-full sm:w-auto flex items-center justify-center"
                >
                  Sužinoti daugiau
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Dashboard preview */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] via-[#EB2563] to-[#63EB25] rounded-2xl blur-xl opacity-50 animate-pulse"></div>

              {/* Dashboard mockup */}
              <div className="relative rounded-2xl bg-[#0A0A20]/80 backdrop-blur-xl border border-white/10 p-1 shadow-[0_0_25px_rgba(37,99,235,0.3)]">
                <div className="rounded-xl overflow-hidden">
                  {/* Dashboard header */}
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#EB2563] p-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">
                        Finansų skydelis
                      </h3>
                      <div className="flex space-x-2">
                        <div className="h-3 w-3 rounded-full bg-[#EB2563]" />
                        <div className="h-3 w-3 rounded-full bg-[#63EB25]" />
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-6 bg-[#0A0A20]/95">
                    {/* Balance overview */}
                    <div className="mb-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/70">
                          Bendra suma
                        </span>
                        <span className="text-2xl font-bold text-white">
                          24,562.00 €
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-[#1A1A40] p-[1px]">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#63EB25] animate-pulse" />
                      </div>
                    </div>

                    {/* Stats cards */}
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <motion.div
                        className="rounded-lg bg-[#1A1A40]/50 p-4 backdrop-blur-sm border border-white/5 hover:border-[#2563EB]/30 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] group"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <BarChart2 className="mb-2 h-6 w-6 text-[#2563EB] group-hover:text-[#63EB25] transition-colors" />
                        <p className="text-xs text-white/70">Pajamos</p>
                        <p className="text-lg font-bold text-white">8,350 €</p>
                        <p className="text-xs text-[#63EB25]">+12.5%</p>
                      </motion.div>
                      <motion.div
                        className="rounded-lg bg-[#1A1A40]/50 p-4 backdrop-blur-sm border border-white/5 hover:border-[#EB2563]/30 transition-all hover:shadow-[0_0_15px_rgba(235,37,99,0.2)] group"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <PieChart className="mb-2 h-6 w-6 text-[#EB2563] group-hover:text-[#2563EB] transition-colors" />
                        <p className="text-xs text-white/70">Išlaidos</p>
                        <p className="text-lg font-bold text-white">3,450 €</p>
                        <p className="text-xs text-[#EB2563]">-4.3%</p>
                      </motion.div>
                      <motion.div
                        className="rounded-lg bg-[#1A1A40]/50 p-4 backdrop-blur-sm border border-white/5 hover:border-[#63EB25]/30 transition-all hover:shadow-[0_0_15px_rgba(99,235,37,0.2)] group"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <TrendingUp className="mb-2 h-6 w-6 text-[#63EB25] group-hover:text-[#EB2563] transition-colors" />
                        <p className="text-xs text-white/70">Santaupos</p>
                        <p className="text-lg font-bold text-white">4,900 €</p>
                        <p className="text-xs text-[#63EB25]">+18.2%</p>
                      </motion.div>
                    </div>

                    {/* Recent transactions */}
                    <div className="space-y-4">
                      <motion.div
                        className="rounded-lg bg-[#1A1A40]/50 p-4 backdrop-blur-sm border border-white/5 hover:border-[#2563EB]/30 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#63EB25] shadow-[0_0_10px_rgba(99,235,37,0.3)]">
                              <svg
                                className="h-5 w-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                Atlyginimas
                              </p>
                              <p className="text-xs text-white/70">
                                Šiandien, 10:45
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#63EB25]">
                              +5,400 €
                            </p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        className="rounded-lg bg-[#1A1A40]/50 p-4 backdrop-blur-sm border border-white/5 hover:border-[#EB2563]/30 transition-all hover:shadow-[0_0_15px_rgba(235,37,99,0.2)]"
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#EB2563] to-[#2563EB] shadow-[0_0_10px_rgba(235,37,99,0.3)]">
                              <svg
                                className="h-5 w-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                Pirkiniai
                              </p>
                              <p className="text-xs text-white/70">
                                Vakar, 14:25
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#EB2563]">-240 €</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual interest */}
              <motion.div
                className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#63EB25] p-[2px] hidden md:block"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="h-full w-full rounded-full bg-[#0A0A20] flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#63EB25]" />
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-r from-[#EB2563] to-[#2563EB] p-[2px] hidden md:block"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="h-full w-full rounded-full bg-[#0A0A20] flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-[#EB2563]" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
