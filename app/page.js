import Footer from "@/components/UI/Footer";
import Hero from "@/components/UI/Homepage/Hero";
import HowItWorks from "@/components/UI/Homepage/HowItWorks";
import MovingBanks from "@/components/UI/Homepage/MovingBanks";
import Pricing from "@/components/UI/Homepage/Pricing";
import Nav from "@/components/UI/Nav";
import { getCurrentUser } from "./lib/auth/currentUser";

export default async function Home() {
  const navLinks = [
    { href: "#kaip-tai-veikia", label: "Kaip tai veikia?" },
    { href: "/#kainos", label: "Kainos" },
  ];
  const user = await getCurrentUser();
  let actions = null;
  if (user) {
    actions = 'loggedIn';
  }
  console.log(user, "our user");
  return (
    <div className="bg-black h-fit">
      <Nav navLinks={navLinks} loginButtons actions />
      <Hero />
      <HowItWorks />
      <Pricing />
      <MovingBanks />
      <Footer />
    </div>
  );
}
