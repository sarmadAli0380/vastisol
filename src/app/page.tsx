import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solutions } from "@/components/sections/solutions";
import { PropertyManagement } from "@/components/sections/property-management";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyVastisol } from "@/components/sections/why-vastisol";
import { Vision } from "@/components/sections/vision";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Solutions />
      <PropertyManagement />
      <HowItWorks />
      <WhyVastisol />
      <Vision />
      <FinalCta />
    </>
  );
}
