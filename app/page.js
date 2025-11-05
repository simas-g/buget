import Footer from "@/components/UI/Footer";
import Hero from "@/components/UI/Homepage/Hero";
import HowItWorks from "@/components/UI/Homepage/HowItWorks";
import MovingBanks from "@/components/UI/Homepage/MovingBanks";
import Pricing from "@/components/UI/Homepage/Pricing";
import Nav from "@/components/UI/Nav";
import LandingPageWrapper from "@/components/UI/Homepage/LandingPageWrapper";
import { getCurrentUser, getFullUser } from "./lib/auth/currentUser";

export default async function Home() {
  const user = await getFullUser();
  let actions = false;
  if (user) {
    actions = true;
  }
  return (
    <LandingPageWrapper>
      <Nav loginButtons actions={actions} />
      <Hero />
      {/* <HowItWorks /> */}
      {/* <Pricing /> */}
      <MovingBanks />
      {/* <Footer /> */}
    </LandingPageWrapper>
  );
}
