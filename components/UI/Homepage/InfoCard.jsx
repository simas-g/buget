"use client";
import { motion } from "framer-motion";
import React from "react";
import {
  CheckCircle,
  Download,
  GitGraph,
  Shield,
  Tag,
} from "lucide-react";

const Icons = {
  Shield: Shield,
  Download: Download,
  GitGraph: GitGraph,
  Tag: Tag,
};
export default function InfoCard({ title, description, icon, list, id }) {
  const IconComponent = Icons[icon];

  // Generic gradient for all cards
  const gradientColor = "from-secondary to-accent";

  // Generic glow color for all cards
  const glowColor = "shadow-accent/25";

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 10 }}
      transition={{ delay: id * 0.1 + id * 0.05 }}
      className="group relative w-full"
    >

      {/* Outer glow effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradientColor} rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500`}
      ></div>

      {/* Animated border gradient */}
      <div
        className={`absolute -inset-px bg-gradient-to-r ${gradientColor} rounded-xl opacity-50 animate-pulse`}
      ></div>

      {/* Main card */}
      <div
        className={`relative h-full bg-[#0A0A20]/100 backdrop-blur-xl rounded-xl border border-primary/20 transform transition-all duration-500 hover:scale-[1.02] ${glowColor} hover:shadow-2xl`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
        </div>

        {/* Floating orbs for extra visual appeal */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-full blur-xl opacity-60 animate-pulse"></div>
        <div
          className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-accent/15 to-secondary/20 rounded-full blur-lg opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-4">
          {/* ID Badge */}
          <div className="flex justify-between items-start">
            <span
              className={`inline-flex items-center justify-center w-16 h-16 absolute right-10 -top-5 rounded-full bg-black border-gray-400 border text-white text-lg font-bold shadow-lg`}
            >
              {id + 1}
            </span>
          </div>

          {/* Icon */}
          <div
            className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradientColor} shadow-lg transform hover:scale-110 transition-transform duration-300`}
          >
            {IconComponent && (
              <IconComponent size={32} className="text-white drop-shadow-lg" />
            )}
          </div>

          {/* Title */}
          <h4 className="text-xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h4>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed">{description}</p>

          {/* List */}
          <ul className="space-y-3 pt-2">
            {list.map((item, index) => (
              <li
                className="flex items-start text-sm text-gray-300 group/item"
                key={index}
              >
                <CheckCircle
                  className="inline-block mr-3 mt-0.5 text-primary flex-shrink-0"
                  size={16}
                />
                <span className="group-hover/item:text-white transition-colors duration-200">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
