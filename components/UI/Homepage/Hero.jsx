"use client";

import { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import DashboardMockup from "../DashboardMockup";
import Button from "../Button";
export default function Hero() {
  const canvasRef = useRef(null);

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
        size: Math.random() * 5 + 5,
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
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-between gap-12 pt-10 md:pt-20">
          {/* Left column - Text content */}
          <motion.div
            className="w-full text-center"
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
                Valdyk savo
              </span>
              <div className="relative inline-block mt-1">
                {/* Animated gradient background */}
                <span className="absolute -inset-[1px] bg-gradient-to-r from-[#2563EB] to-[#EB2563] opacity-40 blur-3xl rounded-lg"></span>

                {/* Animated gradient text */}
                <span className="relative bg-gradient-to-r from-[#2563EB] to-[#EB2563] bg-clip-text text-transparent animate-gradient">
                  finansus išmaniai
                </span>
              </div>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Lengvai sek savo išlaidas, planuok biudžetą ir gauk
              mėnesines ataskaitas. Užsiregistruok dabar ir pasiek savo finansinius tikslus.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-start mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  variant="ctaPrimary"
                  className="flex items-center px-4 py-3 hover:shadow-[0_0_20px_var(--color-secondary)]"
                >
                  Išbandyti nemokamai
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  variant="accent"
                  className="px-4 py-3 hover:shadow-[0_0_20px_var(--color-accent)]"
                >
                  Sužinoti daugiau
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            className="w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-2xl blur-sm opacity-50"></div>

              {/* Dashboard mockup */}
              <DashboardMockup />

              {/* Floating elements*/}
              <motion.div
                className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#63EB25] p-[2px] hidden md:block"
                animate={{
                  y: [0, -10, 0],
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
