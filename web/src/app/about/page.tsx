"use client";

import HeroSection from "../components/about/HeroSection";
import SejarahSection from "../components/about/SejarahSection";
import VisiMisiSection from "../components/about/VisiMisiSection";
export default function AboutUsPage() {
  return (
    <div className="w-full pb-20">
      <HeroSection />
      <SejarahSection />
      <VisiMisiSection />
    </div>
  );
}
