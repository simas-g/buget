import Hero from "@/components/UI/Homepage/Hero";
import HowItWorks from "@/components/UI/Homepage/HowItWorks";
import Pricing from "@/components/UI/Homepage/Pricing";
import Nav from "@/components/UI/Nav";

export default function Home() {
  return (
    <div className="bg-black h-fit pb-50">
      <Nav/>
      <Hero/>
      <HowItWorks/>
      <Pricing/>
    </div>
  );
}
