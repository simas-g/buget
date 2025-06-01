import Hero from "@/components/UI/Homepage/Hero";
import HowItWorks from "@/components/UI/Homepage/HowItWorks";
import Pricing from "@/components/UI/Homepage/Pricing";
import Nav from "@/components/UI/Nav";

export default function Home() {
  const navLinks = [
    { href: "#kaip-tai-veikia", label: "Kaip tai veikia?" },
    { href: "/#kainos", label: "Kainos" },
  ];
  return (
    <div className="bg-black h-fit pb-50">
      <Nav navLinks={navLinks} loginButtons/>
      <Hero/>
      <HowItWorks/>
      <Pricing/>
    </div>
  );
}
