"use client";

import HeroSection from "../components/about/HeroSection";
import IntroCard from "../components/about/IntroCard";
import SejarahSection from "../components/about/SejarahSection";
export default function AboutUsPage() {
  return (
    <div className="w-full pb-20">
      <HeroSection />
      <IntroCard />
      <SejarahSection />
    </div>
  );
}
