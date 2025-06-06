"use client";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import Label from "../Label";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Pradedantis",
      price: "0",
      period: "mėn",
      description: "Nemokamas planas su pagrindinėmis funkcijomis",
      features: [
        "20 transakcijų per mėnesį",
        "5 kategorijos",
        "Pagrindinė analitika",
        "Viena banko sąskaita",
      ],
      color: "from-[#2563EB] to-[#63EB25]",
      popular: false,
    },
    {
      name: "Profesionalus",
      price: "3",
      period: "mėn",
      description: "Daugiau funkcijų išsamiai finansų analizei",
      features: [
        "Neribotos transakcijos/kategorijos",
        "Išsami mėnesio kiekvieno grafinė analizė",
        "Duomenų eksportavimas į PDF/Excel",
        "DI įžvalgos",
        "Kelių sąskaitų susiejimas",
      ],
      color: "from-[#EB2563] to-[#2563EB]",
      popular: true,
    },
  ];

  return (
    <section
      id="kainos"
      className="text-white scroll-mt-24 flex flex-col items-center justify-center py-16"
    >
      <div className="flex flex-col items-center justify-center gap-y-4 mb-12 px-4">
        <Label className="bg-secondary px-4 py-1 rounded-full text-sm">
          30 dienų nemokamai
        </Label>
        <h3 className="text-4xl font-bold mb-2">Įkainiai</h3>
        <p className="text-gray-400 text-center max-w-2xl">
          Du planai – neribotos galimybės. Išbandykite profesionalų planą 30
          dienų nemokamai ir atraskite, kaip analizuoti savo finansus.
        </p>
      </div>

      <div className="flex gap-12 w-full max-w-6xl flex-col sm:flex-row px-7 justify-center">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`relative rounded-2xl border backdrop-blur-sm p-8 transition-all duration-500 group hover:border-opacity-50 ${
              plan.popular
                ? "bg-white/10 border-white/30 scale-105"
                : "bg-white/5 border-white/20"
            }`}
            style={{
              boxShadow: plan.popular
                ? `0 20px 40px ${plan.shadowColor}`
                : `0 10px 20px rgba(255,255,255,0.1)`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div
                  className={`bg-gradient-to-r ${plan.color} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}
                >
                  <Star className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    Rekomenduojamas
                  </span>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  €{plan.price}
                </span>
                <span className="text-gray-400">/ {plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <motion.li
                  key={featureIndex}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center`}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/registracija">
              <motion.button
                className={`w-full cursor-pointer py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl`
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2 ">
                  <Zap className="h-4 w-4" />
                  Pradėti {plan.name === "Pradedantis" ? "dabar" : "nemokamai"}
                </div>
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
