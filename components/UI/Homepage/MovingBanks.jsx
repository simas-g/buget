"use client";
import Image from "next/image";
import { useEffect } from "react";
import Button from "../Button";
export default function MovingBanks() {
  const size = { width: 120, height: 120 };
  const banks = [
    { src: "/banks/swedbank.png", alt: "Swedbank" },
    { src: "/banks/seb.png", alt: "SEB" },
    { src: "/banks/luminor.png", alt: "Luminor" },
    { src: "/banks/paypal.png", alt: "paypal" },
    { src: "/banks/revolut.svg", alt: "revolut" },
    { src: "/banks/paysera.png", alt: "Paysera" },
  ];
useEffect(() => {
  const container = document.querySelector('.scrolling-banks');
  if (container) {
    console.log('Container width:', container.scrollWidth);
    console.log('First set should be:', (120 * 6) + (120 * 5)); // 1320px
  }
}, []);
  return (
    <section className="text-white scroll-mt-24 flex flex-col items-center justify-center py-16">
      <div className="flex flex-col items-center justify-center gap-y-4 mb-12 px-4">
        <h3 className="text-4xl font-bold mb-2">Bankų sąrašas</h3>
        <p className="text-gray-400 text-center max-w-2xl">
          Šiuo metu palaikome šias bankų sąskaitas. Jei jūsų banko nėra,
          susisiekite su mumis.
        </p>
      <Button className="px-4 py-2" variant="basic">Peržiūrėti visus</Button>

      </div>
      
      <div className="overflow-hidden w-[95%] relative" style={{
        mask: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}>
        <ul
          aria-hidden="true"
          style={{
            animation: "scrolling-banks 10s linear infinite",
          }}
          className="select-none scrolling-banks justify-between flex gap-30 w-full items-center"
        >
          {banks.map((bank) => (
            <li key={bank.alt} className="shrink-0 pointer-events-none select-none">
              <Image {...bank} {...size}></Image>
            </li>
          ))}
          {banks.map((bank) => (
            <li key={bank.alt + "-2"} className="shrink-0 pointer-events-none select-none">
              <Image {...bank} {...size}></Image>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
